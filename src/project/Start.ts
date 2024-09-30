
import App from './components/functions/App';
import { getElements } from './components/functions/getElements';
import { Router } from './components/routes/Router';
import Sidebar from './components/sidebar/Sidebar';
import html from './utils/define/html';
import { useTSComponent } from './utils/hooks/useTSComponent';
import { useTSElements } from './utils/hooks/useTSElements'
import { useTSMetaData } from './utils/hooks/useTSMetaData'

export default function Start(DOM: HTMLElement) {
    useTSMetaData({
        name: 'Start',
        description: '',
        author: ''
    });

    const title = 'Note Keeper'

    const ui = useTSElements(
        DOM,
        html`
            <header id='sidebar' class='sidebar' data-sidebar></header>
            <div class="overlay" data-sidebar-overlay data-sidebar-toggler></div>
            <main id='router' class='main'></main>
        `
    );
    const element = getElements(document)

    element

    useTSComponent('sidebar', DOM, Sidebar)
    useTSComponent('router', DOM, Router, title)

    // Functions

    App(DOM)



    return ui

}