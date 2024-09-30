import { useTSSelector } from "../../utils/hooks/useTSSelector"

export function getElements(document: Document) {
    const sidebar = useTSSelector(document, '[data-sidebar]', false) as HTMLElement
    const sidebarTogglers = useTSSelector(document, '[data-sidebar-toggler]', true) as NodeListOf<HTMLElement>
    const overlay = useTSSelector(document, '[data-sidebar-overlay]', false) as HTMLElement
    const sidebarList = useTSSelector(document, '[data-sidebar-list]', false) as HTMLElement
    return { sidebar, sidebarTogglers, overlay, sidebarList }
}