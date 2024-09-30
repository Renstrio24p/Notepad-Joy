import html from '../../utils/define/html';
import { useTSSelector } from '../../utils/hooks/useTSSelector';
import { client } from '../client/Client';
import { db } from '../database/db';
import { NewTooltip } from '../functions/NewTooltip';
import { activeNotebook } from '../functions/utils/getLastActiveItem';
import { makeElementEditable } from '../functions/utils/makeElementEditable';
import { DeleteConfirmModal } from '../modals/DeleteConfirm';

type Elements = {
    sidebarList?: HTMLElement,
    notePanelTitle?: HTMLElement,
    notePanel?: HTMLElement,
    navItem?: HTMLElement
    doc?: Document & HTMLElement
    noteCreateBtns?: NodeListOf<HTMLButtonElement>
}

type NoteObj = {
    id?: string, // Optional for new notes before saving
    notebookId?: string, // Optional when creating a new note without assignment
    title: string,
    text: string,
    postedOn?: number // Optional until assigned a timestamp
}

type Data = {
    id: string,
    name: string,
    notes: NoteObj[]
}

export function NavItem(id: string, name: string, elements: Elements) {
    const navItem = document.createElement('div');
    navItem.classList.add('nav-item', 'my-2');
    navItem.setAttribute('data-notebook', id);

    navItem.innerHTML = html`
    <span class="text text-label-large" data-notebook-field="">${name}</span>
    <button class="icon-btn small" data-tooltip="Edit notebook" aria-label="Edit notebook" data-edit-btn="">
        <span class="material-symbols-rounded" aria-hidden="true">edit</span>
    </button>
    <button class="icon-btn small" data-tooltip="Delete notebook" aria-label="Delete notebook" data-delete-btn="">
        <span class="material-symbols-rounded" aria-hidden="true">delete</span>
    </button>
    <div class="state-layer"></div>
    `;

    // Show tooltip on hover
    const tooltipEls = useTSSelector(navItem, '[data-tooltip]', true) as NodeListOf<HTMLElement>;
    tooltipEls.forEach((tooltipEl) => NewTooltip(tooltipEl));

    // Handle Notebook Click
    navItem.addEventListener('click', function (this: HTMLElement) {
        if (elements.notePanelTitle) elements.notePanelTitle.textContent = name;
        activeNotebook.call(this);
        const noteList = db.get.notes(this.dataset.notebook!);
        client.note.read(noteList as NoteObj[], elements);
    });

    // Edit Notebook
    const editBtn = useTSSelector(navItem, '[data-edit-btn]', false) as HTMLElement;
    const notebookField = useTSSelector(navItem, '[data-notebook-field]', false) as HTMLElement;

    editBtn.addEventListener('click', makeElementEditable.bind(null, notebookField));
    notebookField.addEventListener('keydown', function (this: HTMLElement, e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.blur();
            this.removeAttribute('contenteditable');

            // Update edited notebook data
            const updateNoteData = db.update.notebook(id, { name: this.textContent! } as Partial<Data>) as unknown as Data;

            // Update the notebook name in the sidebar
            if (elements.sidebarList) {
                client.notebook.update(id, updateNoteData, { sidebarList: navItem.parentElement!, notePanelTitle: elements.notePanelTitle });
            }
        }
    });

    // Delete Notebook
    const deleteBtn = useTSSelector(navItem, '[data-delete-btn]', false) as HTMLElement;

    deleteBtn.addEventListener('click', function () {
        const modal = DeleteConfirmModal(name);
        modal.open();

        modal.onSubmit((isConfirm) => {
            if (isConfirm) {
                db.delete.notebook(id, name);
                navItem.remove();
                modal.close();
                client.notebook.delete({
                    doc: elements.doc,
                    navItem: navItem,
                    sidebarList: elements.sidebarList,
                    notePanelTitle: elements.notePanelTitle,
                    noteCreateBtns: elements.noteCreateBtns,
                    notePanel: elements.notePanel
                });
            } else {
                modal.close();
            }
        });
    });

    return navItem;
}
