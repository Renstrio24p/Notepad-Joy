import { useTSElements } from "../../utils/hooks/useTSElements";

export default function Home(DOM: HTMLElement, title: string) {
    document.title = `${title} | Home`;

    const ui = useTSElements(DOM, /*html*/`
        <div class='bg-gray-800 p-8 rounded-lg'>
            <div class="text-center">
                <h1 class='text-white text-[3em] font-semibold'>Vanilla TypeScript SSR</h1>
                <p class='text-white text-[1.5em] mb-6'>A simple, lightweight, and fast way to build web applications with TypeScript</p>
            </div>
            <h2 class='text-white text-[2em] font-semibold mb-4'>Features</h2>
            <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div class='bg-gray-700 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'>
                    <h3 class='text-white text-xl font-bold'>Server-side rendering</h3>
                    <p class='text-white'>Render your pages on the server for improved performance and SEO.</p>
                </div>
                <div class='bg-gray-700 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'>
                    <h3 class='text-white text-xl font-bold'>Lightweight</h3>
                    <p class='text-white'>Minimal setup with no unnecessary libraries, keeping your app lean.</p>
                </div>
                <div class='bg-gray-700 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'>
                    <h3 class='text-white text-xl font-bold'>Fast</h3>
                    <p class='text-white'>Optimized for speed to ensure quick load times for your users.</p>
                </div>
                <div class='bg-gray-700 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'>
                    <h3 class='text-white text-xl font-bold'>Easy to use</h3>
                    <p class='text-white'>Simple and intuitive API that makes development a breeze.</p>
                </div>
            </div>
        </div>
    `);

    return ui;
}
