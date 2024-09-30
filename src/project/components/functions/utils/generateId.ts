
export const generateId = (): string => {
    return new Date().getTime().toString(36);
}