/**
 * TypingIndicator Component
 */
export class TypingIndicator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isVisible = false;
  }

  /**
   * Show typing indicator
   */
  show() {
    if (!this.container) return;
    
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this.render();
  }

  /**
   * Hide typing indicator
   */
  hide() {
    if (!this.container) return;
    
    this.isVisible = false;
    this.container.classList.add('hidden');
  }

  /**
   * Toggle typing indicator
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Render the typing indicator
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="bg-slate-200 dark:bg-slate-700 p-3 rounded-full flex items-center justify-center self-start">
          <i data-lucide="bot" class="w-5 h-5 text-slate-600 dark:text-slate-300"></i>
        </div>
        <div class="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-2xl px-4 py-2">
          <span class="typing-dot"></span>
          <span class="typing-dot" style="animation-delay: 0.2s;"></span>
          <span class="typing-dot" style="animation-delay: 0.4s;"></span>
        </div>
      </div>
    `;

    // Recreate icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * Check if indicator is visible
   */
  get visible() {
    return this.isVisible;
  }
}
