export default function html(strings: TemplateStringsArray, ...values: any[]): string {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] || '');
    }, '');
}