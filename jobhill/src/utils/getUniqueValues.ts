export function getUniqueValues<T extends string | string[]>(
  data: any[],
  key: string
): string[] {
  const values = data.flatMap((item) => {
    const value = item[key];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [value];
    return [];
  });

  return [...new Set(values)].sort(); 
}

export function getUniqueTagsByType(
  data: { tags: { type: string; label: string }[] }[],
  tagType: string
): string[] {
  const values = data.flatMap((item) =>
    item.tags
      .filter((tag) => tag.type === tagType)
      .map((tag) => tag.label)
  );

  return [...new Set(values)].sort(); 
}