export function useTSStore(key: string) {
    const save = (value: string) => {
        return localStorage.setItem(key, value);
    };

    const get = () => {
        return localStorage.getItem(key);
    };

    const remove = () => {
        return localStorage.removeItem(key);
    };

    const clear = () => {
        return localStorage.clear();
    };

    return { save, get, remove, clear };
}

