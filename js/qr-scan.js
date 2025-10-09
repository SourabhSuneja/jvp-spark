// QR Code Scanner Variables
let html5QrCode;
const qrScannerContainer = document.getElementById('qr-scanner-container');
const qrScannerActions = document.getElementById('qr-scanner-actions');

// Function to start the QR scanner
function startQRScanner() {
   qrScannerContainer.style.display = 'block';
   qrScannerActions.style.display = 'none';
   clearError();

   html5QrCode = new Html5Qrcode("qr-reader");
   const qrConfig = {
      fps: 20,
      qrbox: {
         width: 250,
         height: 250
      },
      aspectRatio: 1.0
   };

   html5QrCode.start({
         facingMode: "environment"
      },
      qrConfig,
      onQRScanSuccess,
      onQRScanFailure
   ).catch((err) => {
      console.error("Error starting QR scanner:", err);
      showError("Couldn't access camera. Please check permissions and try again.");
      closeQRScanner();
   });
}

// Handle QR file selection from gallery/device
function handleQRFileSelect(event) {
   const file = event.target.files[0];
   if (!file) return;

   qrScannerActions.style.display = 'none';
   showProcessingDialog();
   clearError();

   html5QrCode = new Html5Qrcode("qr-reader");

   html5QrCode.scanFile(file, true)
      .then(decodedText => {
         hideProcessingDialog();
         processQRCode(decodedText);
      })
      .catch(err => {
         hideProcessingDialog();
         console.error("Error scanning QR file:", err);
         showError("Could not read QR code from image. Please try another image or use camera scanning.");
         resetQRScanner();
      });

   // Reset file input
   event.target.value = '';
}

// Handle successful QR code scan
function onQRScanSuccess(decodedText, decodedResult) {
   // Stop scanning
   html5QrCode.stop().then(() => {
      console.log("QR Code scanning stopped");
      processQRCode(decodedText);
   }).catch((err) => {
      console.error("Error stopping QR scanner:", err);
      processQRCode(decodedText);
   });
}

// Handle QR scan failure (silent - normal when no QR in view)
function onQRScanFailure(error) {
   // Silent handling - this fires constantly when no QR code is detected
}

// Process the scanned QR code
async function processQRCode(decodedText) {
   console.log("QR Code detected:", decodedText);

   // Extract token if it's a URL with token parameter
   const qrContent = extractTokenOrReturn(decodedText);

   // Show loading
   showProcessingDialog();

   const studentDetails = await handleJVPStudentRegistration(qrContent);

   closeQRScanner();

   if (!studentDetails) {
      showError('Invalid QR code. Please try again.');
      return;
   }

   loginWithQR(qrContent, studentDetails);
}

// Extract token from URL or return original content
function extractTokenOrReturn(input) {
   try {
      const url = new URL(input);
      const token = url.searchParams.get("token");
      return token !== null ? token : input;
   } catch (error) {
      // Not a valid URL, return the input as is
      return input;
   }
}

// Close QR scanner and reset to initial state
function closeQRScanner() {
   if (html5QrCode) {
      // Check if scanner is currently running
      if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
         // Stop scanning first, then clear
         html5QrCode.stop().then(() => {
            html5QrCode.clear();
            html5QrCode = null;
            resetUI();
         }).catch(err => {
            console.error("Error stopping scanner:", err);
            // Force clear even if stop failed
            try {
               html5QrCode.clear();
            } catch (clearErr) {
               console.error("Error clearing scanner:", clearErr);
            }
            html5QrCode = null;
            resetUI();
         });
      } else {
         // Scanner is not running, safe to clear immediately
         try {
            html5QrCode.clear();
         } catch (err) {
            console.error("Error clearing scanner:", err);
         }
         html5QrCode = null;
         resetUI();
      }
   } else {
      resetUI();
   }
}

// Reset UI elements
function resetUI() {
   qrScannerContainer.style.display = 'none';
   qrScannerActions.style.display = 'flex';
   hideProcessingDialog();
}

// Reset QR scanner without closing (for retrying)
function resetQRScanner() {
   closeQRScanner();
}

// Show error message
function showError(message) {
   const errorElement = document.getElementById('error-message');
   if (errorElement) {
      errorElement.textContent = message;
   }
}

// Clear error message
function clearError() {
   const errorElement = document.getElementById('error-message');
   if (errorElement) {
      errorElement.textContent = '';
   }
}

// Login with QR functionality
async function loginWithQR(qrContent, student) {

   if (student && qrContent && qrContent.length > 0) {
      // Clear any errors
      showError('');

      // Show loading
      showProcessingDialog();

      // Generate email by using the student details
      const email = generateEmail(student['name'], qrContent);

      // Generate password by hashing the access token
      const password = await uuidToNumericHash(qrContent);

      // Set email and password in the form inputs
      document.getElementById('username').value = email;
      document.getElementById('password').value = password;

      // Programmatically click the sign in button
      document.getElementById('sign-in-btn').click();

      // Hide loading
      hideProcessingDialog();

   } else {
      showError('Invalid QR code. Please try again.');
   }
}

function generateEmail(name, uuid) {
   // Step 1: Clean up the name
   let cleanName = name
      .toLowerCase() // make lowercase
      .replace(/[^a-z0-9\s]/g, "") // remove dots & special chars
      .trim() // remove leading/trailing spaces
      .replace(/\s+/g, "-"); // replace spaces with hyphens

   // Step 2: Extract the first part of the UUID (before the first hyphen)
   let uuidPart = uuid.split("-")[0];

   // Step 3: Build email
   let email = `${cleanName}-${uuidPart}`;

   return email;
}


async function uuidToNumericHash(uuid) {
   // Encode UUID to bytes
   const encoder = new TextEncoder();
   const data = encoder.encode(uuid);

   // Hash using SHA-256
   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
   const hashArray = Array.from(new Uint8Array(hashBuffer));

   // Take first 8 bytes -> convert to big integer
   const hashInt = hashArray
      .slice(0, 8)
      .reduce((acc, byte) => (acc << 8n) + BigInt(byte), 0n);

   // Convert to 8-digit number
   const numericHash = Number(hashInt % 100000000n);

   // Ensure it's 8 digits with leading zeros
   return numericHash.toString().padStart(8, "0");
}

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
   if (html5QrCode) {
      if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
         html5QrCode.stop().catch(err => console.error("Error stopping scanner on unload:", err));
      }
   }
});

// Enhanced cleanup for when user navigates away
document.addEventListener('visibilitychange', function () {
   if (document.hidden && html5QrCode) {
      if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
         html5QrCode.stop().catch(err => console.error("Error stopping scanner on visibility change:", err));
      }
   }
});

// Handle student registration for JVP students (if not already registered, port info from My JVP, and sign them up)
async function handleJVPStudentRegistration(token) {
   // Attempt to fetch student details using the provided access token
   let student = await invokeFunction('get_student_by_access_token', {
      'access_token_param': token
   }, true);

   // If no details found, port from My JVP Portal
   if (!student) {
      const portedDetails = await invokeFunctionJVP('get_student_profile', {
         'p_access_token': token
      }, true);

      if (!portedDetails) {
         return null;
      }

      // Generate email by using the student details
      const email = generateEmail(portedDetails['name'], token) + '@app.com';

      // Generate password by hashing the access token
      const password = await uuidToNumericHash(token);

      // Sign up
      const data = await signUpUser(email, password);

      if (!data) {
         return null;
      }

      // Insert new student information in the database
      const inserted = await insertData('students', {
         ...portedDetails,
         city: 'Jaipur',
         school: 'Jamna Vidyapeeth',
         id: data.user.id,
         access_token: token
      });

      if (!inserted) {
         return null;
      }

      return portedDetails;

   } else {
      return student;
   }

}