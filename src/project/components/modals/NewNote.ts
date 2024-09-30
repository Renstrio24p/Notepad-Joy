import html from "../../utils/define/html";
import { useTSSelector } from "../../utils/hooks/useTSSelector";

type NotebookData = {
    title: string;
    text: string;
};

const overlay = document.createElement('div');
overlay.classList.add('overlay', 'modal-overlay');

const modal = document.createElement('div');
export function NoteModal(title: string = 'Untitled', text: string = 'Add your note', time: string = '',) {
    modal.classList.add('modal');

    modal.innerHTML = html`
        <button class="icon-btn large" aria-label="Close modal" data-close-btn>
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
            <div class="state-layer"></div>
        </button>
        <input type="text" placeholder="Untitled" value="${title}" class="modal-title text-title-medium" data-note-field>
        <textarea placeholder="Take a note..." class="modal-text text-body-large custom-scrollbar"
            data-note-field>${text}</textarea>
        <div class="modal-footer">
            <span class="time text-label-large">${time}</span>
            <button class="btn text" data-submit-btn>
                <span class="text-label-large">Save</span>
                <div class="state-layer"></div>
            </button>
        </div>
    `;

    const [titleField, textField] = useTSSelector(modal, '[data-note-field]', true) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
    const submitBtn = useTSSelector(modal, '[data-submit-btn]', false) as HTMLButtonElement;

    const open = () => {
        document.body.appendChild(modal);
        document.body.appendChild(overlay);
        titleField.focus();
    };

    const close = () => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    };

    const closeBtn = useTSSelector(modal, '[data-close-btn]', false) as HTMLElement;
    submitBtn.disabled = true;

    const enableSubmit = () => {
        submitBtn.disabled = !titleField.value.trim() && !textField.value.trim();
    };

    textField.addEventListener('keyup', enableSubmit);
    titleField.addEventListener('keyup', enableSubmit);

    closeBtn.addEventListener('click', close);

    const onSubmit = (callback: (notebookData: NotebookData) => void) => {
        submitBtn.addEventListener('click', () => {
            const notebookData: NotebookData = {
                title: titleField.value.trim(),
                text: textField.value.trim(),
            };

            callback(notebookData);
            close(); // Optionally close the modal after submission
        });
    };

    const setValues = (data: NotebookData) => {
        titleField.value = data.title;
        textField.value = data.text;
        enableSubmit(); // Update the submit button state based on the new values
    };

    return { open, close, onSubmit, setValues };
}
