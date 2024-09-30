
// Function to toggle the active state
let lastActiveItem: HTMLElement | null = null;

export const activeNotebook = function (this: HTMLElement) {
    lastActiveItem?.classList.remove('active');
    this.classList.add('active');
    lastActiveItem = this;
};