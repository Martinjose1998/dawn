class ChatAgent {
  constructor() {
    this.container = document.querySelector('[data-chat-agent]');
    this.messagesContainer = document.getElementById('chat-messages');
    this.chatForm = document.querySelector('[data-chat-form]');
    this.chatInput = document.querySelector('[data-chat-input]');
    this.toggleButton = document.querySelector('[data-chat-toggle]');
    this.minimizeButton = document.querySelector('.chat-agent-minimize');
    this.quickActionButtons = document.querySelectorAll('.quick-action-btn');
    this.unreadCount = 0;
    this.isMinimized = false;
    this.isTyping = false;

    // Predefined responses for common queries
    this.responses = {
      greeting: [
        "Hello! How can I help you today?",
        "Hi there! What can I assist you with?",
        "Welcome! I'm here to help you with any questions."
      ],
      orderStatus: [
        "To check your order status, please provide your order number and I'll look that up for you.",
        "You can track your order by logging into your account or using the order number from your confirmation email.",
        "I'd be happy to help you track your order. What's your order number?"
      ],
      shipping: [
        "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.",
        "Shipping times vary by location: 3-5 days for standard, 1-2 days for express.",
        "We ship Monday through Friday. Orders placed by 2 PM ship the same day."
      ],
      returns: [
        "We accept returns within 30 days of purchase. Items must be in original condition.",
        "To start a return, please visit our returns page or contact customer service.",
        "Return shipping is free for defective items. A small fee may apply for other returns."
      ],
      productHelp: [
        "I can help you find the perfect product! What are you looking for?",
        "Need help choosing a product? Tell me about your needs and I'll provide recommendations.",
        "Our products come with detailed descriptions and customer reviews to help you decide."
      ],
      payment: [
        "We accept all major credit cards, PayPal, Apple Pay, and Google Pay.",
        "Your payment information is secure and encrypted. We never store credit card details.",
        "If you're having payment issues, please try a different card or contact your bank."
      ],
      hours: [
        "Our customer service is available Monday-Friday 9 AM to 6 PM EST.",
        "You can reach us during business hours at our phone number or email.",
        "This chat is available 24/7 for basic questions. Complex issues are handled during business hours."
      ],
      contact: [
        "You can reach us at support@yourstore.com or call 1-800-555-0123.",
        "We're here to help! Email us at support@yourstore.com for detailed assistance.",
        "For urgent matters, please call our customer service line at 1-800-555-0123."
      ]
    };

    this.init();
  }

  init() {
    if (!this.container) return;

    this.bindEvents();
    this.setupInitialState();
  }

  bindEvents() {
    // Form submission
    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Quick action buttons
    this.quickActionButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleQuickAction(e));
    });

    // Toggle button (when minimized)
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.showChat());
    }

    // Minimize button
    if (this.minimizeButton) {
      this.minimizeButton.addEventListener('click', () => this.minimizeChat());
    }

    // Enter key support
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit(e);
        }
      });
    }
  }

  setupInitialState() {
    // Show toggle button on mobile
    if (window.innerWidth <= 749) {
      this.minimizeChat();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    this.chatInput.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate response delay
    setTimeout(() => {
      this.hideTypingIndicator();
      this.processMessage(message);
    }, 1000 + Math.random() * 1000);
  }

  handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    
    // Add user message for the action
    const actionText = e.currentTarget.textContent.trim();
    this.addUserMessage(`Tell me about: ${actionText}`);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.handleQuickActionResponse(action);
    }, 800);
  }

  addUserMessage(message) {
    const messageElement = this.createMessageElement(message, 'user');
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  addAgentMessage(message) {
    const messageElement = this.createMessageElement(message, 'agent');
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
    
    if (this.isMinimized) {
      this.showUnreadNotification();
    }
  }

  createMessageElement(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${this.escapeHtml(message)}</p>
      </div>
      <div class="message-time">${time}</div>
    `;
    
    return messageDiv;
  }

  processMessage(message) {
    const response = this.generateResponse(message);
    this.addAgentMessage(response);
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting patterns
    if (this.matchesPattern(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
      return this.getRandomResponse('greeting');
    }
    
    // Order status patterns
    if (this.matchesPattern(lowerMessage, ['order', 'tracking', 'track', 'status', 'shipped', 'delivery'])) {
      return this.getRandomResponse('orderStatus');
    }
    
    // Shipping patterns
    if (this.matchesPattern(lowerMessage, ['shipping', 'delivery', 'ship', 'how long', 'when will'])) {
      return this.getRandomResponse('shipping');
    }
    
    // Returns patterns
    if (this.matchesPattern(lowerMessage, ['return', 'refund', 'exchange', 'send back'])) {
      return this.getRandomResponse('returns');
    }
    
    // Product help patterns
    if (this.matchesPattern(lowerMessage, ['product', 'recommend', 'help choose', 'which', 'best'])) {
      return this.getRandomResponse('productHelp');
    }
    
    // Payment patterns
    if (this.matchesPattern(lowerMessage, ['payment', 'pay', 'credit card', 'paypal', 'checkout'])) {
      return this.getRandomResponse('payment');
    }
    
    // Hours patterns
    if (this.matchesPattern(lowerMessage, ['hours', 'open', 'closed', 'available', 'time'])) {
      return this.getRandomResponse('hours');
    }
    
    // Contact patterns
    if (this.matchesPattern(lowerMessage, ['contact', 'phone', 'email', 'call', 'reach'])) {
      return this.getRandomResponse('contact');
    }
    
    // Default response
    return this.getDefaultResponse();
  }

  matchesPattern(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getDefaultResponse() {
    const defaultResponses = [
      "I'd be happy to help! Could you please provide more details about your question?",
      "Let me help you with that. Can you tell me more about what you're looking for?",
      "I want to make sure I give you the best answer. Could you clarify your question?",
      "That's a great question! For more detailed assistance, you can also contact our support team.",
      "I'm here to help! If you need specific information, our customer service team can provide more details."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  handleQuickActionResponse(action) {
    switch (action) {
      case 'order-status':
        this.addAgentMessage(this.getRandomResponse('orderStatus'));
        break;
      case 'shipping':
        this.addAgentMessage(this.getRandomResponse('shipping'));
        break;
      case 'returns':
        this.addAgentMessage(this.getRandomResponse('returns'));
        break;
      case 'product-help':
        this.addAgentMessage(this.getRandomResponse('productHelp'));
        break;
      default:
        this.addAgentMessage(this.getDefaultResponse());
    }
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isTyping = false;
  }

  minimizeChat() {
    this.isMinimized = true;
    this.container.classList.add('minimized');
    if (this.toggleButton) {
      this.toggleButton.classList.add('visible');
    }
  }

  showChat() {
    this.isMinimized = false;
    this.container.classList.remove('minimized');
    if (this.toggleButton) {
      this.toggleButton.classList.remove('visible');
    }
    this.clearUnreadNotification();
    this.chatInput?.focus();
  }

  showUnreadNotification() {
    this.unreadCount++;
    const badge = document.querySelector('[data-unread-count]');
    if (badge) {
      badge.textContent = this.unreadCount;
      badge.style.display = 'block';
    }
  }

  clearUnreadNotification() {
    this.unreadCount = 0;
    const badge = document.querySelector('[data-unread-count]');
    if (badge) {
      badge.style.display = 'none';
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatAgent();
});

// Handle responsive behavior
window.addEventListener('resize', () => {
  const chatAgent = document.querySelector('[data-chat-agent]');
  const toggleButton = document.querySelector('[data-chat-toggle]');
  
  if (window.innerWidth <= 749) {
    if (chatAgent && !chatAgent.classList.contains('minimized')) {
      chatAgent.classList.add('minimized');
      if (toggleButton) {
        toggleButton.classList.add('visible');
      }
    }
  } else {
    if (chatAgent && chatAgent.classList.contains('minimized')) {
      chatAgent.classList.remove('minimized');
      if (toggleButton) {
        toggleButton.classList.remove('visible');
      }
    }
  }
});