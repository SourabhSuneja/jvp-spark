// Supabase Edge Function: fetch-and-push
// Purpose: Fetches subscriptions, breaks them into batches, and calls the Deno function concurrently to send push notifications

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sourabhsuneja.github.io", // Frontend URL
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BATCH_SIZE = 100; // Optimal batch size can be tuned
const DENO_URL = "https://send-push-notification.deno.dev/"; // Deno deploy URL

// Centralized response function
function createResponse(body: any, status: number = 200) {
  return new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": typeof body === "string" ? "text/plain" : "application/json",
      },
    }
  );
}

// Main Edge function
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return createResponse("ok", 200);
  }

  try {
    if (req.method !== "POST") {
      return createResponse({ error: "Method not allowed" }, 405);
    }

    const { passcode, message, detailed_message, target_type, target_tokens, sent_by } = await req.json();

    // Step 1: Validate passcode
    const SUPABASE_PASSCODE = Deno.env.get("PUSH_SECRET_PASSCODE");
    if (!SUPABASE_PASSCODE || passcode !== SUPABASE_PASSCODE) {
      return createResponse({ error: "Unauthorized" }, 401);
    }

    // Step 2: Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Step 3: Validate message
    if (!message || !message.title || !message.body) {
      return createResponse({ error: "Invalid message object" }, 400);
    }

    // Step 4: Insert the notification first
    const notificationID = message?.data?.notificationID || crypto.randomUUID();
    const { error: insertError } = await supabase.from("notification_logs").insert([{
      id: notificationID,
      message_title: message.title,
      message_body: message.body,
      detailed_message,
      target_type,
      target_tokens,
      sent_by
    }]);

    if (insertError) {
      console.error("Failed to insert notification:", insertError.message);
    }

    // Step 5: Retrieve all targeted subscriptions
    const { data: subscriptions, error: subsError } = await getSubscriptions(supabase, target_type, target_tokens);

    if (subsError) {
      return createResponse({ error: subsError }, 400);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return createResponse({ message: "No subscriptions found" }, 404);
    }

    // Step 6: Batching subscriptions
    const subscriptionBatches = Array.from(
      { length: Math.ceil(subscriptions.length / BATCH_SIZE) },
      (_, i) => subscriptions
        .slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
        .map(s => s.subscription_object)
    );

    // Step 7: Concurrently send notifications
    const batchPromises = subscriptionBatches.map(batch =>
      fetch(DENO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: batch, message })
      }).then(res => res.json())
    );

    const results = await Promise.allSettled(batchPromises);

    // Step 8: Aggregate results
    let totalSuccessCount = 0;
    const allResults: any[] = [];

    results.forEach(result => {
      if (result.status === "fulfilled" && result.value?.results) {
        const batchSuccessCount = result.value.results.filter(r => r.status === "success").length;
        totalSuccessCount += batchSuccessCount;
        allResults.push(...result.value.results);
      } else {
        console.error("A batch failed:", result.reason || result.value);
      }
    });

    // Step 9: Update the aggregated notification details
    const { error: updateError } = await supabase
      .from("notification_logs")
      .update({
        targeted_recipients: subscriptions.length,
        success_count: totalSuccessCount
      })
      .eq("id", notificationID);

    if (updateError) {
      console.error("Failed to log notification:", updateError.message);
    }

    // Step 10: Return final response
    return createResponse({
      targeted_recipients: subscriptions.length,
      success_count: totalSuccessCount,
      results: allResults
    }, 200);

  } catch (err: any) {
    console.error("Error:", err);
    return createResponse({ error: err.message }, 500);
  }
});


// ================= Helper function =================
// Helper function to retrieve subscriptions
async function getSubscriptions(supabase, target_type, target_tokens) {
  try {
    let query = supabase.from("push_subscriptions").select(`
      subscription_object,
      student_id,
      students!inner(id, grade, section, access_token)
    `);
    if (target_type === "all") {
    // no filter
    } else if (target_type === "grade") {
      // Expect target_tokens to be an array of grades (like [6, 7])
      query = query.in("students.grade", target_tokens || []);
    } else if (target_type === "grade-section") {
      // Expect entries like ["6-A1", "7-A2"]
      const conditions = (target_tokens || []).map((gs)=>{
        const [grade, section] = gs.split("-");
        return {
          grade: parseInt(grade),
          section
        };
      });
      if (conditions.length > 0) {
        const grades = conditions.map((c)=>c.grade);
        const sections = conditions.map((c)=>c.section);
        query = query.in("students.grade", grades).in("students.section", sections);
      }
    } else if (target_type === "token") {
      // Expect array of access tokens
      query = query.in("students.access_token", target_tokens || []);
    } else {
      return {
        error: "Invalid target type"
      };
    }
    const { data, error } = await query;
    if (error) return {
      error: error.message
    };
    return {
      data
    };
  } catch (err) {
    return {
      error: err.message
    };
  }
}
