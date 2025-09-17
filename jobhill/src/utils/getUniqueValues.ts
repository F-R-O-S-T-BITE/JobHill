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

export function getAvailableRoleTypes(
  data: { tags: { label: string; type: string }[] }[]
): { hasNewGrad: boolean; hasEmergingTalent: boolean; hasOther: boolean } {
  if (!data || data.length === 0) {
    return {
      hasNewGrad: false,
      hasEmergingTalent: false,
      hasOther: false
    };
  }

  let hasNewGrad = false;
  let hasEmergingTalent = false;
  let hasOther = false;

  for (const item of data) {
    const roleLabels = item.tags
      .filter(tag => tag.label === "New Grad" || tag.label === "Emerging Talent")
      .map(tag => tag.label);

    if (roleLabels.includes("New Grad")) {
      hasNewGrad = true;
    }
    if (roleLabels.includes("Emerging Talent")) {
      hasEmergingTalent = true;
    }
    if (roleLabels.length === 0) {
      hasOther = true;
    }

    if (hasNewGrad && hasEmergingTalent && hasOther) {
      break;
    }
  }

  return {
    hasNewGrad,
    hasEmergingTalent,
    hasOther
  };
}