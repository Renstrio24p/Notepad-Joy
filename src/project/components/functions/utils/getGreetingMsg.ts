
export const getGreetingMsg = (currentHour: number): string => {
    switch (true) {
        case currentHour === 0:
            return "Midnight";
        case currentHour < 5:
            return "Night";
        case currentHour < 12:
            return "Morning";
        case currentHour < 15:
            return "Noon";
        case currentHour < 18:
            return "Afternoon";
        default:
            return "Evening";
    }
}
