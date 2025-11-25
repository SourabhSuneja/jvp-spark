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
    promiseResolve: null,
    allowedQTypes: "all" // default
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
      selectionCount: document.getElementById(this.config.selectionCountId),
    };
  },

  // Attach event listeners
  attachEventListeners() {
    this.elements.overlay.addEventListener('click', (e) => {
      if (e.target === this.elements.overlay) this.cancelSelection();
    });
    this.elements.searchInput.addEventListener('input', (e) => {
      this.filterQuestionBanks(e.target.value);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isVisible) this.cancelSelection();
    });
    this.elements.content.addEventListener('click', (e) => {
      const item = e.target.closest('.qb-item');
      if (item) {
        const bankId = parseInt(item.dataset.id, 10);
        if (!isNaN(bankId)) this.toggleSelection(bankId);
      }
    });
    this.elements.confirmBtn.addEventListener('click', () => {
      this.confirmSelection();
    });
  },

  // Show the selector
  show(allowedQTypes="all") {
    return new Promise(resolve => {
        this.state.promiseResolve = resolve;
        this.state.allowedQTypes = allowedQTypes;

        if (QB_DETAILS[currentSubject] && QB_DETAILS[currentSubject].length > 0) {
            this.state.questionBanks = QB_DETAILS[currentSubject].map((bank, index) => ({ ...bank }));
            this.state.filteredBanks = [...this.state.questionBanks];
        } else {
            console.log('QB_DETAILS[currentSubject] not found');
            this.renderEmpty('No question banks available');
            this.showUi();
            return;
        }
        
        this.state.selectedBankIds = [];
        this.renderQuestionBanks();
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
  },

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

  // Prevent selection of disabled banks
  toggleSelection(bankId) {
    // Find the bank object by its ID
    const bank = this.state.questionBanks.find(b => b.id == bankId);

    // Guard clause: Do nothing if the bank is not in the user's plan
    if (!bank || !bank.within_current_plan) {
        return;
    }

    const index = this.state.selectedBankIds.indexOf(bankId);
    if (index > -1) {
      this.state.selectedBankIds.splice(index, 1);
    } else {
      this.state.selectedBankIds.push(bankId);
    }
    
    const itemElement = this.elements.content.querySelector(`.qb-item[data-id="${bankId}"]`);
    itemElement?.classList.toggle('selected');
    this.updateFooter();
  },

  updateFooter() {
    const count = this.state.selectedBankIds.length;
    this.elements.selectionCount.textContent = `${count} selected`;
    this.elements.confirmBtn.disabled = count === 0;
  },

  // Render banks differently based on plan status
  renderQuestionBanks() {
    if (this.state.filteredBanks.length === 0) {
      this.renderEmpty('No question banks match your search');
      return;
    }
    const html = this.state.filteredBanks.map(bank => {
      const isSelected = this.state.selectedBankIds.includes(bank.id);
      const isInPlan = bank.within_current_plan;
      const totalCount = this.getAllowedQuestionCount(bank.question_count);

      // Add a 'disabled' class if the bank is not within the current plan
      const itemClass = `qb-item ${isSelected ? 'selected' : ''} ${!isInPlan ? 'disabled' : ''}`;

      return `
      <div class="${itemClass}" data-id="${bank.id}">
        <div class="qb-item-checkbox">
          ${isInPlan 
            ? '<i class="far fa-square"></i><i class="fas fa-check-square"></i>'
            : '<i class="fas fa-lock"></i>'
          }
        </div>
        <div class="qb-item-content">
          <div class="qb-item-title">
            ${this.escapeHtml(bank.display_name)}
            ${isInPlan 
              ? `<span class="qb-item-qcount">(${totalCount} questions)</span>` 
              : ''
            }
          </div>
          <div class="qb-item-meta">
            ${!isInPlan 
              ? `<span class="qb-item-plan-limit-text"><i class="fas fa-exclamation-circle"></i> Out of your current plan's limit</span>`
              : `<span class="qb-item-tag"><i class="fas fa-layer-group"></i>Grade ${bank.grade}</span>
                 <span class="qb-item-tag"><i class="fas fa-book"></i>${this.escapeHtml(bank.subject)}</span>
                 ${bank.chapter ? `<span class="qb-item-tag"><i class="fas fa-bookmark"></i>${this.escapeHtml(bank.chapter)}</span>` : ''}`
            }
          </div>
        </div>
      </div>
    `}).join('');
    this.elements.content.innerHTML = html;
  },

  renderEmpty(message) {
    this.elements.content.innerHTML = `<div class="qb-empty"><i class="fas fa-inbox"></i><p>${this.escapeHtml(message)}</p></div>`;
  },

  confirmSelection() {
    if (this.state.selectedBankIds.length === 0) return;
    if (this.state.promiseResolve) {
      this.state.promiseResolve([...this.state.selectedBankIds]);
      this.state.promiseResolve = null;
    }
    this.hideUi();
  },

  cancelSelection() {
    if (this.state.promiseResolve) {
      this.state.promiseResolve(false);
      this.state.promiseResolve = null;
    }
    this.hideUi();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getAllowedQuestionCount(qCounts) {

  const allowedQTypes = this.state.allowedQTypes;
  // Case 1: If all question types are allowed
  if (allowedQTypes === "all") {
    return qCounts["Total"] || 0; // Safely return Total or 0 if missing
  }

  // Case 2: If specific types are allowed
  if (Array.isArray(allowedQTypes)) {
    return allowedQTypes.reduce((sum, type) => {
      return sum + (qCounts[type] || 0); // Add only existing keys
    }, 0);
  }

  // Fallback (invalid input)
  return 0;
}

};

QuestionBankSelector.init();
