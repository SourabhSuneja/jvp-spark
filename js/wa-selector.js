// Work Assignment Selector Module (Single-select version)
const WorkAssignmentSelector = {
  // Configuration
  config: {
    overlayId: 'workAssignmentOverlay',
    contentId: 'waContent',
    searchInputId: 'waSearchInput',
    confirmBtnId: 'waConfirmBtn',
    selectionInfoId: 'waSelectionInfo',
  },

  // Internal state
  state: {
    assignments: [],
    filteredAssignments: [],
    selectedAssignmentId: null, // Single selection
    isVisible: false,
    promiseResolve: null,
    isInitialized: false // Flag to see if the object has been initialized before
  },

  // Initialize the selector
  init() {
    // FIX: Guard clause to prevent double initialization
    if (this.state.isInitialized) return;
    
    this.cacheElements();
    this.attachEventListeners();

    // Set flag to true
    this.state.isInitialized = true;
  },

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      overlay: document.getElementById(this.config.overlayId),
      content: document.getElementById(this.config.contentId),
      searchInput: document.getElementById(this.config.searchInputId),
      confirmBtn: document.getElementById(this.config.confirmBtnId),
      selectionInfo: document.getElementById(this.config.selectionInfoId),
    };
  },

  // Attach event listeners
  attachEventListeners() {
    this.elements.overlay.addEventListener('click', (e) => {
      if (e.target === this.elements.overlay) this.cancelSelection();
    });
    this.elements.searchInput.addEventListener('input', (e) => {
      this.filterAssignments(e.target.value);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isVisible) this.cancelSelection();
    });
    this.elements.content.addEventListener('click', (e) => {
      const item = e.target.closest('.wa-item');
      if (item) {
        // The ID is stored on the 'data-id' attribute
        const assignmentId = parseInt(item.dataset.id, 10);
        if (!isNaN(assignmentId)) this.selectAssignment(assignmentId);
      }
    });
    this.elements.confirmBtn.addEventListener('click', () => {
      this.confirmSelection();
    });
  },

  // Show the selector
  show() {
    return new Promise(resolve => {
        this.state.promiseResolve = resolve;

        // Use WA_DETAILS instead of QB_DETAILS
        if (typeof WA_DETAILS !== 'undefined' && WA_DETAILS[currentSubject] && WA_DETAILS[currentSubject].length > 0) {
            this.state.assignments = WA_DETAILS[currentSubject].map((wa) => ({ ...wa }));
            this.state.filteredAssignments = [...this.state.assignments];
        } else {
            console.log('WA_DETAILS[currentSubject] not found or empty');
            this.renderEmpty('No work assignments available');
            this.showUi();
            return;
        }

        this.state.selectedAssignmentId = null; // Reset selection
        this.renderAssignments();
        this.updateFooter();
        this.showUi();
    });
  },

  showUi() {
    this.elements.overlay.classList.add('active');
    this.state.isVisible = true;
    document.body.style.overflow = 'hidden';
  },

  hideUi() {
    this.elements.overlay.classList.remove('active');
    this.state.isVisible = false;
    document.body.style.overflow = '';
    // Clear search input for next time
    this.elements.searchInput.value = '';
  },

  // Updated filter logic for assignments
  filterAssignments(query) {
    const searchTerm = query.toLowerCase().trim();
    this.state.filteredAssignments = searchTerm
      ? this.state.assignments.filter(wa =>
          (wa.title && wa.title.toLowerCase().includes(searchTerm)) ||
          (wa.type && wa.type.toLowerCase().includes(searchTerm)) ||
          (wa.description && wa.description.toLowerCase().includes(searchTerm)) ||
          (wa.keywords && wa.keywords.toLowerCase().includes(searchTerm))
        )
      : [...this.state.assignments];
    this.renderAssignments();
  },

  // New single-selection logic
  selectAssignment(assignmentId) {
    // If the same item is clicked, do nothing.
    if (this.state.selectedAssignmentId === assignmentId) {
      return;
    }

    // Deselect the old item in UI (if one was selected)
    if (this.state.selectedAssignmentId) {
      const oldItem = this.elements.content.querySelector(
        `.wa-item[data-id="${this.state.selectedAssignmentId}"]`
      );
      oldItem?.classList.remove('selected');
    }

    // Select the new item in UI
    const newItem = this.elements.content.querySelector(
      `.wa-item[data-id="${assignmentId}"]`
    );
    newItem?.classList.add('selected');

    // Update state
    this.state.selectedAssignmentId = assignmentId;

    this.updateFooter();
  },

  // Updated footer logic for single selection
  updateFooter() {
    const selectedId = this.state.selectedAssignmentId;

    if (selectedId) {
      // Find the assignment to display its title
      const assignment = this.state.assignments.find(
        wa => wa.work_set_id == selectedId
      );
      if (assignment) {
        this.elements.selectionInfo.textContent = `Selected: ${this.escapeHtml(assignment.title)}`;
      }
      this.elements.confirmBtn.disabled = false;
    } else {
      this.elements.selectionInfo.textContent = 'Please select an assignment';
      this.elements.confirmBtn.disabled = true;
    }
  },

  // New render logic for assignments
  renderAssignments() {
    if (this.state.filteredAssignments.length === 0) {
      this.renderEmpty('No assignments match your search');
      return;
    }
    const html = this.state.filteredAssignments.map(wa => {
      const isSelected = this.state.selectedAssignmentId == wa.work_set_id;
      // Get total questions from the 'Total' key
      const totalCount = wa.question_count?.Total || 0;
      const itemClass = `wa-item ${isSelected ? 'selected' : ''}`;
      const formattedDate = this.formatDisplayDate(wa.assigned_at);

      return `
      <div class="${itemClass}" data-id="${wa.work_set_id}">
        <div class="wa-item-radio">
          <i class="far fa-circle"></i>
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="wa-item-content">
          <div class="wa-item-title">
            ${this.escapeHtml(wa.title)}
            <span class="wa-item-qcount">(${totalCount} questions)</span>
          </div>
          <div class="wa-item-meta">
            ${formattedDate ? `<span class="wa-item-tag"><i class="fas fa-calendar-alt"></i>${formattedDate}</span>` : ''}
            ${wa.created_by ? `<span class="wa-item-tag"><i class="fas fa-user-edit"></i>By: ${this.escapeHtml(wa.created_by)}</span>` : ''}
          </div>
          ${wa.description ? `<p class="wa-item-description">${this.escapeHtml(wa.description)}</p>` : ''}
          ${wa.keywords ? `<span class="wa-item-keywords-hidden" style="display:none;">${this.escapeHtml(wa.keywords)}</span>` : ''}
        </div>
      </div>
      `}).join('');
    this.elements.content.innerHTML = html;
  },

  renderEmpty(message) {
    this.elements.content.innerHTML = `<div class="wa-empty"><i class="fas fa-inbox"></i><p>${this.escapeHtml(message)}</p></div>`;
  },

  // Confirm returns a single ID or null
  confirmSelection() {
    if (!this.state.selectedAssignmentId) return;
    if (this.state.promiseResolve) {
      this.state.promiseResolve(this.state.selectedAssignmentId); // Return the single ID
      this.state.promiseResolve = null;
    }
    this.hideUi();
  },

  cancelSelection() {
    if (this.state.promiseResolve) {
      this.state.promiseResolve(false); // Return false on cancel
      this.state.promiseResolve = null;
    }
    this.hideUi();
  },

  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // New helper function to format date as requested
  formatDisplayDate(isoString) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        // Format: 25 Oct 2025 at 10:00 PM
        const datePart = new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
        const timePart = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date);
        return `${datePart} at ${timePart}`;
    } catch (e) {
        console.error("Error formatting date:", isoString, e);
        return 'Invalid date';
    }
  },
};

WorkAssignmentSelector.init();
