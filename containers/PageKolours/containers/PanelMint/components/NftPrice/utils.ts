type Ratio = number;

export function formatRatioAsPercentage(value: Ratio) {
  return value.toLocaleString("en-US", {
    maximumSignificantDigits: 2,
    style: "percent",
  });
}
