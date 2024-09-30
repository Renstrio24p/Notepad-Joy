import { NavItem } from "../elements/NavItem";
import { useTSDebugger } from "../../utils/hooks/useTSDebugger";
import { activeNotebook } from "../functions/utils/getLastActiveItem";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { Card } from "../elements/Cards";
import html from "../../utils/define/html";
import { disableNoteCreateBtns } from "../functions/disableNote";

type Elements = {
    sidebarList?: HTMLElement,
    notePanelTitle?: HTMLElement,
    notePanel?: HTMLElement,
    navItem?: HTMLElement,
    noteCreateBtns?: NodeListOf<HTMLButtonElement>
    doc?: Document & HTMLElement
};

type NoteObj = {
    id?: string, // Optional for new notes before saving
    notebookId?: string, // Optional when creating a new note without assignment
    title: string,
    text: string,
    postedOn?: number // Optional until assigned a timestamp
};

type Data = {
    id: string,
    name: string,
    notes: NoteObj[]
};

const emptyNoteTemplate = html`
    <div class="empty-notes">
        <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
        <div class="text-headline-small">No notes</div>
    </div>
`;

export const client = {
    notebook: {
        create(notebookData: { id: string, name: string }, elements: Elements) {
            if (elements.sidebarList) {
                const navItem = NavItem(notebookData.id, notebookData.name, elements);
                elements.sidebarList.appendChild(navItem);
                elements.notePanelTitle!.textContent = notebookData.name;
                elements.notePanel!.innerHTML = emptyNoteTemplate;
                disableNoteCreateBtns(true, elements.noteCreateBtns!);
                useTSDebugger(elements.sidebarList);
            } else {
                console.warn('Sidebar list element not found!');
            }
        },

        read(notebookList: { id: string, name: string }[], elements: Elements) {
            disableNoteCreateBtns(notebookList.length > 0, elements.noteCreateBtns!);
            notebookList.forEach((notebook, i) => {
                const navItem = NavItem(notebook.id, notebook.name, elements);
                if (i === 0) {
                    activeNotebook.call(navItem);
                    elements.notePanelTitle!.textContent = notebook.name;
                }
                elements.sidebarList?.appendChild(navItem);
            });
        },

        update(notebookId: string, notebookData: Data, elements: Elements) {
            const oldNotebook = useTSSelector(document, `[data-notebook="${notebookId}"]`, false) as HTMLElement;
            const newNotebook = NavItem(notebookData.id, notebookData.name, elements);
            elements.notePanelTitle!.textContent = notebookData.name;
            elements.sidebarList?.replaceChild(newNotebook, oldNotebook);
            activeNotebook.call(newNotebook);
        },

        delete(elements: Elements) {
            const notebook = elements.navItem!;
            useTSDebugger(notebook);
            const nextNotebook = notebook.nextElementSibling ?? notebook.previousElementSibling;
            if (nextNotebook) {
                (nextNotebook as HTMLElement).click();
            } else {
                elements.notePanelTitle!.textContent = '';
                elements.notePanel!.innerHTML = '';
                disableNoteCreateBtns(false, elements.noteCreateBtns!);
            }
            notebook.remove();
        }
    },

    note: {
        create(noteData: NoteObj, elements: Elements) {
            const card = Card(noteData, elements);
            useTSDebugger(elements.notePanel);
            elements.notePanel?.appendChild(card);
        },

        read(noteList: NoteObj[], elements: Elements) {
            if (!noteList || noteList.length === 0) {
                elements.notePanel!.innerHTML = emptyNoteTemplate;
            } else {
                elements.notePanel!.innerHTML = ''; // Clear existing content
                noteList.forEach(note => {
                    const card = Card(note, elements);
                    elements.notePanel?.appendChild(card);
                });
            }
        },

        delete(noteId: string, elements: Elements) {
            const note = useTSSelector(elements.doc!, `[data-note="${noteId}"]`, false) as HTMLElement;
            note.remove();
        },

        update(noteId: string, updatedNoteData: Partial<NoteObj>, elements: Elements) {
            console.log(elements)
            const noteCard = elements.doc! as HTMLElement

            if (noteCard) {
                // Update the card with the new data, keeping the id consistent
                const newCard = Card({
                    id: noteId, // Ensure the id is preserved
                    notebookId: updatedNoteData.notebookId, // Preserve the notebookId if available
                    title: updatedNoteData.title ?? 'Untitled', // Fallback to 'Untitled' if title is missing
                    text: updatedNoteData.text ?? '', // Fallback to empty string if text is missing
                    postedOn: updatedNoteData.postedOn // Preserve the timestamp
                }, elements);

                // Replace the old card with the updated one
                noteCard.replaceWith(newCard);
                console.log(`Note with id ${noteId} updated.`);
                console.log(noteCard)
            } else {
                console.warn(`Note with id ${noteId} not found.`);
            }
        }

    }

};