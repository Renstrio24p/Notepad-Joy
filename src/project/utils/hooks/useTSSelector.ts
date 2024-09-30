type AnyElement =
    | HTMLElement
    | HTMLAnchorElement
    | HTMLImageElement
    | HTMLButtonElement
    | HTMLDivElement
    | HTMLSelectElement
    | HTMLInputElement
    | NodeListOf<HTMLElement>
    | NodeListOf<HTMLAnchorElement>
    | NodeListOf<HTMLImageElement>
    | NodeListOf<HTMLButtonElement>
    | NodeListOf<HTMLDivElement>
    | NodeListOf<HTMLSelectElement>
    | NodeListOf<HTMLInputElement>
    | null;

export const useTSSelector = (DOM: HTMLElement | Document, selector: string, all: boolean): AnyElement => {
    if (all) {
        // Handle specific tag types for multiple elements
        switch (selector) {
            case 'a':
                return DOM.querySelectorAll<HTMLAnchorElement>(selector);
            case 'img':
                return DOM.querySelectorAll<HTMLImageElement>(selector);
            case 'button':
                return DOM.querySelectorAll<HTMLButtonElement>(selector);
            case 'div':
                return DOM.querySelectorAll<HTMLDivElement>(selector);
            case 'select':
                return DOM.querySelectorAll<HTMLSelectElement>(selector);
            case 'input':
                return DOM.querySelectorAll<HTMLInputElement>(selector);
            default:
                return DOM.querySelectorAll<HTMLElement>(selector);
        }
    } else {
        // Handle specific tag types for single elements
        switch (selector) {
            case 'a':
                return DOM.querySelector<HTMLAnchorElement>(selector);
            case 'img':
                return DOM.querySelector<HTMLImageElement>(selector);
            case 'button':
                return DOM.querySelector<HTMLButtonElement>(selector);
            case 'div':
                return DOM.querySelector<HTMLDivElement>(selector);
            case 'select':
                return DOM.querySelector<HTMLSelectElement>(selector);
            case 'input':
                return DOM.querySelector<HTMLInputElement>(selector);
            default:
                return DOM.querySelector<HTMLElement>(selector);
        }
    }
};
