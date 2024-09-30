import html from "../../utils/define/html";
import { useTSDebugger } from "../../utils/hooks/useTSDebugger";
import { useTSElementEach } from "../../utils/hooks/useTSForEach";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { client } from "../client/Client";
import { db } from "../database/db";
import { DeleteConfirmModal } from "../modals/DeleteConfirm";
import { NoteModal } from "../modals/NewNote";
import { disableNoteCreateBtns } from "./disableNote";
import { activeNotebook } from "./utils/getLastActiveItem";
import { makeElementEditable } from "./utils/makeElementEditable";

type Elements = {
    sidebarList?: HTMLElement,
    notePanelTitle?: HTMLElement,
    notePanel?: HTMLElement,
    navItem?: HTMLElement,
    doc?: HTMLElement & Document,
    noteCreateBtns?: NodeListOf<HTMLButtonElement>
};

type NoteObj = {
    id?: string, // Optional for new notes before saving
    notebookId?: string, // Optional when creating a new note without assignment
    title: string,
    text: string,
    postedOn?: number // Optional until assigned a timestamp
};

export function Notebook() {
    const sidebarList = useTSSelector(document, '[data-sidebar-list]', false) as HTMLElement;
    const addNotebookBtn = useTSSelector(document, '[data-add-notebook]', false) as HTMLElement;
    const notePanelTitle = useTSSelector(document, '[data-note-panel-title]', false) as HTMLElement;
    const notePanel = useTSSelector(document, '[data-note-panel]', false) as HTMLElement;
    const noteCreateBtns = useTSSelector(document, '[data-note-create-btn]', true) as NodeListOf<HTMLButtonElement>;

    useTSDebugger(sidebarList, addNotebookBtn, notePanelTitle, noteCreateBtns, notePanel);

    const showNotebookField = () => {
        if (!sidebarList) return;

        // Check if there's already a field being created
        if (sidebarList.querySelector('.nav-item.editing')) return;

        const navItem = document.createElement('div');
        navItem.classList.add('nav-item', 'editing');

        navItem.innerHTML = html`
            <span class="text text-label-large" data-notebook-field="New Notebook"></span>
            <div class="state-layer"></div>
        `;

        sidebarList.appendChild(navItem);

        const navItemField = navItem.querySelector('[data-notebook-field]') as HTMLElement;
        navItemField.focus();
        activeNotebook.call(navItem);
        makeElementEditable(navItemField);

        // When user presses enter, create a new notebook
        navItemField.addEventListener('keydown', function (e: KeyboardEvent) {
            if (e.key === 'Enter') {
                const title = this.textContent?.trim() || 'Untitled Notebook';

                // Check for duplicate notebook names
                const existingNotebook = db.get.notebooks().find(nb => nb.name.toLowerCase() === title.toLowerCase());
                if (existingNotebook) {
                    alert('Notebook with this name already exists.');
                    return;
                }

                const notebookData = db.post.notebook(title);
                navItemField.blur();
                this.parentElement?.remove();

                // Render the new notebook
                client.notebook.create(notebookData, { sidebarList, notePanelTitle, notePanel, noteCreateBtns });
                activeNotebook.call(navItem);
            }
        });

        navItemField.addEventListener('blur', () => {
            // Remove the field if no notebook is created
            navItem.remove();
        });
    };

    addNotebookBtn?.addEventListener('click', showNotebookField);

    const renderNotebooks = () => {
        const notebookList = db.get.notebooks();
        disableNoteCreateBtns(notebookList.length > 0, noteCreateBtns); // Update button state
        if (notebookList.length === 0) {
            console.log('No notebooks available.');
            return;
        }
        client.notebook.read(notebookList, { sidebarList, notePanelTitle, notePanel, noteCreateBtns });
    };

    // Setting up event listeners for note creation buttons
    useTSElementEach(noteCreateBtns, ['click'], () => {
        const modal = NoteModal();
        modal.open();

        modal.onSubmit(noteObj => {
            const activeNotebookIdElement = useTSSelector(sidebarList, '[data-notebook].active', false) as HTMLElement;
            if (!activeNotebookIdElement) {
                alert('No active notebook selected.');
                return;
            }

            const noteActive = activeNotebookIdElement.dataset.notebook as string;
            const noteData = db.post.note(noteActive, noteObj);

            client.note.create(noteData, { sidebarList, notePanelTitle, notePanel, noteCreateBtns });
            modal.close();
            renderExistingNotebooks(); // Refresh notes after creating a new one
        });
    });

    const renderExistingNotebooks = () => {
        const activeNotebookId = useTSSelector(document, '[data-notebook].active', false) as HTMLElement;
        if (!activeNotebookId) {
            console.log('No active notebook found.');
            return;
        }

        if (activeNotebookId) {
            const noteActive = activeNotebookId.dataset.notebook as string;
            const noteList = db.get.notes(noteActive);
            if (!noteList || noteList.length === 0) {
                console.log('No notes available for the active notebook.');
                return;
            }

            client.note.read(noteList as NoteObj[], { notePanel });
        }
    };

    const deleteNotebook = (notebookElement: HTMLElement, elements: Elements) => {
        const notebookId = notebookElement.dataset.notebook;

        if (!notebookId) {
            console.warn("No notebook ID found for deletion.");
            return;
        }

        // Confirm deletion action
        const modal = DeleteConfirmModal("Delete Notebook");
        modal.open();

        modal.onSubmit((isConfirm) => {
            if (!isConfirm) {
                modal.close();
                return;
            }

            // Delete notebook from database
            const notebookName = notebookElement.textContent || '';
            const notebookDeleted = db.delete.notebook(notebookId, notebookName) !== undefined;

            if (!notebookDeleted) {
                console.warn(`Failed to delete notebook with id ${notebookId}`);
                return;
            }

            // Remove the notebook element from the sidebar
            notebookElement.remove();

            client.notebook.delete({
                sidebarList: elements.sidebarList,
                notePanelTitle: elements.notePanelTitle,
                notePanel: elements.notePanel,
                noteCreateBtns: elements.noteCreateBtns,
                doc: elements.doc,
            });

            // Check if there are other notebooks available to switch to
            const nextNotebook = notebookElement.nextElementSibling ?? notebookElement.previousElementSibling;

            if (nextNotebook) {
                (nextNotebook as HTMLElement).click();
            } else {
                // No notebooks left, clear the panel
                elements.notePanelTitle!.textContent = '';
                elements.notePanel!.innerHTML = ''; // Use your empty state template
                disableNoteCreateBtns(false, elements.noteCreateBtns!);
            }

            modal.close();
        });
    };



    const updateNote = (note: NoteObj) => {
        const modal = NoteModal(note.title, note.text);
        modal.open();

        modal.onSubmit(updatedNote => {
            const noteCard = useTSSelector(document, `[data-note="${note.id}"]`, false) as HTMLElement;
            client.note.update(note.id as string, updatedNote, {
                sidebarList,
                notePanelTitle,
                notePanel,
                noteCreateBtns,
                doc: noteCard as HTMLElement & Document,
            });
            modal.close();
            renderExistingNotebooks(); // Refresh notes after updating
        });
    };

    const deleteNote = (noteId: string) => {
        if (confirm('Are you sure you want to delete this note?')) {
            client.note.delete(noteId, {
                sidebarList,
                notePanelTitle,
                notePanel,
                noteCreateBtns,
                doc: document as HTMLElement & Document,
            });
            renderExistingNotebooks(); // Refresh notes after deletion
        }
    };

    const noteElements = useTSSelector(notePanel, '.nav-item', true) as NodeListOf<HTMLElement>;

    useTSElementEach(noteElements, ['click'], (noteElement) => {
        const noteId = noteElement.dataset.noteId;
        noteElement.querySelector('.edit-note-btn')?.addEventListener('click', () => {
            const noteData: NoteObj = {
                id: noteId,
                title: noteElement.querySelector('.note-title')?.textContent || '',
                text: noteElement.querySelector('.note-text')?.textContent || '',
            };
            updateNote(noteData);
        });

        noteElement.querySelector('.delete-note-btn')?.addEventListener('click', () => {
            if (noteId) {
                deleteNote(noteId);
            }
        });
    });

    // Initial rendering
    renderNotebooks();
    renderExistingNotebooks();
    deleteNotebook(noteElements[0], { sidebarList, notePanelTitle, notePanel, noteCreateBtns, doc: document as HTMLElement & Document });
}
