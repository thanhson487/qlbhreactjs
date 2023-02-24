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
export const formatNumberNav = (value) => {
  if (!value) return '';
  return Number(value.replaceAll(/,/g, ''));
};
export const formatMoney = (num) => {
  if (num === undefined || num === null) return '';
  return Number(num)
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&,'); // NOSONAR
};

export const formatPriceRuleListAssets = (value) => {
  const absValue = Math.abs(value);
  const valueFormat = formatValueCurrency(absValue);
  if (value >= 0) return valueFormat;
  return `-${valueFormat}`;
};
const formatValueCurrency = (absValue) => {
  if (absValue < 100000000) {
    return formatMoney(absValue.toString());
  }
  if (absValue >= 100000000 && absValue <= 999999999) {
    return `${(Math.round((absValue / 1000000) * 100) / 100).toFixed(2)} tr`;
  }
  if (absValue >= 1000000000 && absValue <= 999999999999) {
    return `${(Math.round((absValue / 1000000000) * 100) / 100).toFixed(2)} tỷ`;
  }
  if (absValue >= 1000000000000) {
    return `${(Math.round((absValue / 1000000000000) * 100) / 100).toFixed(
      2,
    )}k tỷ`;
  }
  return 0;
};