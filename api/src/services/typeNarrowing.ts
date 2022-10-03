export function forceStringType(...tab:(string | string[])[]): string[]{
    return tab.map(el => (((typeof el) == 'string' || !el) ? el : el[0]) as string);
}