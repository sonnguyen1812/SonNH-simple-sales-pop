export const replaceSubstring = function(rootstrArr, substr) {
  return rootstrArr.map(r => r.replace(substr, ''));
};
