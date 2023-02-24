export const validateEmty = (value) => {
  if (value.length > 0) {
    return Promise.resolve();
  }

  return Promise.reject(new Error('Vui lòng nhập thông tin'));
};
export const formatCurrency = (value) => {
  if (!value) return '';
  if (!value.match(/[0-9]/g)) return '';
  const reverseString = value.match(/[0-9]/g).reverse().join('');
  return reverseString
    .match(/.{1,3}/g)
    .join(',')
    .split('')
    .reverse()
    .join('');
};