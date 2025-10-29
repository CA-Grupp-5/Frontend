export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatPackageId = (id?: string | null): string | null => {
  if (id == null) return null;
  const value = String(id).trim();
  if (!value) return null;
  return value.toUpperCase().startsWith('PKG-') ? value : `PKG-${value}`;
};
