
export function normalizeSearchInput(text)
{
    return text.replace(/[\W_]+/g, "").toLowerCase();
}
