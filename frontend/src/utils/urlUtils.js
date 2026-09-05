export const parseQueryParams = (searchString) => {
  const params = new URLSearchParams(searchString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const buildQueryString = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      params.append(key, val);
    }
  });
  return params.toString();
};
