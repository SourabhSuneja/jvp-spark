let questionBanks = [
  {
    "bank_key": "grade6_english_tenses",
    "display_name": "Class 6: English Tenses",
    "grade": 6,
    "subject": "English",
    "book": "Grammar Essentials",
    "chapter": "Tenses",
    "topic": "Tenses",
    "question_count": 10,
    "within_current_plan": true
  },
  {
    "bank_key": "grade6_english_verbs",
    "display_name": "Class 6: English Verbs",
    "grade": 6,
    "subject": "English",
    "book": "Grammar Essentials",
    "chapter": "Verbs",
    "topic": "Verbs",
    "question_count": 5,
    "within_current_plan": true
  },
  {
    "bank_key": "grade6_english_determiners",
    "display_name": "Class 6: English Determiners",
    "grade": 6,
    "subject": "English",
    "book": "Grammar Essentials",
    "chapter": "Determiners",
    "topic": "Determiners",
    "question_count": 5,
    "within_current_plan": false
  },
  {
    "bank_key": "grade6_english_prepositions",
    "display_name": "Class 6: English Prepositions",
    "grade": 6,
    "subject": "English",
    "book": "Grammar Essentials",
    "chapter": "Prepositions",
    "topic": "Prepositions",
    "question_count": 5,
    "within_current_plan": false
  }
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
    promiseResolve: null
  },

  // Initialize the selector
  init() {
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
  show() {
    return new Promise(resolve => {
        this.state.promiseResolve = resolve;

        if (typeof questionBanks !== 'undefined') {
            // MODIFIED: Add a unique 'id' to each bank object for easier handling
            this.state.questionBanks = questionBanks.map((bank, index) => ({ ...bank, id: index }));
            this.state.filteredBanks = [...this.state.questionBanks];
        } else {
            console.error('questionBanks variable not found');
            this.renderEmpty('No question banks available');
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
        document.body.style.overflow = 'hidden';
    });
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

  // MODIFIED: Prevent selection of disabled banks
  toggleSelection(bankId) {
    // Find the bank object by its ID
    const bank = this.state.questionBanks.find(b => b.id === bankId);

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

  // MODIFIED: Render banks differently based on plan status
  renderQuestionBanks() {
    if (this.state.filteredBanks.length === 0) {
      this.renderEmpty('No question banks match your search');
      return;
    }
    const html = this.state.filteredBanks.map(bank => {
      const isSelected = this.state.selectedBankIds.includes(bank.id);
      const isInPlan = bank.within_current_plan;

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
              ? `<span class="qb-item-qcount">(${bank.question_count} questions)</span>` 
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
  }
};
