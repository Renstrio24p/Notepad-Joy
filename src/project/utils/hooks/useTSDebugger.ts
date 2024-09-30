export function useTSDebugger(...values: any[]): void {
    console.group("Debug Information");
    values.forEach((value, index) => {
        console.log(`Value ${index + 1}:`, value);
    });
    console.groupEnd();
}