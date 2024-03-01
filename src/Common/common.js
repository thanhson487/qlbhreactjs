export const formatPointNumber = (e, option = { fraction: 10 }) => {
  const value = `${e}`;
  let number = value.match(/[\d.]/g)?.join('') ?? '';
  if (number.indexOf('.') !== number.lastIndexOf('.')) {
    number = number.replaceAll('.', '');
  }
  const valueNumber = value.indexOf('-') === 0 ? `-${number}` : number;
  if (valueNumber[0] === '-' && valueNumber.length === 1) {
    return valueNumber;
  }
  if (valueNumber.length === 0) return '';
  if (valueNumber.indexOf('.') !== valueNumber.length - 1) {
    const numberFloat = parseFloat(valueNumber);
    const formattedNumber = numberFloat.toLocaleString('en-US', {
      maximumFractionDigits: option?.fraction
    });
    return formattedNumber;
  }
  return value;
};

export const convertStringToNumber = e => {
  const value = String(e);
  const regex = /[0-9]*/g;
  const stringNum = value.match(regex);
  return stringNum ? Number(stringNum.join('')) : 0;
};
