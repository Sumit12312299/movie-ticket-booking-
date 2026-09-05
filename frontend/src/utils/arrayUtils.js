export const chunkArray = (arr, size) => {
  if (!arr || size <= 0) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const uniqueByKey = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};
