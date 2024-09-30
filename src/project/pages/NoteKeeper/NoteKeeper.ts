import html from "../../utils/define/html";
import './Note.css'
import { useTSElements } from "../../utils/hooks/useTSElements";

export default function NoteKeeper(DOM: HTMLElement, title: string) {

    document.title = `${title} | Home`

    const ui = useTSElements(DOM, html`
            <div class="header">
            
                <div class="wrapper">
                    <p class="title text-title-large" data-greeting></p>
            
                    <span class="text text-body-medium" data-current-date>Sat, Sep 22 2023</span>
                </div>
            
                <button class="theme-btn icon-btn large" aria-label="Toggle theme" data-tooltip="Toggle theme" data-theme-btn>
                    <span class="material-symbols-rounded dark-icon" aria-hidden="true">dark_mode</span>
                    <span class="material-symbols-rounded light-icon" aria-hidden="true">light_mode</span>
            
                    <div class="state-layer"></div>
                </button>
            
                <button class="menu-btn icon-btn large" aria-label="Open menu" data-sidebar-toggler>
                    <span class="material-symbols-rounded" aria-hidden="true">menu</span>
            
                    <div class="state-layer"></div>
                </button>
            
            </div>
            
            <h2 class="title text-title-medium" data-note-panel-title></h2>
            
            
            <div class="note-list" data-note-panel=""></div>
            
            
            <button class="fab" aria-label="New note" data-note-create-btn>
                <span class="material-symbols-rounded" aria-hidden="true">add</span>
            
                <div class="state-layer"></div>
            </button>
        `)


    return ui
}