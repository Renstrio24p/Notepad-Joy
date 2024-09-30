import { useAnchor } from "../../utils/hooks/useTSAnchor";
import { useTSElements } from "../../utils/hooks/useTSElements";
import { useTSSelector } from "../../utils/hooks/useTSSelector";

export default function NotFound(DOM: HTMLElement, title: string) {
    document.title = `${title} | 404`;

    const ui = useTSElements(DOM, /*html*/`
        <div class='flex items-center justify-center w-full h-screen bg-gray-800'>
            <div class='bg-gray-700 p-8 rounded-lg shadow-lg text-center'>
                <h1 class='text-white text-[3em] font-semibold'>404</h1>
                <p class='text-gray-400 text-[1.5em]'>Not Found</p>
                <p class='text-gray-300 mt-1'>This is an Example of Page not found in Vanilla TS</p>
                <p class='text-gray-300 mt-4'>Sorry, the page you are looking for does not exist.</p>
                <a href='/' class='mt-6 inline-block text-blue-400 hover:underline'>Go back to Home</a>
            </div>
        </div>
    `);

    const anchor = useTSSelector(DOM, 'a', true) as NodeListOf<HTMLAnchorElement>;
    useAnchor(anchor);

    return ui;
}
