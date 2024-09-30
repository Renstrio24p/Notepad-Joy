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
    notes: NoteObj[] // Changed from `Data[]` to `NoteObj[]`
}

type Note = {
    notebooks: Data[]
}

export function FindNotebook(db: Note, id: string): Data | undefined {
    return db.notebooks.find(notebook => notebook.id === id);
}
