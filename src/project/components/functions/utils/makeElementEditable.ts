
export const makeElementEditable = (element: HTMLElement): void => {

    element.setAttribute('contenteditable', 'true');
    element.focus();
    element.style.outline = 'none';


}