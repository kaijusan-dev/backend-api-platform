export function exclude<T extends object, K extends keyof T>(
    data: T | T[],
    keys: K[]
): T extends T[] ? Omit<T, K>[] : Omit<T, K> {
    
    // Внутренняя функция для очистки одного объекта
    const removeKeys = (obj: any) => {
        const copy = { ...obj };
        keys.forEach(key => delete copy[key]);
        return copy;
    };

    // Если передан массив
    if (Array.isArray(data)) {
        return data.map(removeKeys) as any;
    }
    
    return removeKeys(data) as any;
}
