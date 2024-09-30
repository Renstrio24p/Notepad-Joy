export const disableNoteCreateBtns = (isThereAnyNotebooks: boolean, noteCreateBtns: NodeListOf<HTMLButtonElement>) => {
    noteCreateBtns.forEach(btn => {
        if (isThereAnyNotebooks) {
            btn.removeAttribute('disabled'); // Enable button
        } else {
            btn.setAttribute('disabled', 'true'); // Disable button
        }
    });
};
