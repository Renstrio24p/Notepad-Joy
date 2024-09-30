import html from "./project/utils/define/html"

export function render() {
  const htmls = html`
    <div id="app" class='w-screen'></div>
  `
  return { htmls }
}
