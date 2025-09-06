import apiService from '../services/apiService.js';
import { MessageList } from '../components/MessageList.js';
import { TypingIndicator } from '../components/TypingIndicator.js';
import { ValidationUtils } from '../utils/validation.js';
import { ErrorHandler } from '../utils/errorHandler.js';

/**
 * Chat Page Controller
 */
export class ChatPage {
  constructor() {
    this.messageList = new MessageList('message-list');
    this.typingIndicator = new TypingIndicator('typing-indicator');
    this.interviewId = null;
    this.jobProfile = "Atendente de Suporte ao Cliente";
    
    this.initializeElements();
    this.bindEvents();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.startFormContainer = document.getElementById('start-interview-form-container');
    this.startForm = document.getElementById('start-interview-form');
    this.chatContainer = document.getElementById('chat-container');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');
    this.jobProfileDisplay = document.getElementById('job-profile-display');
    this.startBtn = document.getElementById('start-btn');
    this.startBtnText = document.getElementById('start-btn-text');
    this.startSpinner = document.getElementById('start-spinner');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Start interview form
    this.startForm.addEventListener('submit', (e) => this.handleStartInterview(e));
    
    // Message form
    this.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
    
    // Message input
    this.messageInput.addEventListener('input', () => this.handleInputChange());
    
    // Enter key handling
    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage(e);
      }
    });
  }

  /**
   * Handle start interview form submission
   */
  async handleStartInterview(e) {
    e.preventDefault();
    
    const formData = new FormData(this.startForm);
    const candidateData = {
      name: formData.get('name'),
      email: formData.get('email'),
      jobProfile: this.jobProfile
    };

    // Clear previous errors
    ErrorHandler.clearErrors(['name-error', 'email-error']);

    // Validate data
    const validation = ValidationUtils.validateInterviewStart(candidateData);
    if (!validation.isValid) {
      validation.errors.forEach((error, index) => {
        const field = error.includes('Nome') ? 'name-error' : 'email-error';
        ErrorHandler.showError(error, field);
      });
      return;
    }

    this.setLoadingState(true);

    try {
      const response = await apiService.startInterview(candidateData);
      
      if (response.success) {
        this.interviewId = response.data.interviewId;
        this.showChatInterface(response.data.initialMessage);
        ErrorHandler.showSuccess('Entrevista iniciada com sucesso!');
      } else {
        throw new Error(response.error || 'Erro ao iniciar entrevista');
      }
    } catch (error) {
      ErrorHandler.showError(error.message);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Handle send message form submission
   */
  async handleSendMessage(e) {
    e.preventDefault();
    
    const message = this.messageInput.value.trim();
    
    if (!message || !this.interviewId) return;

    // Validate message
    const validation = ValidationUtils.validateMessage({ message });
    if (!validation.isValid) {
      ErrorHandler.showError(validation.errors[0]);
      return;
    }

    // Add user message to UI
    this.messageList.addMessage(message, 'user');
    this.messageInput.value = '';
    this.sendButton.disabled = true;
    this.typingIndicator.show();
    this.messageList.scrollToBottom();

    try {
      const response = await apiService.sendMessage(this.interviewId, message);
      
      if (response.success) {
        this.messageList.addMessage(response.data.reply, 'assistant');
      } else {
        throw new Error(response.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      ErrorHandler.showError(error.message);
      // Remove the user message if sending failed
      this.messageList.messages.pop();
      this.messageList.render();
    } finally {
      this.sendButton.disabled = false;
      this.typingIndicator.hide();
      this.messageList.scrollToBottom();
    }
  }

  /**
   * Handle input change
   */
  handleInputChange() {
    const hasText = this.messageInput.value.trim().length > 0;
    this.sendButton.disabled = !hasText;
  }

  /**
   * Show chat interface
   */
  showChatInterface(initialMessage) {
    this.startFormContainer.classList.add('hidden');
    this.chatContainer.classList.remove('hidden');
    this.chatContainer.classList.add('flex');
    this.jobProfileDisplay.textContent = `Vaga: ${this.jobProfile}`;
    this.jobProfileDisplay.classList.remove('hidden');
    
    // Add initial message
    this.messageList.addMessage(initialMessage, 'assistant');
  }

  /**
   * Set loading state
   */
  setLoadingState(loading) {
    this.startBtn.disabled = loading;
    this.startBtnText.classList.toggle('hidden', loading);
    this.startSpinner.classList.toggle('hidden', !loading);
  }

  /**
   * Initialize the page
   */
  init() {
    console.log('Chat page initialized');
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatPage().init();
});
