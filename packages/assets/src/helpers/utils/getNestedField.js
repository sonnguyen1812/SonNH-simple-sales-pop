export default function getNestedField(obj, field) {
  const keys = field.split('.');
  let value = {...obj};

  for (const key of keys) {
    value = value[key];
    if (value === undefined) return undefined;
  }

  return value;
}
