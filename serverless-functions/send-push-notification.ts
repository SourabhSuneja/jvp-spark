// Deno Deploy Push Notification Server (Multiple Subscriptions)

import webpush from "npm:web-push@3.5.0";

// Access VAPID keys from environment variables
const vapidKeys = {
  publicKey: Deno.env.get("VAPID_PUBLIC_KEY") ?? "",
  privateKey: Deno.env.get("VAPID_PRIVATE_KEY") ?? ""
};

// Set your VAPID details
webpush.setVapidDetails(
  "mailto: sourabhsuneja021@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Common headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://jvp-spark.netlify.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// Deno server to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow only POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    // Parse the JSON body
    const { subscriptions, message } = await req.json();

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return new Response("Invalid subscriptions array", {
        status: 400,
        headers: corsHeaders
      });
    }

    const sendResults = [];

    // Loop through each subscription and send notification
    for (const subscription of subscriptions) {
      if (!subscription || !subscription.endpoint) {
        sendResults.push({ endpoint: subscription?.endpoint || "unknown", status: "skipped" });
        continue;
      }

      try {
        await webpush.sendNotification(subscription, JSON.stringify(message || ""));
        console.log("Notification sent to:", subscription.endpoint);
        sendResults.push({ endpoint: subscription.endpoint, status: "success" });
      } catch (err) {
        console.error("Error sending to", subscription.endpoint, err);
        sendResults.push({ endpoint: subscription.endpoint, status: "failed", error: err.message });
      }
    }

    return new Response(JSON.stringify({ results: sendResults }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error sending notifications:", err);
    return new Response("Failed: " + err.message, {
      status: 500,
      headers: corsHeaders
    });
  }
});
