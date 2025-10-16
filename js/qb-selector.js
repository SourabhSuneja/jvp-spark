let questionBanks = [
    { id: 1, display_name: "Ch-1: Number Systems", subject: "English", grade: 5, book: "Oxford Grammar", chapter: "Verbs", topic: "Tenses" },
    { id: 2, display_name: "Ch-2: Charts in MS Excel", subject: "Maths", grade: 8, book: "NCERT", chapter: "Linear Equations", topic: "Variables" },
    { id: 3, display_name: "Ch-3: More on PowerPoint", subject: "Science", grade: 9, book: "NCERT", chapter: "Force", topic: "Newton's Laws" },
    { id: 4, display_name: "Ch-4: Cyber Safety", subject: "Social Studies", grade: 6, chapter: "Geography", topic: "States and Capitals" }
];

// Question Bank Selector Module (Multi-select version)
const QuestionBankSelector = {
  // Configuration
  config: {
    overlayId: 'questionBankOverlay',
    contentId: 'qbContent',
    searchInputId: 'qbSearchInput',
    confirmBtnId: 'qbConfirmBtn',
    selectionCountId: 'qbSelectionCount',
  },

  // Internal state
  state: {
    questionBanks: [],
    filteredBanks: [],
    selectedBankIds: [],
    isVisible: false,
    promiseResolve: null // ADDED: To store the promise's resolve function
  },

  // Initialize the selector
  init() { // CHANGED: Removed onSelectCallback parameter
    this.cacheElements();
    this.attachEventListeners();
  },

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      overlay: document.getElementById(this.config.overlayId),
      content: document.getElementById(this.config.contentId),
      searchInput: document.getElementById(this.config.searchInputId),
      confirmBtn: document.getElementById(this.config.confirmBtnId),
      selectionCount: document.getElementById(this.config.selectionCountId),
    };
  },

  // Attach event listeners
  attachEventListeners() {
    // Close on overlay click
    this.elements.overlay.addEventListener('click', (e) => {
      // CHANGED: Call cancelSelection instead of hide
      if (e.target === this.elements.overlay) this.cancelSelection();
    });

    // Search functionality
    this.elements.searchInput.addEventListener('input', (e) => {
      this.filterQuestionBanks(e.target.value);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      // CHANGED: Call cancelSelection instead of hide
      if (e.key === 'Escape' && this.state.isVisible) this.cancelSelection();
    });

    // Handle item selection via event delegation
    this.elements.content.addEventListener('click', (e) => {
      const item = e.target.closest('.qb-item');
      if (item) {
        const bankId = parseInt(item.dataset.id, 10);
        if (!isNaN(bankId)) this.toggleSelection(bankId);
      }
    });
      
    // Handle confirm button click
    this.elements.confirmBtn.addEventListener('click', () => {
      this.confirmSelection();
    });
  },

  // Show the selector
  show() { // CHANGED: Now returns a promise
    return new Promise(resolve => {
        this.state.promiseResolve = resolve; // Store the resolve function

        if (typeof questionBanks !== 'undefined') {
            this.state.questionBanks = questionBanks;
            this.state.filteredBanks = [...questionBanks];
        } else {
            console.error('questionBanks variable not found');
            this.renderEmpty('No question banks available');
            // Resolve immediately if there's an issue to prevent a hanging promise
            if (this.state.promiseResolve) {
                this.state.promiseResolve(false);
                this.state.promiseResolve = null;
            }
            return;
        }
        
        this.state.selectedBankIds = [];
        this.renderQuestionBanks();
        this.updateFooter();
        
        this.elements.overlay.classList.add('active');
        this.state.isVisible = true;
        this.elements.searchInput.focus();
        document.body.style.overflow = 'hidden';
    });
  },

  // hideUi only handles the UI changes for hiding the selector
  hideUi() { // RENAMED: from hide() to hideUi()
    this.elements.overlay.classList.remove('active');
    this.state.isVisible = false;
    document.body.style.overflow = '';
  },

  // Filter question banks based on search query
  filterQuestionBanks(query) {
    const searchTerm = query.toLowerCase().trim();
    
    this.state.filteredBanks = searchTerm
      ? this.state.questionBanks.filter(bank =>
          Object.values(bank).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          )
        )
      : [...this.state.questionBanks];
    
    this.renderQuestionBanks();
  },

  // Toggle a bank's selection state
  toggleSelection(bankId) {
    const index = this.state.selectedBankIds.indexOf(bankId);
    
    if (index > -1) {
      this.state.selectedBankIds.splice(index, 1); // Deselect
    } else {
      this.state.selectedBankIds.push(bankId); // Select
    }
    
    // Visually update the specific item without re-rendering the whole list
    const itemElement = this.elements.content.querySelector(`.qb-item[data-id="${bankId}"]`);
    itemElement?.classList.toggle('selected');
    this.updateFooter();
  },

  // Update footer counter and button state
  updateFooter() {
    const count = this.state.selectedBankIds.length;
    this.elements.selectionCount.textContent = `${count} selected`;
    this.elements.confirmBtn.disabled = count === 0;
  },

  // Render question banks (no changes to this method)
  renderQuestionBanks() {
    if (this.state.filteredBanks.length === 0) {
      this.renderEmpty('No question banks match your search');
      return;
    }
    const html = this.state.filteredBanks.map(bank => {
      const isSelected = this.state.selectedBankIds.includes(bank.id);
      return `
      <div class="qb-item ${isSelected ? 'selected' : ''}" data-id="${bank.id}">
        <div class="qb-item-checkbox"><i class="far fa-square"></i><i class="fas fa-check-square"></i></div>
        <div class="qb-item-icon"><i class="fas fa-graduation-cap"></i></div>
        <div class="qb-item-content">
          <div class="qb-item-title">${this.escapeHtml(bank.display_name)}</div>
          <div class="qb-item-meta">
            <span class="qb-item-tag"><i class="fas fa-layer-group"></i>Grade ${bank.grade}</span>
            <span class="qb-item-tag"><i class="fas fa-book"></i>${this.escapeHtml(bank.subject)}</span>
            ${bank.chapter ? `<span class="qb-item-tag"><i class="fas fa-bookmark"></i>${this.escapeHtml(bank.chapter)}</span>` : ''}
            ${bank.topic ? `<span class="qb-item-tag"><i class="fas fa-tag"></i>${this.escapeHtml(bank.topic)}</span>` : ''}
          </div>
        </div>
      </div>
    `}).join('');
    this.elements.content.innerHTML = html;
  },

  // Render empty state (no changes)
  renderEmpty(message) {
    this.elements.content.innerHTML = `<div class="qb-empty"><i class="fas fa-inbox"></i><p>${this.escapeHtml(message)}</p></div>`;
  },

  // Handle final selection confirmation
  confirmSelection() { // CHANGED: Resolves the promise
    if (this.state.selectedBankIds.length === 0) return;
    
    if (this.state.promiseResolve) {
      this.state.promiseResolve([...this.state.selectedBankIds]); // Resolve with a copy of the IDs
      this.state.promiseResolve = null; // Clean up for next time
    }
    
    this.hideUi();
  },

  // ADDED: Handle cancellation
  cancelSelection() {
    if (this.state.promiseResolve) {
      this.state.promiseResolve(false); // Resolve with false
      this.state.promiseResolve = null; // Clean up
    }
    this.hideUi();
  },

  // Utility: Escape HTML to prevent XSS (no changes)
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
