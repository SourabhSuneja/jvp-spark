// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const APP_CONFIG = {
   name: 'JVP Spark',
   loadingDelay: 1000,
   iframeTransitionDuration: '1s',
   currentPage: 'home',
   theme: 'dark'
};


const USER_DATA = {
   name: '',
   grade: '',
   section: '',
   accountType: 'Student',
   avatar: '',
   selectedQbIds: null,
   selectedAssignmentId: null
};

const BASE_URL = 'https://sourabhsuneja.github.io/jvp-spark/';

// Resources (including page links) mentioned here will be preloaded in the background for faster rendering later
const PRELOADABLE_RESOURCES = [
   'pages/notifications/index.html',
   'pages/result/index.html',
   'pages/account/index.html',
   'pages/avatar-generator/index.html',
   'pages/syllabus/index.html',
   'pages/blueprint/index.html',
   'pages/sarthak/index.html'
];

// Array for holding subject order for sorting subjects on dashboard later on
const ALL_SUBJECTS = [
   "General",
   "English",
   "Hindi",
   "Science",
   "Maths",
   "EVS",
   "Social Science",
   "Sanskrit",
   "Computer",
   "Data Science",
   "GK",
   "Physics",
   "Chemistry",
   "Biology",
   "P.E.",
   "I.P.",
   "Psychology",
   "Applied Maths",
   "Fine Arts",
   "Geography",
   "Accountancy",
   "B.St.",
   "Economics",
   "History",
   "Pol. Sci."
];

// Variables to store notification ID and target student ID in case the app was opened by notification click
let notifId = null;
let globalStudentId = null;

// Variable to hold all dashboard data fetched from the backend.
let DASHBOARD_DATA = {};

// Variable to hold all subscription data fetched from the backend.
let SUBSCRIPTION_DATA = [];

// Array to hold all unique page keys for each subscribed subject
let PAGELIST = {};

// Variable to track the currently selected subject.
let currentSubject = 'General';

// Variable to hold all menu items fetched from the backend for the side navigation drawer
let MENU_ITEMS = [];

// Variable to hold available question bank details keyed by subjects
let QB_DETAILS = {};

// Variable to hold available work assignment details keyed by subjects
let WA_DETAILS = {};

// Also store the same reference in USER_DATA
USER_DATA['qbDetails'] = QB_DETAILS;
USER_DATA['waDetails'] = WA_DETAILS;

// =============================================================================
// BACKEND MANAGEMENT
// =============================================================================

const BackendManager = {
   getStudentProfile: async (student_id) => {
      try {
         const student = await invokeFunction('get_student_profile', {
            p_student_id: student_id
         }, true);
         return student;
      } catch (err) {
         console.error("Error fetching student profile:", err);
         return null;
      }
   },

   // Function to get all dashboard data for the logged-in user
   getDashboardData: async () => {
      try {
         const data = await invokeFunction('get_student_dashboard_data', {}, false);
         return data || {}; // Return data or an empty object
      } catch (err) {
         console.error("Error fetching dashboard data:", err);
         return {}; // Return empty object on error
      }
   },

   // Function to get all subscriptions for the logged-in user
   getSubscriptionData: async () => {
      try {
         const data = await selectData('subscriptions', false, "subject, subscription_plan, subscription_ends_at", ['student_id'], [window.userId], 'id');
         return data || []; // Return data or an empty array
      } catch (err) {
         console.error("Error fetching dashboard data:", err);
         return []; // Return empty array on error
      }
   },

   // Function to fetch notifications (defaults to latest 5 if nothing specified)
   getNotifications: async (lastNotifID = null, pageSize = 5) => {
      try {
         const params = {
            'last_notification_id': lastNotifID,
            'page_size': pageSize,
            'p_student_ids': getAccountIds()
         };
         const data = await invokeFunction('get_all_notifications', params, true);
         return data || {}; // Return data or an empty object
      } catch (err) {
         console.error("Error fetching notifications:", err);
         return {}; // Return empty object on error
      }
   },

   // Function to poll new notifications when the app is open
   getNewNotifications: async (latestNotifID) => {
      if (!latestNotifID) return {
         count_unread: 0,
         notifications: []
      }; // Don't poll if we have no reference
      try {
         const params = {
            'latest_known_id': latestNotifID,
            'p_student_ids': getAccountIds()
         };
         // Note: Using 'get_new_notifications' (the new SQL function name)
         const data = await invokeFunction('get_new_notifications', params, true);
         return data || {
            count_unread: 0,
            notifications: []
         };
      } catch (err) {
         console.error("Error fetching new notifications:", err);
         return {
            count_unread: 0,
            notifications: []
         };
      }
   },

   // Function to get details for the available question banks for a given grade & subject
   getQbDetails: async (grade, subject) => {
      try {
         const data = await invokeFunction('get_question_banks_with_details', {
            'p_grade': parseInt(grade),
            'p_subject': subject
         }, false);
         return data || []; // Return data or an empty array
      } catch (err) {
         console.error("Error fetching dashboard data:", err);
         return []; // Return empty array on error
      }
   },

   // Function to get details for the available work assignments for a given subject
   getWaDetails: async (subject) => {
      try {
         const data = await invokeFunction('get_student_assignments', {
            'p_subject': subject
         }, false);
         return data || []; // Return data or an empty array
      } catch (err) {
         console.error("Error fetching dashboard data:", err);
         return []; // Return empty array on error
      }
   },

   // Function to get all menu item resources for the side navigation drawer
   getMenuItems: async () => {
      try {
         const data = await selectData('menu_resources', false, "*", [], [], 'display_order');
         return data || []; // Return data or an empty array
      } catch (err) {
         console.error("Error fetching menu resources:", err);
         return []; // Return empty array on error
      }
   }

};

// =============================================================================
// DOM UTILITIES
// =============================================================================

const DOMUtils = {
   getElementById: (id) => document.getElementById(id),

   createElement: (tag, className = '', textContent = '') => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (textContent) element.textContent = textContent;
      return element;
   },

   createIcon: (iconName) => {
      const icon = document.createElement('ion-icon');
      icon.setAttribute('name', iconName);
      return icon;
   },

   toggleClass: (element, className) => {
      element.classList.toggle(className);
   },

   show: (element) => {
      if (element) element.style.display = 'revert';
   },

   hide: (element) => {
      if (element) element.style.display = 'none';
   },

   setDisplay: (element, display) => {
      if (element) element.style.display = display;
   }
};

// =============================================================================
// Notification Badge Manager
// =============================================================================

const NotificationBadge = {
   bellIcon: null,
   badgeElement: null,
   rippleElement: null,

   init() {
      this.bellIcon = document.querySelector('.notification-btn');

      if (!this.bellIcon) {
         console.error('Notification bell icon not found');
         return;
      }

      // Create badge element using DOMUtils
      this.badgeElement = DOMUtils.createElement('span', 'notification-badge');
      DOMUtils.hide(this.badgeElement);

      // Create ripple element using DOMUtils
      this.rippleElement = DOMUtils.createElement('span', 'notification-ripple');

      // Wrap bell icon content and add elements
      this.bellIcon.style.position = 'relative';
      this.bellIcon.appendChild(this.badgeElement);
      this.bellIcon.appendChild(this.rippleElement);
   },

   updateNotificationCount(count, showRipples = true) {
      if (!this.badgeElement || !this.rippleElement) {
         this.init();
      }

      if (count > 0) {
         // Show badge with count
         this.badgeElement.textContent = count > 99 ? '99+' : count;
         DOMUtils.setDisplay(this.badgeElement, 'flex');

         // Activate ripple animation if showRipples is set to true
         if (showRipples) {
            this.rippleElement.classList.add('active');

            // Stop ripple after 10 seconds
            setTimeout(() => {
               this.rippleElement.classList.remove('active');
            }, 10000);
         }
      } else {
         // Hide badge and stop ripple
         DOMUtils.hide(this.badgeElement);
         this.rippleElement.classList.remove('active');
      }
   },

   clearNotifications() {
      this.updateNotificationCount(0);
   },

   // Manually restart ripple animation
   restartRipple() {
      if (this.rippleElement) {
         this.rippleElement.classList.remove('active');
         // Force reflow
         void this.rippleElement.offsetWidth;
         this.rippleElement.classList.add('active');
      }
   }
};

// =============================================================================
// UI COMPONENTS
// =============================================================================

const UIComponents = {
   createCard: (cardData) => {
      const cardDiv = DOMUtils.createElement('div', 'card');
      const icon = DOMUtils.createIcon(cardData.icon);
      const title = DOMUtils.createElement('div', 'title', cardData.title);

      cardDiv.appendChild(icon);
      cardDiv.appendChild(title);
      cardDiv.addEventListener('click', () => PageManager.loadPage(cardData.page));

      return cardDiv;
   },

   createMenuItem: (itemData) => {
      const menuItemDiv = DOMUtils.createElement('div', 'menu-item');
      const icon = DOMUtils.createIcon(itemData.icon);
      const titleText = document.createTextNode(itemData.title);

      menuItemDiv.appendChild(icon);
      menuItemDiv.appendChild(titleText);
      menuItemDiv.addEventListener('click', function () {
         PageManager.loadManualPage(itemData);
         MenuManager.close();
      });

      return menuItemDiv;
   },

   createUserProfile: async () => {
      // Fetch student profile from backend
      const profile = await BackendManager.getStudentProfile(window.userId);

      if (profile && typeof profile === 'object') {
         // Copy all keys from backend response into USER_DATA
         Object.keys(profile).forEach(key => {
            USER_DATA[key] = profile[key];
         });

         // Also add/update account to local storage
         const {
            access_token,
            name,
            grade,
            section,
            avatar
         } = USER_DATA;
         const className = `${grade}-${section}`;
         const avatarUrl = `https://avataaars.io/?${avatar}`;

         if (!addAccount(window.userId, access_token, name, className, avatarUrl)) {
            updateAccount(window.userId, access_token, name, className, avatarUrl);
         }
         // Also set this account as "active"
         setActiveToken(access_token);
      }

      // Toggle to light theme if theme in user settings is 1 (= light theme)
      if (USER_DATA['theme'] === 1) {
         APP_CONFIG.theme = 'light';
         document.body.classList.add('light-theme');
      }

      // Update name in header (visible only on desktop screens)
      DOMUtils.getElementById('name-in-header').innerText = StringUtils.capitalizeFirstLetter(USER_DATA.name)

      // Update header avatar
      DOMUtils.getElementById('header-avatar').src = `https://avataaars.io/?${USER_DATA.avatar}`;

      const profileContainer = DOMUtils.getElementById('student-profile');
      profileContainer.innerHTML = '';

      // Create profile avatar section
      const profileAvatarDiv = DOMUtils.createElement('div', 'profile-avatar');
      const avatarImg = DOMUtils.createElement('img');
      avatarImg.src = `https://avataaars.io/?${USER_DATA.avatar}`;
      avatarImg.alt = 'Avatar';
      profileAvatarDiv.appendChild(avatarImg);

      // Create profile info section
      const profileInfoDiv = DOMUtils.createElement('div', 'profile-info');
      const nameHeading = DOMUtils.createElement('h2', 'student-name', StringUtils.capitalizeFirstLetter(USER_DATA.name));
      const gradeParagraph = DOMUtils.createElement(
         'p',
         'student-grade',
         `Class: ${USER_DATA.grade}${USER_DATA.section ? '-' + USER_DATA.section : ''}`
      );
      const descriptionParagraph = DOMUtils.createElement('p', 'student-description', `${USER_DATA.accountType} Account`);

      profileInfoDiv.append(nameHeading, gradeParagraph, descriptionParagraph);
      profileContainer.append(profileAvatarDiv, profileInfoDiv);
   },

   createIframe: (src, page, minWidth) => {
      const iframe = DOMUtils.createElement('iframe');

      Object.assign(iframe.style, {
         width: '100%',
         height: '100%',
         border: 'none',
         flex: '1',
         opacity: '0',
         transition: `opacity ${APP_CONFIG.iframeTransitionDuration}`
      });

      if (minWidth) { // Use the passed argument
         iframe.style.minWidth = `${minWidth}px`;
      }

      const paramData = {
         token: USER_DATA['access_token'],
         user_id: window.userId,
         grade: USER_DATA['grade']
      };

      //iframe.src = StringUtils.addUrlParams(src, paramData);

      iframe.src = src;
      iframe.id = page ? page : "";

      iframe.addEventListener('load', function () {
         hideProcessingDialog();
         this.style.opacity = '1';

         // Sync current theme to the newly loaded iframe
         try {
            if (this.contentDocument && this.contentDocument.body) {
               const isLightTheme = APP_CONFIG.theme === 'light' ? true : false;
               const iframeBody = this.contentDocument.body;

               if (isLightTheme) {
                  iframeBody.classList.add('light-theme');
               } else {
                  iframeBody.classList.remove('light-theme');
               }
            }
         } catch (error) {
            console.warn('Cannot sync theme to iframe:', error);
         }

         // Run special initialization function if exists in the loaded iframe page
         if (typeof this.contentWindow.initializePage === 'function') {
            // If it exists, call it with USER_DATA passed
            this.contentWindow.initializePage(USER_DATA);
         }

      });

      return iframe;
   }
};

// =============================================================================
// MENU MANAGEMENT
// =============================================================================

const MenuManager = {
   toggle: () => {
      const sidebar = DOMUtils.getElementById('sidebar');
      const overlay = DOMUtils.getElementById('overlay');

      DOMUtils.toggleClass(sidebar, 'active');
      const isActive = sidebar.classList.contains('active');
      DOMUtils.setDisplay(overlay, isActive ? 'block' : 'none');
   },

   close: () => {
      const sidebar = DOMUtils.getElementById('sidebar');
      const overlay = DOMUtils.getElementById('overlay');

      sidebar.classList.remove('active');
      DOMUtils.hide(overlay);
   },

   initialize: () => {
      const sidebar = DOMUtils.getElementById('sidebar');
      sidebar.innerHTML = '';

      // Add close button
      const closeBtn = DOMUtils.createElement('span', 'close-btn', '×');
      closeBtn.innerHTML = '×'; // Need to set innerHTML for HTML entity
      closeBtn.onclick = MenuManager.toggle;
      sidebar.appendChild(closeBtn);

      // Add menu items
      MENU_ITEMS.forEach(item => {
         sidebar.appendChild(UIComponents.createMenuItem(item));
      });

      // Add logout button
      const logoutBtn = DOMUtils.createElement('button', 'logout-btn');

      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      logoutBtn.addEventListener('click', AuthManager.logout);
      sidebar.appendChild(logoutBtn);
   }
};

// =============================================================================
// DASHBOARD & SUBJECT SWITCHER FUNCTIONS
// =============================================================================

function renderDashboard(subject) {
   const content = DOMUtils.getElementById('content');
   content.innerHTML = '';

   const cards = DASHBOARD_DATA[subject]; // Use the new data source
   if (cards) {
      cards.forEach(cardData => {
         // Use a custom filtering logic to decide whether to show this card (such as, showing cards specific to a school)
         if (shouldDisplayCard(cardData)) {
            const cardElement = UIComponents.createCard(cardData);
            content.appendChild(cardElement);
         }
      });
   }
}

function setupSubjectSwitcher() {
   const switcher = DOMUtils.getElementById('subject-switcher');
   if (!switcher) return;
   switcher.innerHTML = ''; // Clear old buttons

   // The keys of DASHBOARD_DATA are the subscribed subjects
   const dashboardArray = Object.keys(DASHBOARD_DATA);

   const subscribedSubjects = dashboardArray.sort((a, b) => ALL_SUBJECTS.indexOf(a) - ALL_SUBJECTS.indexOf(b));

   if (subscribedSubjects.length === 0) {
      // Optional: Show a message if there are no subscriptions
      DOMUtils.getElementById('content').innerHTML = '<p class="info-message">You are not subscribed to any subjects yet.</p>';
      return;
   }

   // If currentSubject is not in the new list, default to the first one
   if (!subscribedSubjects.includes(currentSubject)) {
      currentSubject = subscribedSubjects[0];
   }

   // Also store current subject in USER_DATA for other pages to access
   USER_DATA['currentSubject'] = currentSubject;

   subscribedSubjects.forEach(subject => {
      const button = document.createElement('button');
      button.className = 'subject-btn';
      button.textContent = StringUtils.capitalizeFirstLetter(subject);
      button.dataset.subject = subject;

      if (subject === currentSubject) {
         button.classList.add('active');
      }

      button.onclick = async () => {
         currentSubject = subject;
         // Also store current subject in USER_DATA for other pages to access
         USER_DATA['currentSubject'] = currentSubject;
         document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('active'));
         button.classList.add('active');
         // Pre-fetch available question banks for this subject
         if (!(currentSubject in QB_DETAILS)) {
            showProcessingDialog();
            QB_DETAILS[currentSubject] = await BackendManager.getQbDetails(USER_DATA['grade'], currentSubject);
            WA_DETAILS[currentSubject] = await BackendManager.getWaDetails(currentSubject);

            hideProcessingDialog();
         }

         renderDashboard(subject);
      };
      switcher.appendChild(button);
   });
}

function extractPages(obj) {
   const result = {};

   for (const [subject, items] of Object.entries(obj)) {
      result[subject] = items
         .filter(item => item.link) // keep only entries with a non-falsy link
         .map(item => item.page); // extract the "page" value
   }

   return result;
}


// =============================================================================
// PAGE MANAGEMENT
// =============================================================================

const PageManager = {

   // This history will track manual page loads for the back button
   manualHistory: [],

   loadPage: (page) => {
      showProcessingDialog();

      // Clear the manual history when navigating to a non-manual page
      if (page === 'home') {
         PageManager.manualHistory = [];
      }

      if (Object.keys(PAGELIST).length === 0 || (!(PAGELIST[currentSubject].includes(page)) && page !== 'home')) {
         if (page === 'word-of-the-day') {
            showRandomWord();
         }
         hideProcessingDialog();
         return;
      }

      APP_CONFIG.currentPage = page;

      const elements = {
         content: DOMUtils.getElementById('content'),
         screenName: DOMUtils.getElementById('screen-name'),
         studentProfile: DOMUtils.getElementById('student-profile'),
         menuBtn: DOMUtils.getElementById('menu-btn'),
         backBtn: DOMUtils.getElementById('back-btn'),
         subjectSwitcher: DOMUtils.getElementById('subject-switcher') // NEW: Get switcher element
      };

      elements.content.innerHTML = '';

      if (page !== 'home') {
         PageManager.loadExternalPage(page, elements);
      } else {
         PageManager.loadHomePage(elements);
      }
   },

   loadExternalPage: async (page, elements) => {
      // Hide subject switcher on external pages
      DOMUtils.hide(elements.subjectSwitcher);
      elements.content.classList.add('externalPage');


      // Find card data from the new SUBJECT_DASHBOARDS object
      const allCards = Object.values(DASHBOARD_DATA).flat();
      const cardData = allCards.find(card => card.page === page);

      if (!cardData) {
         console.error(`No card data found for page key: ${page}`);
         hideProcessingDialog();
         // Optionally show an error message to the user
         elements.content.innerHTML = '<p class="error-message">Could not load this page.</p>';
         return;
      }

      // Show question bank selector if card requires selection
      if (cardData.extra && cardData.extra.qbRequired) {
         hideProcessingDialog();
         const allowedQTypes = cardData?.extra?.allowedQTypes ?? "all";
         const selectedQbIds = await QuestionBankSelector.show(allowedQTypes);
         if (!selectedQbIds) {
            window.history.back();
            return;
         }

         showProcessingDialog();
         USER_DATA['selectedQbIds'] = selectedQbIds;
         console.log(USER_DATA);
      }

      // Show work assignment selector if card requires selection
      if (cardData.extra && cardData.extra.waRequired) {
         hideProcessingDialog();
         const selectedAssignmentId = await WorkAssignmentSelector.show();
         if (!selectedAssignmentId) {
            window.history.back();
            return;
         }

         showProcessingDialog();
         USER_DATA['selectedAssignmentId'] = selectedAssignmentId;
         console.log(USER_DATA);
      }

      // Theme forcing logic
      if (cardData.extra && cardData.extra.forcedTheme) {
         // If this is the first time we're forcing a theme, save the original.
         if (ThemeManager.userPreferredTheme === null) {
            ThemeManager.userPreferredTheme = APP_CONFIG.theme;
         }
         // Apply the forced theme without saving it as a user preference.
         ThemeManager.setTheme(cardData.extra.forcedTheme, false);
      }

      const displayTitle = cardData ? cardData.title : StringUtils.capitalizeFirstLetter(page);

      elements.screenName.innerText = `${displayTitle} `;

      DOMUtils.hide(elements.studentProfile);
      DOMUtils.hide(elements.menuBtn);
      DOMUtils.show(elements.backBtn);

      const iframe = UIComponents.createIframe(cardData.link, page, cardData.min_width);
      elements.content.appendChild(iframe);
   },

   _renderManualPage: (itemData) => {
      const {
         link: url,
         title,
         page_key: pageKey,
         min_width: minWidth,
         extra
      } = itemData;

      if (!url) return;

      showProcessingDialog();
      APP_CONFIG.currentPage = pageKey;

      const elements = {
         content: DOMUtils.getElementById('content'),
         screenName: DOMUtils.getElementById('screen-name'),
         studentProfile: DOMUtils.getElementById('student-profile'),
         menuBtn: DOMUtils.getElementById('menu-btn'),
         backBtn: DOMUtils.getElementById('back-btn'),
         subjectSwitcher: DOMUtils.getElementById('subject-switcher')
      };

      // Set up the page layout like other external pages
      elements.content.innerHTML = '';
      DOMUtils.hide(elements.subjectSwitcher);
      elements.content.classList.add('externalPage');
      elements.screenName.innerText = `${title} `;
      DOMUtils.hide(elements.studentProfile);
      DOMUtils.hide(elements.menuBtn);
      DOMUtils.show(elements.backBtn);

      // Theme forcing logic for manual pages
      if (extra && extra.forcedTheme) {
         if (ThemeManager.userPreferredTheme === null) {
            ThemeManager.userPreferredTheme = APP_CONFIG.theme;
         }
         ThemeManager.setTheme(extra.forcedTheme, false);
      }

      // Create and append the iframe
      const iframe = UIComponents.createIframe(url, pageKey, minWidth);
      elements.content.appendChild(iframe);
   },

   // Function to load custom URLs into an iframe

   loadManualPage: (itemData) => {

      // 1. Render the page without touching history
      PageManager._renderManualPage(itemData);

      // 2. Push state to browser history for back button functionality
      const state = {
         page: itemData.page_key,
         manual: true,
         // We store the full itemData to easily restore it
         itemData: itemData
      };
      PageManager.manualHistory.push(state); // Keep track internally
      window.history.pushState(state, itemData.title, `#${itemData.page_key}`);
   },


   loadHomePage: (elements) => {
      // Theme restoration logic
      if (ThemeManager.userPreferredTheme !== null) {
         ThemeManager.setTheme(ThemeManager.userPreferredTheme, false); // Restore theme, don't save
         ThemeManager.userPreferredTheme = null; // Reset the tracker
      }
      DOMUtils.show(elements.menuBtn);
      DOMUtils.hide(elements.backBtn);
      DOMUtils.setDisplay(elements.studentProfile, 'flex');
      DOMUtils.setDisplay(elements.subjectSwitcher, 'grid'); // Show subject switcher

      elements.screenName.innerText = `${APP_CONFIG.name} `;
      elements.content.classList.remove('externalPage');

      // This still handles profile and menu setup

      // Setup switcher and render the dashboard for the current subject
      setupSubjectSwitcher();
      renderDashboard(currentSubject);

      hideProcessingDialog();
   }
};

// =============================================================================
// AUTHENTICATION MANAGEMENT
// =============================================================================

const AuthManager = {
   login: async () => {
      const elements = {
         signInScreen: DOMUtils.getElementById('sign-in-screen'),
         errorField: DOMUtils.getElementById('error-message'),
         btn: DOMUtils.getElementById('sign-in-btn'),
         username: DOMUtils.getElementById('username'),
         password: DOMUtils.getElementById('password')
      };

      const username = elements.username.value.trim();
      const password = elements.password.value;
      const errorIcon = '<ion-icon name="alert-circle-outline" class="sign-in-error-icon"></ion-icon>';

      AuthManager.setLoadingState(elements.btn, elements.errorField, true);

      if (!username || !password) {
         AuthManager.showError(elements, errorIcon, 'Username and password are required.');
         return;
      }

      try {
         const email = `${username}@app.com`.toLowerCase();
         const data = await window.signInUser(email, password);
         window.userId = data.user.id;

         // Clear previous session
         AuthManager.clearUserSession();

         // Clear back button history
         resetAppHistory();

         // Handle push notification subscription
         await subscribeToPush();

         // Load profile AND dashboard data before showing the page
         await AppManager.initialize();

         DOMUtils.hide(elements.signInScreen);
         await PageManager.loadPage('home'); // Load home page to trigger correct setup

         // Load notification page immediately, if notifId is available
         if (notifId) {
            PageManager.loadManualPage({
               link: './pages/notifications/show.html?notification_id=' + notifId,
               title: 'Notification',
               page_key: 'show-notification'
            });
         }

      } catch (error) {
         AuthManager.showError(elements, errorIcon, error.message);
      }
   },

   logout: async () => {
      const confirmLogout = await window.showDialog({
         title: 'Confirm Logout',
         message: 'Are you sure you want to log out?',
         type: 'confirm'
      });

      if (!confirmLogout) return;

      const loadingOverlay = DOMUtils.getElementById('loading-overlay');
      DOMUtils.setDisplay(loadingOverlay, 'flex');

      MenuManager.close();

      // Handle push notification de-subscription
      await removeAccountPush(window.userId);

      // Also remove account from local storage
      removeAccount(USER_DATA.access_token);

      await signOutUser();

      AuthManager.clearUserSession();
      AuthManager.showSignInScreen();

      DOMUtils.hide(loadingOverlay);
   },

   setLoadingState: (btn, errorField, isLoading) => {
      if (isLoading) {
         btn.innerHTML = '<i class="fas white fa-spinner fa-spin"></i> Wait...';
         btn.disabled = true;
         errorField.innerHTML = '';
      } else {
         btn.innerHTML = 'Sign In';
         btn.disabled = false;
      }
   },

   showError: (elements, errorIcon, message) => {
      elements.errorField.innerHTML = `${errorIcon}<span>${message}</span>`;
      AuthManager.setLoadingState(elements.btn, elements.errorField, false);
   },

   clearUserSession: () => {
      const elements = {
         headerAvatar: DOMUtils.getElementById('header-avatar'),
         studentProfile: DOMUtils.getElementById('student-profile'),
         content: DOMUtils.getElementById('content'),
         sidebar: DOMUtils.getElementById('sidebar'),
         username: DOMUtils.getElementById('username'),
         password: DOMUtils.getElementById('password')
      };

      elements.headerAvatar.src = '';
      elements.studentProfile.innerHTML = '';
      elements.content.innerHTML = '';
      elements.sidebar.innerHTML = '';
      elements.username.value = '';
      elements.password.value = '';
   },

   showSignInScreen: () => {
      const signInScreen = DOMUtils.getElementById('sign-in-screen');
      const btn = DOMUtils.getElementById('sign-in-btn');

      btn.innerHTML = 'Sign In';
      btn.disabled = false;

      DOMUtils.setDisplay(signInScreen, 'flex');
   },

   checkAuthenticationStatus: async () => {
      const signInScreen = DOMUtils.getElementById('sign-in-screen');

      try {
         const isAuthenticated = await checkAuth();

         if (isAuthenticated) {
            // Handle push notification subscription
            await subscribeToPush();
            // Load profile AND dashboard data before showing the page
            await AppManager.initialize();
            DOMUtils.hide(signInScreen);
            await PageManager.loadPage('home'); // Load home page to trigger correct setup

            // Load notification page immediately, if notifId is available
            if (notifId) {
               PageManager.loadManualPage({
                  link: './pages/notifications/show.html?notification_id=' + notifId,
                  title: 'Notification',
                  page_key: 'show-notification'
               });
            }
         } else {
            DOMUtils.setDisplay(signInScreen, 'flex');
         }
      } catch (error) {
         console.error('Auth check error:', error);
      } finally {
         setTimeout(() => {
            DOMUtils.hide(DOMUtils.getElementById('loading-overlay'));
         }, APP_CONFIG.loadingDelay);
      }
   }
};

// =============================================================================
// THEME MANAGEMENT
// =============================================================================

const ThemeManager = {
   // Variable to store the user's theme before forcing a change (certain pages force a specific theme — we're tracking user's original preference so we can revert)
   userPreferredTheme: null,

   // Central function to set the theme. Can optionally save the preference.
   setTheme: (theme, savePreference = false) => {
      const body = document.body;
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      const isLightTheme = theme === 'light';

      if (isLightTheme) {
         body.classList.add("light-theme");
         metaThemeColor.setAttribute("content", "#ffffff");
         DOMUtils.getElementById('theme-toggle-btn').setAttribute("name", "moon-outline");
         APP_CONFIG.theme = "light";
         if (savePreference) {
            updateRow('settings', ['student_id'], [window.userId], ['theme'], [1]);
         }
      } else {
         body.classList.remove("light-theme");
         metaThemeColor.setAttribute("content", "#000000");
         DOMUtils.getElementById('theme-toggle-btn').setAttribute("name", "sunny-outline");
         APP_CONFIG.theme = "dark";
         if (savePreference) {
            updateRow('settings', ['student_id'], [window.userId], ['theme'], [0]);
         }
      }
      ThemeManager.syncThemeToIframes(isLightTheme);
   },

   toggle: () => {
      const newTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
      ThemeManager.setTheme(newTheme, true); // Always save the preference when user toggles manually
   },

   syncThemeToIframes: (isLightTheme) => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         try {
            if (iframe.contentDocument && iframe.contentDocument.body) {
               const iframeBody = iframe.contentDocument.body;
               if (isLightTheme) {
                  iframeBody.classList.add('light-theme');
               } else {
                  iframeBody.classList.remove('light-theme');
               }
               // Run special toggleIframeTheme function if exists in the loaded iframe page
               if (typeof iframe.contentWindow.toggleIframeTheme === 'function') {
                  // If it exists, call it to sync live theme changes
                  iframe.contentWindow.toggleIframeTheme();
               }
            }
         } catch (error) {
            console.warn('Cannot access iframe content (likely cross-origin):', error);
         }
      });
   }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const StringUtils = {
   capitalizeFirstLetter: (str) => {
      if (!str || str.length === 0) return str;
      return str
         .toLowerCase()
         .split(/\s+/)
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");
   },

   addUrlParams: (url, params) => {
      const paramString = Object.entries(params)
         .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
         .join('&');

      const separator = url.includes('?') ? '&' : '?';
      return url + separator + paramString;
   }
};


// =============================================================================
// APP MANAGEMENT
// =============================================================================

const AppManager = {
   latestKnownNotificationId: null,
   notificationPollInterval: null,

   initialize: async () => {
      await UIComponents.createUserProfile();
      MENU_ITEMS = await BackendManager.getMenuItems(); // Fetch and store menu items
      DASHBOARD_DATA = await BackendManager.getDashboardData(); // Fetch and store dashboard data
      PAGELIST = extractPages(DASHBOARD_DATA);
      SUBSCRIPTION_DATA = await BackendManager.getSubscriptionData(); // Fetch and store subscription data
      USER_DATA['subscriptions'] = SUBSCRIPTION_DATA;

      // --- Notifications fetching ---
      const initialNotifData = await BackendManager.getNotifications(null, 5);
      USER_DATA['notifications'] = initialNotifData;

      // Store the ID of the newest notification
      if (initialNotifData.notifications && initialNotifData.notifications.length > 0) {
         // Assuming notifications[0] is the newest (as per ORDER BY DESC)
         AppManager.latestKnownNotificationId = initialNotifData.notifications[0].id;
      }
      // --- Notifications fetching ---

      MenuManager.initialize();
      QuestionBankSelector.init();
      WorkAssignmentSelector.init();
      NotificationBadge.updateNotificationCount(USER_DATA['notifications']['count_unread']);
      // Preload certain pages for caching and performance
      AppManager.preloadIframes(PRELOADABLE_RESOURCES);
      // Start the polling after initialization is complete
      AppManager.startNotificationPolling();
   },

   // Preloads an array of URLs by creating and appending hidden iframes
   preloadIframes: (urlArray) => {
      // Create a hidden container for the preloading iframes.
      // This keeps the DOM clean and ensures they are not visible or interactive.
      const preloadContainer = document.createElement('div');
      preloadContainer.style.display = 'none';
      preloadContainer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(preloadContainer);

      console.log('Starting iframe preloading...');

      urlArray.forEach(url => {
         const iframe = document.createElement('iframe');
         // Set attributes to ensure they don't affect accessibility or user interaction.
         iframe.setAttribute('role', 'presentation');
         iframe.setAttribute('aria-hidden', 'true');
         iframe.setAttribute('tabindex', '-1');

         iframe.loading = 'eager';
         iframe.src = BASE_URL + url;

         iframe.onload = () => {
            console.log(`Successfully preloaded: ${url}`);
         };
         iframe.onerror = () => {
            console.error(`Failed to preload: ${url}`);
         };

         preloadContainer.appendChild(iframe);
      });
   },

   checkFoNewNotifications: async () => {
      const data = await BackendManager.getNewNotifications(AppManager.latestKnownNotificationId);

      if (!data) return; // Error or no data

      const newNotifications = data.notifications || [];
      const newCount = data.count_unread;

      // Case 1: New notifications have arrived!
      if (newNotifications.length > 0) {
         console.log(`Found ${newNotifications.length} new notifications.`);

         // 1. Update the latest known ID to the newest one (which is the first in the list)
         AppManager.latestKnownNotificationId = newNotifications[0].id;

         // 2. Prepend new notifications to the global USER_DATA (newest first)
         USER_DATA['notifications']['notifications'].unshift(...newNotifications);

         // 3. Update the global unread count
         USER_DATA['notifications']['count_unread'] = newCount;

         // 4. Update the badge (with ripple)
         NotificationBadge.updateNotificationCount(newCount, true);

         // 5. If the notification iframe is open, send the new notifications to it

         const notifFrame = document.getElementById('notifications'); // <<<--- the iframe id is always the page key
         if (notifFrame && notifFrame.contentWindow && typeof notifFrame.contentWindow.prependNewNotifications === 'function') {
            notifFrame.contentWindow.prependNewNotifications(newNotifications);
         }

      }
      // Case 2: No new notifications, but the unread count has changed
      // (e.g., user read a notification on another device)
      else if (newCount !== USER_DATA['notifications']['count_unread']) {

         // 1. Update the global unread count
         USER_DATA['notifications']['count_unread'] = newCount;

         // 2. Update the badge (no ripple)
         NotificationBadge.updateNotificationCount(newCount, false);
      }
   },

   startNotificationPolling: (intervalMs = 15000) => { // Poll every 15 seconds
      // Clear any existing poller
      if (AppManager.notificationPollInterval) {
         clearInterval(AppManager.notificationPollInterval);
      }

      // Start the new poller
      AppManager.notificationPollInterval = setInterval(
         AppManager.checkFoNewNotifications,
         intervalMs
      );
      console.log(`Notification polling started (every ${intervalMs / 1000}s).`);
   }
};

// =============================================================================
// GLOBAL FUNCTIONS (for backward compatibility & sharing with iframes)
// =============================================================================

function toggleMenu() {
   MenuManager.toggle();
}

function toggleTheme() {
   ThemeManager.toggle();
}

function loadPage(page) {
   PageManager.loadPage(page);
}

function loadManualPage(pageData) {
   PageManager.loadManualPage(pageData);
}

async function logOut() {
   await AuthManager.logout();
}

async function login() {
   await AuthManager.login();
}

async function getNotifications(lastNotifID = null, pageSize = 5) {
   const data = await BackendManager.getNotifications(lastNotifID, pageSize);
   return data;
}

async function refreshNotificationBadge(showRipples = true) {
   const data = await BackendManager.getNotifications(null, 0);
   if (data) {
      NotificationBadge.updateNotificationCount(data.count_unread, showRipples);
   }
}

function init() {
   PageManager.loadPage('home');
}

function capitalizeFirstLetter(str) {
   return StringUtils.capitalizeFirstLetter(str);
}

function createUserProfile() {
   UIComponents.createUserProfile();
}

// Function to filter out cards based on custom logic (such as, allowing certain cards only for the students of a specific school)
function shouldDisplayCard(card) {
   return !card?.extra?.hasOwnProperty("jvpOnly") || card.extra.jvpOnly === true;
}

function createAndAppendCards() {
   // MODIFIED: Now renders the dashboard for the currently active subject
   renderDashboard(currentSubject);
}

function createAndAppendMenuItems() {
   MenuManager.initialize();
}

function addIframeToContent(src, contentDiv, page) {
   const iframe = UIComponents.createIframe(src, page);
   contentDiv.appendChild(iframe);
}

// =====================================================================
// RESET HISTORY WHEN NEW USER SIGNS IN
// =====================================================================
function resetAppHistory() {

    // 1. Clear internal manual navigation history
    if (PageManager.manualHistory) {
        PageManager.manualHistory.length = 0;
    }

    // 2. Replace browser history state with a fresh one
    window.history.replaceState({
        page: "home",
        manual: false
    }, "");

    // 3. Force-load the home page WITHOUT adding new history entries
    if (typeof PageManager.loadPage === "function") {
        PageManager.loadPage("home");
    }

    // 4. Optional: Clear any cached current page info your app tracks
    if (APP_CONFIG && APP_CONFIG.currentPage !== undefined) {
        APP_CONFIG.currentPage = "home";
    }
}


// =============================================================================
// EVENT LISTENERS
// =============================================================================

document.getElementById('sign-in-btn').addEventListener('click', (event) => {
   event.preventDefault();
   AuthManager.login();
});

window.addEventListener('load', () => {
   AuthManager.checkAuthenticationStatus();
});

document.getElementById('back-btn').addEventListener('click', () => {
   window.history.back();
});

// =============================================================================
// BROWSER BACK BUTTON HANDLING
// =============================================================================

window.history.replaceState({
   page: APP_CONFIG.currentPage
}, "");

const originalLoadPage = PageManager.loadPage;
PageManager.loadPage = (page) => {
   originalLoadPage(page);
   // Don't push history for pages that don't exist in PAGELIST
   if (Object.keys(PAGELIST).length === 0 || !(PAGELIST[currentSubject] && PAGELIST[currentSubject].includes(page))) {
      return;
   }
   if (window.history.state?.page !== page) {
      // Use a distinct state for dashboard pages
      window.history.pushState({
         page: page,
         manual: false
      }, "");
   }
};

// Popstate event listener
window.addEventListener("popstate", (event) => {
   const state = event.state;

   // If there's no state or we're at the home page, load home.
   if (!state || state.page === "home") {
      PageManager.manualHistory = []; // Clear the manual history
      PageManager.loadPage("home");
      return;
   }

   // If the state indicates a manually loaded page
   if (state.manual) {
      // We are going back to a previous manual page.
      // Pop the last entry from our internal history tracker.
      PageManager.manualHistory.pop();

      // Render the page using the data from the state object,
      // without pushing a new history state.
      PageManager._renderManualPage(state.itemData);
   } else {
      // It's a regular dashboard page, so load it normally.
      PageManager.loadPage(state.page);
   }
});
