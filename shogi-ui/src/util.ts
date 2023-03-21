export const transpose = <T>(a: T[][]) => a[0].map((_, c) => a.map(r => r[c]));
