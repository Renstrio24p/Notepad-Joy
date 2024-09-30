import { useTSElements } from "../../utils/hooks/useTSElements";

export default function Navbar(DOM: HTMLElement) {

    const ui = useTSElements(DOM, /*html*/`
        <div class="nav-item active">
            <span class="text text-label-large" data-notebook-field>
                My Notebook
            </span>

            <!-- Edit notebook button -->
            <button 
                class="icon-btn small" 
                aria-label="Edit notebook"
                data-tooltip="Edit notebook" data-edit-btn>
                <span class="material-symbols-rounded" aria-hidden="true">edit</span>
                <div class="state-layer"></div>
            </button>

            <!-- Delete notebook button -->

            <button 
                class="icon-btn small" 
                aria-label="Edit notebook"
                data-tooltip="Delete notebook" data-edit-btn>
                <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                <div class="state-layer"></div>
            </button>
        </div>
    `);

    return ui;

}