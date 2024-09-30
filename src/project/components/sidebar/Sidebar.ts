import html from "../../utils/define/html"
import { useTSElements } from "../../utils/hooks/useTSElements"

export default function Sidebar(DOM: HTMLElement) {

    const ui = useTSElements(DOM, html`
        <div class="wrapper wrapper-1">
        
            <a href="/">
                <img src="./src/images/logo-light.svg" alt="Notekeeper" class="logo-light">
                <img src="./src/images/logo-dark.svg" alt="Notekeeper" class="logo-dark">
            </a>
        
            <button class="menu-btn icon-btn large" aria-label="Close menu" data-sidebar-toggler>
                <span class="material-symbols-rounded" aria-hidden="true">close</span>
        
                <div class="state-layer"></div>
            </button>
        
        </div>
        
        <button class="fab" data-note-create-btn>
            <span class="material-symbols-rounded" aria-hidden="true">add</span>
        
            <span class="text text-label-large">New note</span>
        
            <div class="state-layer"></div>
        </button>
        
        <div class="wrapper wrapper-2">
        
            <h2 class="text-title-small">NOTEBOOKS</h2>
        
            <button class="icon-btn small" data-tooltip="Create new notebook" aria-label="Create new notebook"
                data-add-notebook>
                <span class="material-symbols-rounded" aria-hidden="true">add</span>
        
                <div class="state-layer"></div>
            </button>
        
        </div>
        
        <nav id='navbar' class='nav custom-scrollbar' data-sidebar-list></nav>
        `)



    return ui
}