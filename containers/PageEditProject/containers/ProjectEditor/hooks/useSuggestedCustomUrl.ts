function slugifyToParts(text: string): string[] {
  // 1. Removes diacritical marks (e.g. "Crème Brulée" --> "Creme Brulee")
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // 2. Keeps only alpha-numeric characters
  text = text.replace(/[^0-9A-Za-z]/g, " ");
  // 3. Converts to lowercase
  text = text.toLowerCase();
  // 4. Splits to words
  return text.split(" ").filter((word) => !!word);
}

function sortAndUniq(items: string[]) {
  return [...items]
    .sort()
    .filter((value, index, array) => value !== array[index - 1]);
}

export function useSuggestedCustomUrl(
  projectTitle: string | null
): string[] | null {
  if (!projectTitle) return null;
  const kebab = slugifyToParts(projectTitle).join("-");
  const snake = slugifyToParts(projectTitle).join("_");
  return sortAndUniq([kebab, snake]);
}
