import { useTSSelector } from "../../utils/hooks/useTSSelector"
import { getGreetingMsg } from "./utils/getGreetingMsg"

export const GreetingMsg = (): void => {

    const greetingElement = useTSSelector(document, '[data-greeting]', false) as HTMLElement

    const updateGreeting = () => {
        const currentHour = new Date().getHours()
        const verifyIts = currentHour < 15 ? "It's" : 'Good'
        greetingElement.textContent = `${verifyIts} ${getGreetingMsg(currentHour)}`
    }

    updateGreeting()

    setInterval(updateGreeting, 60000)
}
