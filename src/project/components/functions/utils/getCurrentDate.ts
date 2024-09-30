import { useTSSelector } from "../../../utils/hooks/useTSSelector"

export const getCurrentDate = (): string => {

    const currentDateEl = useTSSelector(document, '[data-current-date]', false) as HTMLElement

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };

    const currentDate = new Date().toLocaleDateString('en-US', options);

    return currentDateEl.textContent = currentDate;
}
