export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  return function (...args) {
    const context = this;
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (callNow) func.apply(context, args);
  };
};
