import { useTSElementEach } from "../../utils/hooks/useTSForEach"
import { useTSSelector } from "../../utils/hooks/useTSSelector"

export const tooltip = () => {
    const tooltipEls = useTSSelector(document, '[data-tooltip]', true) as NodeListOf<HTMLElement>

    return useTSElementEach(tooltipEls, ['mouseover'], (e) => Tooltip(e))
}

function Tooltip(element: HTMLElement) {
    const tooltip = document.createElement('span')
    tooltip.classList.add('tooltip', 'text-body-small')
    tooltip.textContent = element.dataset.tooltip as string

    document.body.appendChild(tooltip)

    const { top, left } = element.getBoundingClientRect()

    tooltip.style.position = 'absolute'
    tooltip.style.top = `${top + window.scrollY + 45}px`
    tooltip.style.left = `${left + window.scrollX - 40}px`

    element.addEventListener('mouseleave', () => {
        tooltip.remove()
    })
}
