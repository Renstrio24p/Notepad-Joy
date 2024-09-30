import NotFound from "../../pages/404/NotFound";
import NoteKeeper from "../../pages/NoteKeeper/NoteKeeper";
import { useTSPurifier } from "../../utils/hooks/useTSPurifier";
import { TSRouter } from "../../utils/routes/class/Router.class";

export const Router = (DOM: HTMLElement, title: string) => {
    const routes = new TSRouter(
        [
            {
                path: "/",
                element: () => NoteKeeper(DOM,title),
            },
            {
                path: "*",
                element: () => NotFound(DOM,title),
            },
        ],
        [String(useTSPurifier(window.location.search))]
    )
    return routes.navigate("");
};
