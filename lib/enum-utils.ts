// lib/enum-utils.ts
import * as schema from "@/db/schema";

// Type helper untuk extract enum values
type EnumColumn = {
  enumValues: readonly string[];
};

// Extract enum values dari Drizzle schema
export const getEnumValues = (enumName: keyof typeof schema): string[] => {
  const enumObj = schema[enumName] as EnumColumn;
  if (enumObj && 'enumValues' in enumObj) {
    return [...enumObj.enumValues];
  }
  return [];
};

// Auto-format label dari enum value
export const formatEnumLabel = (value: string): string => {
  // Auto-format snake_case to Title Case
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Create filter options dari enum
export const createEnumFilterOptions = (enumName: keyof typeof schema) => {
  const values = getEnumValues(enumName);
  return values.map(value => ({
    value: value.toLowerCase(), // Ensure lowercase untuk consistency
    label: formatEnumLabel(value),
  }));
};

// Helper untuk generate filter config
export const createEnumFilter = (
  enumName: keyof typeof schema,
  label: string,
) => {
  return {
    label,
    options: createEnumFilterOptions(enumName),
  };
};