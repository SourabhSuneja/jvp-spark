// Deno Deploy Push Notification Server (Optimized for Parallel Sending)

import webpush from "npm:web-push@3.5.0";

// VAPID keys setup
const vapidKeys = {
  publicKey: Deno.env.get("VAPID_PUBLIC_KEY") ?? "",
  privateKey: Deno.env.get("VAPID_PRIVATE_KEY") ?? ""
};
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sourabhsuneja.github.io", // Your Supabase project URL or '*' for testing
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { subscriptions, message } = await req.json();

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return new Response("Invalid subscriptions array", { status: 400, headers: corsHeaders });
    }

    // ✅ PARALLEL PROCESSING of the batch
    const notificationPromises = subscriptions.map(subscription => {
        if (!subscription || !subscription.endpoint) {
            // Immediately resolve invalid subscriptions as skipped
            return Promise.resolve({ 
                status: 'fulfilled', 
                value: { endpoint: "unknown", status: "skipped" } 
            });
        }
        return webpush.sendNotification(subscription, JSON.stringify(message || ""));
    });
    
    // Wait for all notifications in the batch to be sent
    const settledResults = await Promise.allSettled(notificationPromises);

    // Format the results
    const sendResults = settledResults.map((result, index) => {
      const endpoint = subscriptions[index]?.endpoint || "unknown";
      if (result.status === 'fulfilled') {
        return { endpoint, status: "success" };
      } else {
        // Log the actual error for debugging
        console.error(`Failed to send to ${endpoint}:`, result.reason.message);
        return { endpoint, status: "failed", error: result.reason.message };
      }
    });

    return new Response(JSON.stringify({ results: sendResults }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Critical error in Deno function:", err);
    return new Response("Failed: " + err.message, { status: 500, headers: corsHeaders });
  }
});
