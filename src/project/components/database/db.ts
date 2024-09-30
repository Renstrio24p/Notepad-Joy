import { useTSStore } from "../../utils/hooks/useTSStore";
import { FindNotebook } from "../functions/utils/FindNotebook";
import { generateId } from "../functions/utils/generateId";

type NoteObj = {
    id?: string; // Optional for new notes before saving
    notebookId?: string; // Optional when creating a new note without assignment
    title: string;
    text: string;
    postedOn?: number; // Optional until assigned a timestamp
};

type Data = {
    id: string;
    name: string;
    notes: NoteObj[];
};

type Note = {
    notebooks: Data[];
};

let noteKeeperDB: Note = {
    notebooks: []
};

const { save, get } = useTSStore('noteKeeperDB');

const initDB = () => {
    const db = get() as string;
    if (db) {
        noteKeeperDB = JSON.parse(db);
    } else {
        noteKeeperDB.notebooks = [];
        save(JSON.stringify(noteKeeperDB));
    }
};

initDB();

// Read and write to the database
const readDB = () => {
    const dbData = get() as string;
    if (dbData) {
        noteKeeperDB = JSON.parse(dbData);
    }
};

const writeDB = () => {
    save(JSON.stringify(noteKeeperDB));
}

const db = {
    post: {
        notebook(name: string) {
            readDB();

            const notebookData: Data = {
                id: generateId(),
                name,
                notes: []
            };

            noteKeeperDB.notebooks.push(notebookData);
            writeDB();
            console.log('Notebook added:', name);

            return notebookData;
        },

        note(notebookId: string, note: NoteObj) {
            readDB();

            const notebook = FindNotebook(noteKeeperDB, notebookId);
            if (!notebook) {
                throw new Error(`Notebook with id ${notebookId} not found.`);
            }

            const noteData: NoteObj = {
                id: generateId(),
                notebookId,
                ...note,
                postedOn: new Date().getTime()
            };

            notebook.notes.unshift(noteData); // Add new note at the beginning
            writeDB();

            return noteData;
        }
    },

    get: {
        notebooks() {
            readDB();
            return noteKeeperDB.notebooks;
        },

        notes(activeNotebookId: string) {
            readDB();
            const notebook = FindNotebook(noteKeeperDB, activeNotebookId);
            return notebook?.notes;
        }
    },

    delete: {
        notebook(id: string, name: string) {
            readDB(); // Read the current database state

            // Find the index of the notebook with the given ID
            const notebookIndex = noteKeeperDB.notebooks.findIndex(notebook => notebook.id === id);

            if (notebookIndex > -1) { // If notebook is found
                noteKeeperDB.notebooks.splice(notebookIndex, 1); // Remove the notebook
                writeDB(); // Save the updated state to the database
                console.log(`Notebook deleted: ${name}`);
            } else {
                console.warn(`Notebook with id: ${id} not found`);
            }
        },

        note(notebookId: string, noteId: string) {
            readDB(); // Read the current database state

            // Find the notebook that contains the note
            const notebook = FindNotebook(noteKeeperDB, notebookId);
            if (!notebook) {
                throw new Error(`Notebook with id ${notebookId} not found.`);
            }

            // Find the index of the note to be deleted
            const noteIndex = notebook.notes.findIndex(note => note.id === noteId);
            if (noteIndex > -1) { // If note is found
                notebook.notes.splice(noteIndex, 1); // Remove the note
                writeDB(); // Save the updated state to the database
                console.log(`Note deleted: ${noteId}`);
            } else {
                console.warn(`Note with id: ${noteId} not found in notebook with id: ${notebookId}`);
            }
        }
    },

    update: {
        notebook(id: string, updatedNotebook: Partial<Data>) {
            readDB();

            // Find the notebook by its id
            const notebook = noteKeeperDB.notebooks.find(notebook => notebook.id === id);

            if (notebook) {
                // Update the notebook's properties with the provided updated values
                Object.assign(notebook, updatedNotebook);
                writeDB(); // Save the updated state to the database
                console.log(`Notebook updated: ${notebook.name}`);
            } else {
                console.warn(`Notebook with id: ${id} not found`);
            }
        },

        note(notebookId: string, noteId: string, updatedNote: Partial<NoteObj>) {
            readDB();

            const notebook = FindNotebook(noteKeeperDB, notebookId);
            if (!notebook) {
                throw new Error(`Notebook with id ${notebookId} not found.`);
            }

            const note = notebook.notes.find(note => note.id === noteId);
            if (note) {
                // Update the note's properties with the provided updated values
                Object.assign(note, updatedNote);
                writeDB(); // Save the updated state to the database
                console.log(`Note updated: ${note.title}`);
            } else {
                console.warn(`Note with id: ${noteId} not found in notebook with id: ${notebookId}`);
            }
        }
    }
};

export { db };
