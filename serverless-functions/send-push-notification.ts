// Deno Deploy Push Notification Server (Optimized for Parallel Sending)

import webpush from "npm:web-push@3.5.0";

// VAPID keys setup
const vapidKeys = {
  publicKey: Deno.env.get("VAPID_PUBLIC_KEY") ?? "",
  privateKey: Deno.env.get("VAPID_PRIVATE_KEY") ?? "",
};

// --- VAPID Details ---
// Set VAPID details only if keys are present
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    "mailto:sourabhsuneja021@gmail.com", // Your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
} else {
  console.warn(
    "VAPID keys are not set. Web push notifications will likely fail."
  );
}

// --- CORS Headers ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins for simplicity, or restrict to your PWA URL
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // Added Authorization as it's common
};

// --- Deno Server ---
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // --- 1. Parse Request Body ---
    // The 'subscriptions' variable is now an array:
    // [{ subscription_object: {...}, student_id: "..." }, ...]
    const { subscriptions, message } = await req.json();

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return new Response("Invalid or empty 'subscriptions' array", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!message) {
      return new Response("Missing 'message' payload", {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    console.log(`Processing batch of ${subscriptions.length} subscriptions...`);

    // --- 2. Create All Notification Promises ---
    // We map over the array of items. Each 'item' is { subscription_object, student_id }
    const notificationPromises = subscriptions.map((item) => {
      
      // **CHANGE**: Validate the *new* item structure
      if (!item || !item.subscription_object || !item.subscription_object.endpoint) {
        console.warn("Skipping invalid subscription item:", item);
        // Return a promise that resolves to a 'skipped' status
        return Promise.resolve({
          status: "skipped",
          endpoint: item?.subscription_object?.endpoint || "unknown",
          student_id: item?.student_id || "unknown",
          error: "Invalid subscription object or endpoint",
        });
      }

      // **NEW**: Create a customized message payload for *this* student
      // 1. Clone the base message
      const customizedMessage = { ...message };

      // 2. Ensure 'data' object exists (it might not)
      if (!customizedMessage.data) {
        customizedMessage.data = {};
      }
      
      // 3. Add the specific student_id to the message data
      customizedMessage.data.student_id = item.student_id;

      // 4. Stringify the *customized* message payload
      const payload = JSON.stringify(customizedMessage);

      // **CHANGE**: Send notification to 'item.subscription_object'
      return webpush.sendNotification(
        item.subscription_object,
        payload
      )
      .then(sendResult => {
        // Success!
        return {
          status: "success",
          endpoint: item.subscription_object.endpoint,
          student_id: item.student_id,
          statusCode: sendResult.statusCode,
        };
      })
      .catch(err => {
        // Handle errors (e.g., 410 Gone, 404 Not Found)
        console.error(
          `Failed to send to student ${item.student_id} (${item.subscription_object.endpoint}):`,
          err.message
        );
        return {
          status: "failed",
          endpoint: item.subscription_object.endpoint,
          student_id: item.student_id,
          error: err.message,
          statusCode: err.statusCode, // This is useful for debugging (e.g., 410)
        };
      });
    });

    // --- 3. Wait for all promises to resolve or reject ---
    // We use Promise.all because we've added .catch() to every promise,
    // so the main Promise.all will not reject.
    const sendResults = await Promise.all(notificationPromises);

    console.log(`Batch processed. Success: ${sendResults.filter(r => r.status === 'success').length}, Failed/Skipped: ${sendResults.filter(r => r.status !== 'success').length}`);

    // --- 4. Return the detailed results ---
    return new Response(JSON.stringify({ results: sendResults }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    // Handle critical errors (e.g., JSON parsing failure)
    console.error("Critical error in Deno function:", err);
    return new Response("Server Error: " + err.message, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
