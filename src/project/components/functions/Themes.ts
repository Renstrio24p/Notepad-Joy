import { useTSEventAll } from "../../utils/hooks/useTSAllElements";
import { useTSStore } from "../../utils/hooks/useTSStore";

export default function Theme() {

    const { get, save } = useTSStore('theme')

    const storeTheme = get()

    const isStoredThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = storeTheme || isStoredThemeDark ? 'dark' : 'light'

    console.log('Initial Theme:', initialTheme)

    document.documentElement.setAttribute('data-theme', initialTheme)

    /* toggle themes */

    window.addEventListener('DOMContentLoaded', () => {

        useTSEventAll('[data-theme-btn]', 'click', () => {

            const currentTheme = document.documentElement.getAttribute('data-theme')

            const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

            document.documentElement.setAttribute('data-theme', newTheme)

            save(newTheme)

        })

    })
}