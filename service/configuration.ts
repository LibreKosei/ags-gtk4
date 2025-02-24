function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target: object, ...sources: object[]): object {
    return sources.reduceRight((acc, source) =>
        Object.entries(source || {}).reduce((a, [key, value]) => ({
            ...a,
            [key]: a[key] && typeof a[key] === "object" ? deepMerge(a[key], value) : value
        }), acc), target);
}

function makeJSON(key: string, value: unknown) {
    const keyArray = key.split(".")
    return keyArray.reduceRight((acc, key) => ({ [key] : acc}), value)
}

function accessJSON(keys: string, json: object) {
    const keyArray = keys.split(".")
    return keyArray.reduce(
        (acc, key) => (acc && key in acc ? acc[key] : null),
        json
    )
}
