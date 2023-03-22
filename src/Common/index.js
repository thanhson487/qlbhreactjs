import dayjs from "dayjs";

export const validateEmty = (value) => {
  if (value.length > 0) {
    return Promise.resolve();
  }

  return Promise.reject(new Error("Vui lòng nhập thông tin"));
};
export const validateNumbers = (value) => {
  if (value.length === 0) {
    return Promise.reject(new Error("Không để trống thông tin"));
  }
  if (value.match(/^[0-9]*$/g) !== null) {
    return Promise.resolve();
  }

  return Promise.reject(new Error("Không được nhập chữ"));
};
export const formatCurrency = (value) => {
  if (!value) return "";
  if (!value.match(/[0-9]/g)) return "";
  const reverseString = value.match(/[0-9]/g).reverse().join("");
  return reverseString
    .match(/.{1,3}/g)
    .join(",")
    .split("")
    .reverse()
    .join("");
};
export const formatNumberNav = (value) => {
  if (!value) return 0;
  return Number(value.toString().replaceAll(/,/g, ""));
};
export const formatMoney = (num) => {
  if (num === undefined || num === null) return "";
  return Number(num)
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$&,"); // NOSONAR
};

export const formatPriceRuleListAssets = (num) => {
   if (num === undefined || num === null) return "";
  const number =  Number(num)

    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$&,"); // NOSONAR
return number;

};

export const formatDDtoValue = (date) => {
  const valueDate = dayjs(
    dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")
  ).valueOf();
  return valueDate
};
