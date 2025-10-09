         // Register Service Worker
         if ('serviceWorker' in navigator) {
           window.addEventListener('load', () => {
             navigator.serviceWorker.register('/sw.js')
               .then((registration) => {
                 console.log('SW registered: ', registration);
               })
               .catch((registrationError) => {
                 console.log('SW registration failed: ', registrationError);
               });
           });
         }

         // PWA Install Prompt - Beautiful Popup Version
         let deferredPrompt;
         const installPopupOverlay = document.getElementById('install-popup-overlay');
         const installAppBtn = document.getElementById('install-app-btn');
         const installLaterBtn = document.getElementById('install-later-btn');

         // Show popup when install prompt is available
         window.addEventListener('beforeinstallprompt', (e) => {
           // Prevent the mini-infobar from appearing on mobile
           e.preventDefault();
           // Stash the event so it can be triggered later
           deferredPrompt = e;
           
           // Always show the popup (every time if app isn't installed)
           setTimeout(() => {
             showInstallPopup();
           }, 500); // Show after 500 ms
         });

         function showInstallPopup() {
           installPopupOverlay.style.display = 'block';
         }

         function hideInstallPopup() {
           installPopupOverlay.style.display = 'none';
         }

         // Install button click handler
         installAppBtn.addEventListener('click', async () => {
           if (deferredPrompt) {
             // Show the install prompt
             deferredPrompt.prompt();
             // Wait for the user to respond to the prompt
             const { outcome } = await deferredPrompt.userChoice;
             console.log(`User response to the install prompt: ${outcome}`);
             
             if (outcome === 'accepted') {
               console.log('User accepted the install prompt');
             } else {
               console.log('User dismissed the install prompt');
             }
             
             // Clear the deferredPrompt variable
             deferredPrompt = null;
           }
           // Hide the popup regardless of outcome
           hideInstallPopup();
         });

         // Maybe later button click handler
         installLaterBtn.addEventListener('click', () => {
           hideInstallPopup();
           // No longer saving dismissal state - popup will show again next time
         });

         // Hide popup when clicking outside
         installPopupOverlay.addEventListener('click', (e) => {
           if (e.target === installPopupOverlay) {
             hideInstallPopup();
           }
         });

         // Hide install popup if app is already installed
         window.addEventListener('appinstalled', () => {
           hideInstallPopup();
           deferredPrompt = null;
           console.log('PWA was installed');
         });

         // Check if app is running in standalone mode
         if (window.matchMedia('(display-mode: standalone)').matches) {
           console.log('App is running in standalone mode');
         }
