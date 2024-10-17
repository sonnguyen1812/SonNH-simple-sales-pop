import getNestedField from '@assets/helpers/utils/getNestedField';

export default function sortFunction(arrToSort, order = 'asc', field) {
  return arrToSort.sort((a, b) => {
    const aValue = getNestedField(a, field);
    const bValue = getNestedField(b, field);

    if (order === 'asc') return aValue - bValue;

    return bValue - aValue;
  });
}
