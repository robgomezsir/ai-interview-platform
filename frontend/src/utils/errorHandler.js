/**
 * Error handling utilities
 */
export class ErrorHandler {
  /**
   * Handle API errors
   */
  static handleApiError(error) {
    console.error('API Error:', error);

    if (error.message.includes('Failed to fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    if (error.message.includes('timeout')) {
      return 'Tempo limite excedido. Tente novamente.';
    }

    if (error.message.includes('429')) {
      return 'Muitas requisições. Aguarde um momento e tente novamente.';
    }

    if (error.message.includes('404')) {
      return 'Recurso não encontrado.';
    }

    if (error.message.includes('500')) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }

    return error.message || 'Erro desconhecido. Tente novamente.';
  }

  /**
   * Show error message to user
   */
  static showError(message, elementId = null) {
    const errorMessage = this.handleApiError(message);
    
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = errorMessage;
        element.classList.remove('hidden');
      }
    } else {
      // Show in a toast or alert
      this.showToast(errorMessage, 'error');
    }
  }

  /**
   * Show success message
   */
  static showSuccess(message) {
    this.showToast(message, 'success');
  }

  /**
   * Show toast notification
   */
  static showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'success' ? 'bg-green-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="${type === 'error' ? 'alert-circle' : type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-75">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  /**
   * Clear error messages
   */
  static clearErrors(elementIds = []) {
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.add('hidden');
        element.textContent = '';
      }
    });
  }
}
