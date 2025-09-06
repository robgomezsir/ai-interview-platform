/**
 * MessageList Component
 */
export class MessageList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.messages = [];
  }

  /**
   * Add a message to the list
   */
  addMessage(content, role, timestamp = null) {
    const message = {
      id: Date.now() + Math.random(),
      content,
      role,
      timestamp: timestamp || new Date()
    };

    this.messages.push(message);
    this.render();
    this.scrollToBottom();
  }

  /**
   * Update messages from chat history
   */
  updateMessages(chatHistory) {
    this.messages = chatHistory.map((msg, index) => ({
      id: index,
      content: msg.content,
      role: msg.role,
      timestamp: new Date()
    }));
    this.render();
    this.scrollToBottom();
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    this.render();
  }

  /**
   * Render the message list
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = this.messages.map(message => this.renderMessage(message)).join('');
    
    // Recreate icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * Render a single message
   */
  renderMessage(message) {
    const isUser = message.role === 'user';
    const time = message.timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return `
      <div class="flex items-start gap-3 my-2 ${isUser ? 'justify-end' : 'justify-start'}">
        ${isUser ? this.renderUserMessage(message, time) : this.renderAssistantMessage(message, time)}
      </div>
    `;
  }

  /**
   * Render user message
   */
  renderUserMessage(message, time) {
    return `
      <div class="max-w-md md:max-w-lg p-3 rounded-2xl break-words bg-blue-600 text-white">
        ${this.escapeHtml(message.content)}
      </div>
      <div class="flex-shrink-0 bg-slate-200 dark:bg-slate-700 p-3 rounded-full flex items-center justify-center self-start">
        <i data-lucide="user" class="w-5 h-5 text-slate-600 dark:text-slate-300"></i>
      </div>
    `;
  }

  /**
   * Render assistant message
   */
  renderAssistantMessage(message, time) {
    return `
      <div class="flex-shrink-0 bg-slate-200 dark:bg-slate-700 p-3 rounded-full flex items-center justify-center self-start">
        <i data-lucide="bot" class="w-5 h-5 text-slate-600 dark:text-slate-300"></i>
      </div>
      <div class="max-w-md md:max-w-lg p-3 rounded-2xl break-words bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
        ${this.escapeHtml(message.content)}
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Scroll to bottom of message list
   */
  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  /**
   * Get message count
   */
  getMessageCount() {
    return this.messages.length;
  }

  /**
   * Get last message
   */
  getLastMessage() {
    return this.messages[this.messages.length - 1];
  }
}
