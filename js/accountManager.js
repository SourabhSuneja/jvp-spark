/* =============================================
 * ACCOUNT MANAGER (accountManager.js)
 * Requires supabase.js to be loaded first
 * ============================================= */

const ACCOUNT_STORAGE_KEY = 'student_accounts';
const ACTIVE_ACCOUNT_KEY = 'active_student_id';

/**
 * Retrieves all stored student accounts from localStorage.
 * @returns {Array} An array of account objects.
 */
function getStoredAccounts() {
    const accounts = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    return accounts ? JSON.parse(accounts) : [];
}

/**
 * Saves the list of student accounts to localStorage.
 * @param {Array} accounts - The array of account objects to save.
 */
function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

/**
 * Gets the ID of the currently active student from localStorage.
 * @returns {string | null} The active student's ID or null.
 */
function getActiveAccountId() {
    return localStorage.getItem(ACTIVE_ACCOUNT_KEY);
}

/**
 * Sets the specified student ID as the active one in localStorage.
 * @param {string | null} studentId - The ID of the student to set as active, or null to clear.
 */
function setActiveAccountId(studentId) {
    if (studentId) {
        localStorage.setItem(ACTIVE_ACCOUNT_KEY, studentId);
    } else {
        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
}

/**
 * Retrieves the full account details for the currently active user.
 * @returns {Object | null} The active account object or null.
 */
function getActiveAccountDetails() {
    const activeId = getActiveAccountId();
    if (!activeId) return null;
    return getStoredAccounts().find(acc => acc.student_id === activeId);
}

/**
 * Adds a new account or updates an existing one in localStorage.
 * @param {Object} accountData - The account object to save.
 * (Must include student_id, name, access_token, refresh_token, etc.)
 */
function addOrUpdateAccount(accountData) {
    let accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex(acc => acc.student_id === accountData.student_id);
    
    if (existingIndex > -1) {
        // Update existing account with new tokens/details
        accounts[existingIndex] = { ...accounts[existingIndex], ...accountData };
    } else {
        // Add new account
        accounts.push(accountData);
    }
    saveAccounts(accounts);
    console.log('Account saved:', accountData.name);
}

/**
 * Switches the active Supabase session and app state to the specified student.
 * @param {string} studentId - The ID of the student to switch to.
 * @returns {Object | null} The account object of the new active user, or null on failure.
 */
async function switchActiveAccount(studentId) {
    const targetAccount = getStoredAccounts().find(acc => acc.student_id === studentId);
    
    if (!targetAccount) {
        console.error("Account not found. Cannot switch.");
        return null;
    }
    
    console.log(`Switching active user to: ${targetAccount.name}`);
    
    // 1. Set the Supabase session
    const { error } = await window.supabase.auth.setSession({
        access_token: targetAccount.access_token,
        refresh_token: targetAccount.refresh_token
    });
    
    if (error) {
        console.error("Failed to set session:", error);
        // This likely means the refresh token is invalid.
        // You should remove this account and ask the user to log in again.
        alert(`Session for ${targetAccount.name} has expired. Please log in again.`);
        await removeAccount(studentId); // Automatically remove the bad account
        return null;
    }
    
    // 2. Update local active state
    setActiveAccountId(studentId);
    
    // 3. Update global state (from your supabase.js)
    window.userId = targetAccount.student_id;
    window.userDetails = targetAccount; // Use the stored details for a fast UI update
    
    // 4. Re-subscribe to push notifications for this user
    if (typeof subscribeToPush === 'function') {
        await subscribeToPush(studentId);
    } else {
        console.warn('subscribeToPush() function not found. Skipping push subscription.');
    }
    
    // 5. Return the user details for the UI to update
    return targetAccount;
}

/**
 * Removes an account from localStorage and handles session state.
 * @param {string} studentId - The ID of the student to remove.
 * @returns {Object | null} The new active user, or null if no users are left.
 */
async function removeAccount(studentId) {
    let accounts = getStoredAccounts();
    const remainingAccounts = accounts.filter(acc => acc.student_id !== studentId);
    saveAccounts(remainingAccounts);
    
    // Disassociate this user from this device's push subscription
    if (typeof removeAccountPush === 'function') {
        await removeAccountPush(studentId);
    } else {
        console.warn('removeAccountPush() function not found. Skipping push disassociation.');
    }
    
    const activeId = getActiveAccountId();
    
    // Check if we removed the *active* user
    if (activeId === studentId) {
        setActiveAccountId(null);
        window.userId = null;
        window.userDetails = null;
        
        // If there are other accounts, switch to the first one
        if (remainingAccounts.length > 0) {
            console.log('Active user removed, switching to next account.');
            return await switchActiveAccount(remainingAccounts[0].student_id);
        } else {
            // No accounts left, sign out completely
            console.log('Last account removed, signing out.');
            await window.signOutUser();
            return null;
        }
    }
    
    // We removed an inactive account, so return the currently active one
    return getActiveAccountDetails();
}

/**
 * Logs out of all accounts and clears all stored data.
 */
async function logoutAllAccounts() {
    console.log('Logging out of all accounts.');
    
    // 1. Sign out from Supabase (clears the active session)
    await window.signOutUser();
    
    // 2. Clear all account data from localStorage
    saveAccounts([]); // Empty array
    setActiveAccountId(null);
    
    // 3. Clear global state
    window.userId = null;
    window.userDetails = null;
    
    // 4. (Optional) You might want to unsubscribe from push completely,
    // but it's not strictly necessary as the subscriptions are tied to student_ids.
}

// Expose functions to the global scope
window.accountManager = {
    getStoredAccounts,
    getActiveAccountId,
    getActiveAccountDetails,
    switchActiveAccount,
    removeAccount,
    logoutAllAccounts,
    addOrUpdateAccount // This is used by the login flow
};
