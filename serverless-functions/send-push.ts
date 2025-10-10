// Supabase Edge Function: send-push
// Purpose: Filter students based on target type and send push notifications via Deno Deploy endpoint
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// Define CORS headers to be used in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sourabhsuneja.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Allow only POST requests
    if (req.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405
      });
    }
    // Parse incoming request body
    const { passcode, message, detailed_message, target_type, target_tokens, sent_by } = await req.json();
    // ðŸ”’ Step 1: Validate passcode
    const SUPABASE_PASSCODE = Deno.env.get("PUSH_SECRET_PASSCODE");
    if (!SUPABASE_PASSCODE || passcode !== SUPABASE_PASSCODE) {
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), {
        status: 401
      });
    }
    // Step 2: Initialize Supabase client using service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    // Step 3: Validate the message object
    if (!message || !message.title || !message.body) {
      return new Response(JSON.stringify({
        error: "Invalid message object"
      }), {
        status: 400
      });
    }
    // Step 4: Retrieve subscription objects based on target type
    let { data: subscriptions, error } = await getSubscriptions(supabase, target_type, target_tokens);
    if (error) {
      return new Response(JSON.stringify({
        error
      }), {
        status: 400
      });
    }
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({
        message: "No subscriptions found"
      }), {
        status: 404
      });
    }
    // Step 5: Prepare the body for Deno Deploy push function
    const body = JSON.stringify({
      subscriptions: subscriptions.map((s)=>s.subscription_object),
      message
    });
    // Step 6: Send POST request to your Deno Deploy push notification server
    const denoUrl = "https://send-push-notification.deno.dev/";
    const response = await fetch(denoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });
    const result = await response.json();
    // Step 7: Return success and targeted counts
    const successCount = Array.isArray(result.results) ? result.results.filter((r)=>r.status === "success").length : 0;
    // Step 8: Log notification details into the database
    const notificationID = message?.data?.notificationID || crypto.randomUUID(); // fallback if not provided
    const { error: logError } = await supabase.from("notification_logs").insert([
      {
        id: notificationID,
        message_title: message.title,
        message_body: message.body,
        detailed_message,
        target_type,
        target_tokens,
        targeted_recipients: subscriptions.length,
        success_count: successCount,
        sent_by
      }
    ]);
    if (logError) {
      console.error("Failed to log notification:", logError.message);
    }
    // Step 9: Return response
    return new Response(JSON.stringify({
      targeted_recipients: subscriptions.length,
      success_count: successCount,
      results: result.results || result
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500
    });
  }
});
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
