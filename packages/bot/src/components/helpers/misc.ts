import { customAlphabet } from 'nanoid';

export function generateErrorID(): string {
    return (Math.random() + 1).toString(36).substring(3);
}

const reportIDGenerator = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 10);
const imageIDGenerator = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 10);

export function generateReportID(): string {
    return reportIDGenerator();
}

export function generateImageID(): string {
    return imageIDGenerator();
}

export function capitalize(string: string): string {
    let toReturn = string;
    try {
        toReturn = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } catch (e) {
        toReturn = string;
    }

    return toReturn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enumToMap(enumeration: any): Map<string, string | number> {
    const map = new Map<string, string | number>();
    for (const key in enumeration) {
        if (!isNaN(Number(key))) continue;
        const val = enumeration[key] as string | number;
        if (val !== undefined && val !== null) map.set(key, val);
    }
    return map;
}

export function mapAnyType(enumeration: any) {
    const map = enumToMap(enumeration);
    const choices = Array.from(map.entries()).map((m) => {
        let x = m[0];
        if (x.includes('_')) {
            const split = x.split('_');
            x = `${capitalize(split[0])}${capitalize(split[1])}`;
        } else x = capitalize(x);
        return {
            name: x,
            value: `${m[1]}`,
        };
    });

    return choices;
}
