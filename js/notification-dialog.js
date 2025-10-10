// Notification Permission Manager
const notificationPermission = {
   _resolvePromise: null,

   // Show the notification permission overlay - returns a promise
   show: function() {
      return new Promise((resolve) => {
         // Store the resolve function
         this._resolvePromise = resolve;
         
         const overlay = document.getElementById('notificationOverlay');
         if (overlay) {
            overlay.classList.add('show');
            // Prevent body scroll when overlay is shown
            document.body.style.overflow = 'hidden';
         }
      });
   },

   // Hide the notification permission overlay
   hide: function() {
      const overlay = document.getElementById('notificationOverlay');
      if (overlay) {
         overlay.classList.remove('show');
         // Restore body scroll
         document.body.style.overflow = '';
      }
   },

   // Request permission button handler
   requestPermission: function() {
      // Hide the overlay first
      this.hide();
      
      // Resolve the promise to allow the calling code to proceed
      if (this._resolvePromise) {
         this._resolvePromise();
         this._resolvePromise = null;
      }
   }
};