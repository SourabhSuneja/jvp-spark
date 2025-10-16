// Question Bank Selector Module
const QuestionBankSelector = {
  // Configuration
  config: {
    overlayId: 'questionBankOverlay',
    contentId: 'qbContent',
    searchInputId: 'qbSearchInput',
    onSelectCallback: null
  },

  // Internal state
  state: {
    questionBanks: [],
    filteredBanks: [],
    isVisible: false
  },

  // Initialize the selector
  init(onSelectCallback) {
    this.config.onSelectCallback = onSelectCallback;
    this.cacheElements();
    this.attachEventListeners();
  },

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      overlay: document.getElementById(this.config.overlayId),
      content: document.getElementById(this.config.contentId),
      searchInput: document.getElementById(this.config.searchInputId)
    };
  },

  // Attach event listeners
  attachEventListeners() {
    // Close on overlay click
    this.elements.overlay.addEventListener('click', (e) => {
      if (e.target === this.elements.overlay) {
        this.hide();
      }
    });

    // Search functionality
    this.elements.searchInput.addEventListener('input', (e) => {
      this.filterQuestionBanks(e.target.value);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isVisible) {
        this.hide();
      }
    });
  },

  // Show the selector
  show() {
    // Load question banks from global variable
    if (typeof questionBanks !== 'undefined') {
      this.state.questionBanks = questionBanks;
      this.state.filteredBanks = [...questionBanks];
      this.renderQuestionBanks();
    } else {
      console.error('questionBanks variable not found');
      this.renderEmpty('No question banks available');
      return;
    }

    this.elements.overlay.classList.add('active');
    this.state.isVisible = true;
    this.elements.searchInput.value = '';
    this.elements.searchInput.focus();
    document.body.style.overflow = 'hidden';
  },

  // Hide the selector
  hide() {
    this.elements.overlay.classList.remove('active');
    this.state.isVisible = false;
    document.body.style.overflow = '';
    this.elements.searchInput.value = '';
  },

  // Filter question banks based on search query
  filterQuestionBanks(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      this.state.filteredBanks = [...this.state.questionBanks];
    } else {
      this.state.filteredBanks = this.state.questionBanks.filter(bank => {
        return (
          bank.display_name.toLowerCase().includes(searchTerm) ||
          bank.subject.toLowerCase().includes(searchTerm) ||
          bank.grade.toString().includes(searchTerm) ||
          (bank.book && bank.book.toLowerCase().includes(searchTerm)) ||
          (bank.chapter && bank.chapter.toLowerCase().includes(searchTerm)) ||
          (bank.topic && bank.topic.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    this.renderQuestionBanks();
  },

  // Render question banks
  renderQuestionBanks() {
    if (this.state.filteredBanks.length === 0) {
      this.renderEmpty('No question banks match your search');
      return;
    }

    const html = this.state.filteredBanks.map(bank => `
      <div class="qb-item" onclick="QuestionBankSelector.selectBank(${bank.id})">
        <div class="qb-item-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="qb-item-content">
          <div class="qb-item-title">
            ${this.escapeHtml(bank.display_name)}
          </div>
          <div class="qb-item-meta">
            <span class="qb-item-tag">
              <i class="fas fa-layer-group"></i>
              Grade ${bank.grade}
            </span>
            <span class="qb-item-tag">
              <i class="fas fa-book"></i>
              ${this.escapeHtml(bank.subject)}
            </span>
            ${bank.chapter ? `
              <span class="qb-item-tag">
                <i class="fas fa-bookmark"></i>
                ${this.escapeHtml(bank.chapter)}
              </span>
            ` : ''}
            ${bank.topic ? `
              <span class="qb-item-tag">
                <i class="fas fa-tag"></i>
                ${this.escapeHtml(bank.topic)}
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    this.elements.content.innerHTML = html;
  },

  // Render empty state
  renderEmpty(message) {
    this.elements.content.innerHTML = `
      <div class="qb-empty">
        <i class="fas fa-inbox"></i>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  },

  // Handle bank selection
  selectBank(bankId) {
    this.hide();
    
    if (this.config.onSelectCallback && typeof this.config.onSelectCallback === 'function') {
      this.config.onSelectCallback(bankId);
    } else {
      console.warn('No callback function provided for bank selection');
    }
  },

  // Utility: Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    QuestionBankSelector.init(handleBankSelection);
  });
} else {
  QuestionBankSelector.init(handleBankSelection);
}

// Example callback function - replace with your own implementation
function handleBankSelection(bankId) {
  console.log('Selected question bank ID:', bankId);
  // Your custom logic here
  // e.g., loadQuestions(bankId);
}