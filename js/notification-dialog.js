// Notification Permission Manager
const notificationPermission = {
   // Show the notification permission overlay
   show: function() {
      const overlay = document.getElementById('notificationOverlay');
      if (overlay) {
         overlay.classList.add('show');
         // Prevent body scroll when overlay is shown
         document.body.style.overflow = 'hidden';
      }
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
      // Hide the overlay
      this.hide();
   }
};
