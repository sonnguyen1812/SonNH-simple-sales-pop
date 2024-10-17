export default function titleCaseToCamelCase(titleCaseString) {
  const words = titleCaseString.split(' ');

  const camelCaseWords = [words[0].toLowerCase()];

  for (let i = 1; i < words.length; i++) {
    const capitalizedWord = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    camelCaseWords.push(capitalizedWord);
  }

  // Join the words back together
  return camelCaseWords.join('');
}
