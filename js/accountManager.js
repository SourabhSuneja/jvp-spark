// --- Constants and State ---
            const ACCOUNTS_KEY = 'studentAccounts';
            const ACTIVE_ACCOUNT_KEY = 'activeStudentToken';
            const THEME_KEY = 'appTheme';
            let tokenToRemove = null; // Store token for confirmation modal

// --- LocalStorage Helper Functions ---

            /**
             * Retrieves all student accounts from localStorage.
             * @returns {Array} An array of account objects.
             */
            function getAccounts() {
                try {
                    const accounts = localStorage.getItem(ACCOUNTS_KEY);
                    return accounts ? JSON.parse(accounts) : [];
                } catch (e) {
                    console.error("Error parsing accounts from localStorage:", e);
                    return [];
                }
            }

            /**
             * Saves an array of accounts to localStorage.
             * @param {Array} accounts - The array of account objects to save.
             */
            function saveAccounts(accounts) {
                localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
            }

            /**
             * Gets the currently active student token.
             * @returns {string|null} The active access token or null.
             */
            function getActiveToken() {
                return localStorage.getItem(ACTIVE_ACCOUNT_KEY);
            }

            /**
             * Sets the active student token.
             * @param {string} token - The access token to set as active.
             */
            function setActiveToken(token) {
                localStorage.setItem(ACTIVE_ACCOUNT_KEY, token);
            }

            // --- Core Account Management Functions ---

            /**
             * Adds a new student account to localStorage.
             * @param {string} token - The student's unique access token.
             * @param {string} name - The student's name.
             * @param {string} sClass - The student's class.
             * @param {string} avatar - The URL for the student's avatar.
             * @returns {boolean} True if successful, false if token already exists.
             */
            function addAccount(studentID, token, name, sClass, avatar) {
                const accounts = getAccounts();
                const existing = accounts.find(acc => acc.token === token);
                
                if (existing) {
                    console.log('An account with this token already exists.');
                    return false;
                }

                const newAccount = { studentID, token, name, sClass, avatar };
                accounts.push(newAccount);
                saveAccounts(accounts);
                
                // If it's the first account, make it active
                if (accounts.length === 1) {
                    switchAccount(token);
                }
                
                //renderAccounts();
                console.log('Account added successfully!');
                return true;
            }

            /**
             * Updates an existing student account.
             * @param {string} token - The token of the account to update.
             * @param {string} name - The new name.
             * @param {string} sClass - The new class.
             * @param {string} avatar - The new avatar URL.
             */
            function updateAccount(studentID, token, name, sClass, avatar) {
                const accounts = getAccounts();
                const accountIndex = accounts.findIndex(acc => acc.token === token);
                
                if (accountIndex === -1) {
                    console.error('Account not found for updating.');
                    return;
                }
                
                accounts[accountIndex] = { studentID, token, name, sClass, avatar };
                saveAccounts(accounts);
                //renderAccounts();
                console.log('Account updated successfully!');
            }

            /**
             * Removes an account from localStorage by its token.
             * @param {string} token - The token of the account to remove.
             */
            function removeAccount(token) {
                let accounts = getAccounts();
                accounts = accounts.filter(acc => acc.token !== token);
                saveAccounts(accounts);
                
                if (getActiveToken() === token) {
                    // If the active account was removed, set the first available account as active
                    // or clear it if no accounts are left.
                    const newActiveToken = accounts.length > 0 ? accounts[0].token : null;
                    if (newActiveToken) {
                        setActiveToken(newActiveToken);
                    } else {
                        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
                    }
                }
                
                //renderAccounts();
                console.log('Account removed.');
            }

            /**
             * Sets an account as active and notifies the parent app.
             * @param {string} token - The token of the account to switch to.
             */
            function switchAccount(token) {
                setActiveToken(token);
                console.log('Switching account...');
                
                // Notify the parent PWA (which is in a parent frame)
                // The parent app should listen for this message and handle the re-login.
                if (window.parent) {
                    window.parent.postMessage({ type: 'SWITCH_ACCOUNT', token: token }, '*');
                }

                // Re-render to show the new active account
                //renderAccounts();
                
                // Optionally, you could simulate a reload if the parent doesn't handle it
                // location.reload(); 
            }

function showSignInForNewAccount() {
 const elements = {
         signInScreen: DOMUtils.getElementById('sign-in-screen'),
         errorField: DOMUtils.getElementById('error-message'),
         btn: DOMUtils.getElementById('sign-in-btn'),
         username: DOMUtils.getElementById('username'),
         password: DOMUtils.getElementById('password')
      };
 // Show sign in screen
 DOMUtils.setDisplay(elements.signInScreen, 'flex');
 // Clear loading state
 AuthManager.setLoadingState(elements.btn, elements.errorField, false);
 // Clear previous username/password values
 elements.username.value = '';
 elements.password.value = '';
}
