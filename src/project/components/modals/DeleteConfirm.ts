import html from "../../utils/define/html";
import { useTSElementEach } from "../../utils/hooks/useTSForEach";
import { useTSSelector } from "../../utils/hooks/useTSSelector";

const overlay = document.createElement('div');
overlay.classList.add('overlay', 'modal-overlay');

export function DeleteConfirmModal(title: string) {


    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = html`
        <h3 class="modal-title text-title-medium">
            Are you sure you want to delete <strong>"${title}"</strong>?
        </h3>
        <div class="modal-footer">
            <button id="close" class="btn text" data-action-btn="false">
                <span class="text-label-large">Cancel</span>
                <span class="state-layer"></span>
            </button>
            <button id='delete' class="btn fill" data-action-btn="true">
                <span class="text-label-large">Delete</span>
                <span class="state-layer"></span>
            </button>
        </div>
    `;

    const actionbtns = useTSSelector(modal, 'button', true) as NodeListOf<HTMLButtonElement>;
    function closeModal() {
        modal.remove();
        overlay.remove();
    }


    const open = () => {
        document.body.appendChild(modal);
        document.body.appendChild(overlay);
    }

    const close = () => {
        return closeModal();
    }

    const onSubmit = (callback: (isConfirm: boolean, doc: Document) => void) => {
        useTSElementEach(actionbtns, ['click'], (e) => {
            const isConfirm = e.dataset.actionBtn === 'true' ? true : false;
            callback(isConfirm, document);
        })
    }

    document.body.appendChild(modal);

    return { open, close, onSubmit };

}