// const USD_AMOUNT_FORMATTER = new Intl.NumberFormat("en-IN", {
//   maximumSignificantDigits: 3,
// });

export function formatUsdAmountWithCurrencySymbol(usd: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 2,
  }).format(usd);
}
