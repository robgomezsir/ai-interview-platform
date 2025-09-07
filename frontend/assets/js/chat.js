// Chat functionality
class ChatManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.interviewId = null;
        this.jobProfile = "Atendente de Suporte ao Cliente";
        this.init();
    }

    async init() {
        this.initializeElements();
        this.bindEvents();
        console.log('Chat manager initialized');
    }

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
        this.messageList = document.getElementById('message-list');
    }

    bindEvents() {
        // Start interview form
        if (this.startForm) {
            this.startForm.addEventListener('submit', (e) => this.handleStartInterview(e));
        }
        
        // Message form
        if (this.messageForm) {
            this.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }
        
        // Message input
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => this.handleInputChange());
            
            // Enter key handling
            this.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage(e);
                }
            });
        }
    }

    async handleStartInterview(e) {
        e.preventDefault();
        
        const formData = new FormData(this.startForm);
        const candidateData = {
            name: formData.get('name'),
            email: formData.get('email'),
            jobProfile: this.jobProfile
        };

        // Clear previous errors
        this.clearErrors(['name-error', 'email-error']);

        // Validate data
        const validation = this.validateInterviewStart(candidateData);
        if (!validation.isValid) {
            validation.errors.forEach((error, index) => {
                const field = error.includes('Nome') ? 'name-error' : 'email-error';
                this.showError(error, field);
            });
            return;
        }

        this.setLoadingState(true);

        try {
            const response = await this.startInterview(candidateData);
            
            if (response.success) {
                this.interviewId = response.data.interviewId;
                this.showChatInterface(response.data.initialMessage);
                this.showSuccess('Entrevista iniciada com sucesso!');
            } else {
                throw new Error(response.error || 'Erro ao iniciar entrevista');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleSendMessage(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        
        if (!message || !this.interviewId) return;

        // Validate message
        const validation = this.validateMessage({ message });
        if (!validation.isValid) {
            this.showError(validation.errors[0]);
            return;
        }

        // Add user message to UI
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        this.showTypingIndicator();
        this.scrollToBottom();

        try {
            const response = await this.sendMessage(this.interviewId, message);
            
            if (response.success) {
                this.addMessage(response.data.reply, 'assistant');
            } else {
                throw new Error(response.error || 'Erro ao enviar mensagem');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.sendButton.disabled = false;
            this.hideTypingIndicator();
            this.scrollToBottom();
        }
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }

    showChatInterface(initialMessage) {
        this.startFormContainer.classList.add('hidden');
        this.chatContainer.classList.remove('hidden');
        this.chatContainer.classList.add('flex');
        this.jobProfileDisplay.textContent = `Vaga: ${this.jobProfile}`;
        this.jobProfileDisplay.classList.remove('hidden');
        
        // Add initial message
        this.addMessage(initialMessage, 'assistant');
    }

    setLoadingState(loading) {
        this.startBtn.disabled = loading;
        this.startBtnText.classList.toggle('hidden', loading);
        this.startSpinner.classList.toggle('hidden', !loading);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
        }`;
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.messageList.appendChild(messageDiv);
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'mb-4 flex justify-start';
        typingDiv.innerHTML = `
            <div class="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        this.messageList.appendChild(typingDiv);
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    async startInterview(candidateData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/interviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao iniciar entrevista:', error);
            // Return mock data for demonstration
            return {
                success: true,
                data: {
                    interviewId: 'mock-interview-' + Date.now(),
                    initialMessage: `Olá ${candidateData.name}! Bem-vindo à sua entrevista para ${candidateData.jobProfile}. Vamos começar com algumas perguntas sobre sua experiência. Pode me contar um pouco sobre você?`
                }
            };
        }
    }

    async sendMessage(interviewId, message) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/interviews/${interviewId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            // Return mock response for demonstration
            return {
                success: true,
                data: {
                    reply: this.generateMockResponse(message)
                }
            };
        }
    }

    generateMockResponse(userMessage) {
        const responses = [
            "Interessante! Pode me contar mais sobre isso?",
            "Entendo. Como você lidaria com uma situação difícil no trabalho?",
            "Ótimo! Quais são seus pontos fortes?",
            "Muito bem! E quais são suas áreas de melhoria?",
            "Perfeito! Por que você quer trabalhar conosco?",
            "Excelente resposta! Tem alguma pergunta para mim?",
            "Muito obrigado pela sua resposta. Vamos continuar com a próxima pergunta.",
            "Entendi. Como você se vê daqui a 5 anos?",
            "Interessante perspectiva. Obrigado por compartilhar isso comigo.",
            "Perfeito! Essa foi uma excelente entrevista. Obrigado pela sua participação!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    validateInterviewStart(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Email deve ser válido');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateMessage(data) {
        const errors = [];
        
        if (!data.message || data.message.trim().length < 1) {
            errors.push('Mensagem não pode estar vazia');
        }
        
        if (data.message && data.message.length > 1000) {
            errors.push('Mensagem deve ter no máximo 1000 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message, elementId = null) {
        if (elementId) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
            }
        } else {
            // Show general error
            console.error(message);
            alert(message);
        }
    }

    showSuccess(message) {
        console.log(message);
        // You can implement a toast notification here
    }

    clearErrors(elementIds) {
        elementIds.forEach(id => {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.add('hidden');
            }
        });
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
});
