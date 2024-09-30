import { useTSDebugger } from "../../utils/hooks/useTSDebugger";
import { useTSElementEach } from "../../utils/hooks/useTSForEach";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { GreetingMsg } from "./GreetingMsg";
import { Notebook } from "./Notebook";
import Theme from "./Themes";
import { tooltip } from "./Tooltip";
import { getCurrentDate } from "./utils/getCurrentDate";


export default function App(DOM: HTMLElement) {

    const sidebar = useTSSelector(DOM, '[data-sidebar]', false) as HTMLElement
    const sidebarTogglers = useTSSelector(DOM, '[data-sidebar-toggler]', true) as NodeListOf<HTMLElement>
    const overlay = useTSSelector(DOM, '[data-sidebar-overlay]', false) as HTMLElement

    // Sidebar toggler event per Element

    useTSElementEach(sidebarTogglers, ['click'], () => {
        sidebar?.classList.toggle('active')
        overlay?.classList.toggle('active')
    })

    // themes
    Theme()

    // Greeting message
    GreetingMsg()

    // get current date
    getCurrentDate()

    // tooltip4
    tooltip()

    Notebook()


    //debugger
    useTSDebugger(sidebar, sidebarTogglers)

}