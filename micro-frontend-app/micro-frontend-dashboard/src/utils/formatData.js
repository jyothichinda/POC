export const formatCurrency = (value, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};

export const CashTotal = (data) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data format: Expected an array");
    return 0;
  }
  return data?.reduce((sum, item) => sum + parseFloat(item.amount), 0);
};
