// Offline Detection and Management
class OfflineManager {
   constructor() {
      this.overlay = document.getElementById('offlineOverlay');
      this.retryButton = document.querySelector('.retry-button');
      this.isRetrying = false;

      this.init();
   }

   init() {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Check initial connection status
      if (!navigator.onLine) {
         this.showOffline();
      }
   }

   handleOnline() {
      this.hideOffline();
      this.isRetrying = false;
      this.updateRetryButton(false);
      // Connection restored - reload the page
      this.forceReload();
   }

   handleOffline() {
      this.showOffline();
   }

   showOffline() {
      this.overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
   }

   hideOffline() {
      this.overlay.classList.remove('show');
      document.body.style.overflow = '';
   }

   forceReload() {
      if (APP_CONFIG.currentPage === 'home') {
         // Reload the main index.html (skip cache by adding unique query param)
         const baseUrl = window.location.origin + window.location.pathname;
         window.location.href = baseUrl + '?v=' + Date.now();
      } else {
         // Reload the current iframe page using existing PageManager logic
         PageManager.loadPage(APP_CONFIG.currentPage);
      }
   }

   async retryConnection() {
      if (this.isRetrying) return;

      this.isRetrying = true;
      this.updateRetryButton(true);

      try {
         // Attempt to fetch a small resource to check connectivity
         const response = await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000) // 5 second timeout
         });

         // If we reach here, connection is likely restored
         setTimeout(() => {
            if (navigator.onLine) {
               // Connection restored - reload the page
               this.forceReload();
            } else {
               this.isRetrying = false;
               this.updateRetryButton(false);
               this.showConnectionError();
            }
         }, 1000); // Small delay for UX

      } catch (error) {
         // Still offline or connection failed
         setTimeout(() => {
            this.isRetrying = false;
            this.updateRetryButton(false);
            this.showConnectionError();
         }, 1500);
      }
   }

   updateRetryButton(loading) {
      if (loading) {
         this.retryButton.classList.add('loading');
         this.retryButton.innerHTML = '<i class="fas fa-spinner"></i> Checking...';
      } else {
         this.retryButton.classList.remove('loading');
         this.retryButton.innerHTML = '<i class="fas fa-sync-alt"></i> Check Again';
      }
   }

   showConnectionError() {
      // Optional: Show a brief error message
      const originalText = this.retryButton.innerHTML;
      this.retryButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Still Offline';
      this.retryButton.style.background = 'linear-gradient(135deg, var(--error-bg), var(--error-hover))';

      setTimeout(() => {
         this.retryButton.innerHTML = originalText;
         this.retryButton.style.background = '';
      }, 2000);
   }
}


// Initialize offline manager
const offlineManager = new OfflineManager();