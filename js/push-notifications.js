// Push Notification Functionality

// VAPID Public Key
const VAPID_PUBLIC_KEY = 'BCHU24zEIGx_r51XxETbqK-sXT99y_DZby17DWvmeEVb0ED_sCsckFqcigF5Fhjj-gTx-C14dcYwD6goKwqLBr4';

// This utility function is required by the Push API
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Call this function immediately AFTER a student successfully logs in or after auth status is confirmed.
 * It handles everything: requests permission if needed, gets the device's
 * subscription, and ensures it's associated with the current student in the database.
 * * @param {string} studentId The unique UUID of the logged-in student.
 */
async function subscribeToPush(studentId) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        // 1. If no subscription exists, create one.
        if (subscription === null) {
            console.log('User is not subscribed. Requesting permission...');
            // Show the custom overlay and wait for user to click "Request Permission"
            await notificationPermission.show();
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                console.log('Permission not granted for Notification.');
                return;
            }


            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
            console.log('New subscription created.');
        } else {
            console.log('User is already subscribed on this device.');
        }

        // 2. UPSERT: Ensure the subscription is associated with the current student.
        // This handles new subscriptions, and also re-associates an existing
        // subscription if a different student logs into the same device.
        console.log('Associating subscription with student:', window.userId);
        const subscriptionData = {
            student_id: window.userId,
            subscription_object: subscription,
            endpoint: subscription.endpoint // The unique identifier for the device/browser
        };

        const result = await insertData('push_subscriptions', subscriptionData);

        if (result) {
            console.log('Subscription successfully associated with current student.');
        } else {
            console.error('Failed to associate subscription.');
        }

    } catch (error) {
        console.error('Error during subscription handling:', error);
    }
}


/**
 * Call this function immediately BEFORE logging a student out.
 * It removes the subscription record from the database, ensuring the logged-out
 * student no longer receives notifications on this device.
 */
async function unsubscribeFromPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // Find and delete the subscription record for this device using its endpoint
            const deleted = await deleteRow('push_subscriptions', ['endpoint'], [subscription.endpoint]);

            if (deleted) {
                console.log('Device subscription disassociated on logout.');
            } else {
                console.error('Error deleting subscription on logout:', error);
            }
        }
    } catch (error) {
        console.error('Error during logout subscription handling:', error);
    }
}



// Add this to your script.js file

// Listen for messages from the service worker
navigator.serviceWorker.addEventListener('message', event => {
  // **CHANGE**: Check for and use event.data.studentId
  if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
    const notificationId = event.data.id;
    const studentId = event.data.studentId;

    console.log(`Notification clicked! ID: ${notificationId}, Student: ${studentId}`);

    // **CHANGE**: Pass both IDs to your page loader and handler function
    
    // Load notification page into an iframe
    PageManager.loadManualPage({
      link: `./pages/notifications/show.html?notification_id=${notificationId}&student_id=${studentId}`,
      title: 'Notification',
      page_key: 'show-notification'
    });

    // Now you can call your custom function
    if (typeof showNotification === 'function') {
      showNotification(notificationId, studentId);
    }
  }
});

// Also, check for the query parameter when the app loads
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // **CHANGE**: Get both query parameters
  const notificationId = urlParams.get('notification_id');
  const studentId = urlParams.get('student_id');

  // **CHANGE**: Pass both IDs to your handler function
  if (notificationId) {
    console.log(`App opened from notification! ID: ${notificationId}, Student: ${studentId}`);
    if (typeof showNotification === 'function') {
      showNotification(notificationId, studentId);
    }
  }
});

// **CHANGE**: Update function signature to accept both IDs
function showNotification(notificationId, studentId) {
  // Just store the IDs in global variables, the app's main script will see how to handle this
  notifId = notificationId;
  globalStudentId = studentId;

  console.log(`showNotification called. Stored notifId: ${notifId}, globalStudentId: ${globalStudentId}`);
  // Now your app can use both `notifId` and `globalStudentId`
}
