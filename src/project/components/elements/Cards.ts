import html from "../../utils/define/html";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { client } from "../client/Client";
import { db } from "../database/db";
import { NewTooltip } from "../functions/NewTooltip";
import { getRelativeTime } from "../functions/utils/getRelativeTime";
import { NoteModal } from "../modals/NewNote";

type NoteObj = {
    id?: string; // Optional for new notes before saving
    notebookId?: string; // Optional when creating a new note without assignment
    title: string;
    text: string;
    postedOn?: number; // Optional until assigned a timestamp
};

type Elements = {
    sidebarList?: HTMLElement,
    notePanelTitle?: HTMLElement,
    notePanel?: HTMLElement,
    navItem?: HTMLElement,
    noteCreateBtns?: NodeListOf<HTMLButtonElement>
    doc?: Document & HTMLElement
};

export function Card(noteData: NoteObj, elements: Elements) {
    const { id, title, text, postedOn, notebookId } = noteData;

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-note", id as string);

    card.innerHTML = html`
        <h3 class="card-title text-title-medium">${title}</h3>
        <p class="card-text text-body-large">${text}</p>
        <div class="wrapper">
            <span class="card-time text-label-large">${getRelativeTime(postedOn as number)}</span>
        
            <button class="icon-btn large" aria-label="Edit note" data-tooltip="Edit note" data-edit-btn>
                <span class="material-symbols-rounded" aria-hidden="true">edit</span>
                <div class="state-layer"></div>
            </button>
        
            <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
                <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                <div class="state-layer"></div>
            </button>
        </div>
        <div class="state-layer"></div>
    `;

    const tooltip = useTSSelector(card, '[data-tooltip]', false) as HTMLElement;
    NewTooltip(tooltip);

    // Add event listener for editing the note
    const editBtn = useTSSelector(card, '[data-edit-btn]', false) as HTMLElement;
    editBtn.addEventListener('click', () => {
        const modal = NoteModal(); // Assuming you have a modal component for editing
        modal.open();

        // Populate the modal with the existing note data
        modal.setValues({ title, text });

        modal.onSubmit(updatedNoteObj => {
            // Update the note in the database
            db.update.note(notebookId as string, id as string, updatedNoteObj);

            // Update the note in the UI
            client.note.update(id as string, updatedNoteObj, { notePanel: elements.notePanel, doc: elements.doc });

            // Now, update the card in the UI
            const cardTitle = card.querySelector('.card-title') as HTMLElement;
            const cardText = card.querySelector('.card-text') as HTMLElement;
            cardTitle.textContent = updatedNoteObj.title;
            cardText.textContent = updatedNoteObj.text;

            modal.close();
        });
    });

    // Add event listener for deleting the note
    const deleteBtn = useTSSelector(card, '[data-delete-btn]', false) as HTMLElement;
    deleteBtn.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this note?');
        if (confirmDelete) {
            // Remove the note from the database
            db.delete.note(notebookId as string, id as string);

            // Remove the note from the UI
            card.remove();

            // Optionally, update the note panel if needed
            client.note.delete(id as string, { notePanel: elements.notePanel, doc: elements.doc });
        }
    });

    return card;
}
