export default (
    key: string,
    JSONStringify: boolean = false
): [
    any | null,
    (value: any) => void,
    () => void
] => {
    const item = localStorage.getItem(key);
    const LSGet = item && JSONStringify
        ? JSON.parse(item)
        : item;
    const LSSet = (value: any) => localStorage.setItem(
        key, JSONStringify ? JSON.stringify(value) : value
    );
    const LSRemove = () => localStorage.removeItem(key);

    return [LSGet, LSSet, LSRemove];
};
