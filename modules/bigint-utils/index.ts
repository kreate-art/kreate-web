import { LovelaceAmount, MicroTeikiAmount } from "@/modules/business-types";

const NON_BREAKING_SPACE = "\u00A0";
const TEIKI_SYMBOL = "\u20AE"; // ₮

/**
 * Formats a `LovelaceAmount`
 *
 * Examples:
 * - `formatLovelaceAmount(1234567) = "1.23"`
 * - `formatLovelaceAmount(1234567890, { includeCurrencySymbol: true }) = "1,234.57 ₳"`
 */
export function formatLovelaceAmount(
  numLovelaces: LovelaceAmount,
  options: {
    compact?: boolean;
    includeCurrencySymbol?: boolean;
    excludeThousandsSeparator?: boolean;
    useMaxPrecision?: boolean;
  } = {}
) {
  // Converting a `bigint` to `string` and appending `"E-6"` is not a hack.
  // It is the proper way. See the following article:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#using_format_with_a_string
  let result = Intl.NumberFormat("en-US", {
    notation: options.compact ? "compact" : "standard",
    minimumFractionDigits: options.useMaxPrecision ? 6 : 2,
    maximumFractionDigits: options.useMaxPrecision ? 6 : 2,
  }).format(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    `${numLovelaces}E-6` as any
  );
  if (options.excludeThousandsSeparator) {
    result = result.replaceAll(",", "");
  }
  if (options.includeCurrencySymbol) {
    result += " ₳";
  }
  return result;
}

export function formatMicroTeikiAmount(
  numMicroTeiki: MicroTeikiAmount,
  options: {
    includeCurrencySymbol?: boolean;
  } = {}
) {
  let result = Intl.NumberFormat("en-US", {
    notation: "standard",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    `${numMicroTeiki}E-6` as any
  );
  if (options.includeCurrencySymbol) {
    result += NON_BREAKING_SPACE + TEIKI_SYMBOL;
  }
  return result;
}

/**
 * @deprecated Use `sumLovelaceAmount` instead
 */
export function sumBigInt(values: bigint[]) {
  return values.reduce(
    (previousValue: bigint, currentValue: bigint) =>
      previousValue + currentValue,
    BigInt(0)
  );
}

/**
 * Calculates the sum of all the `LovelaceAmount` values.
 */
export function sumLovelaceAmount(values: LovelaceAmount[]): LovelaceAmount {
  let result = BigInt(0);
  for (const value of values) {
    result += BigInt(value);
  }
  return result;
}

export function formatUsdAmount(
  usd: number | { lovelaceAmount: LovelaceAmount; adaPriceInUsd: number },
  options: {
    compact?: boolean;
    includeAlmostEqualToSymbol?: boolean;
    includeCurrencySymbol?: boolean;
  } = {}
): string {
  if (typeof usd === "number") {
    return (
      (options.includeAlmostEqualToSymbol ? "≈ " : "") +
      (options.includeCurrencySymbol ? "$" : "") +
      Intl.NumberFormat("en-US", {
        notation: options.compact ? "compact" : "standard",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usd)
    );
  }

  // Because we are only displaying the approximate amount,
  // it's okay to lose precision when converting bigint to number.
  return formatUsdAmount(
    Number(usd.lovelaceAmount) * 1e-6 * usd.adaPriceInUsd,
    options
  );
}

export function parseLovelaceAmount(text: string): LovelaceAmount | undefined {
  const matched = /^([0-9]+)(\.[0-9]*)?$/.exec(text);
  if (!matched) return undefined;
  const hi = BigInt(matched[1]) * BigInt(1000000);
  const lo = Math.round(matched[2] ? Number("0" + matched[2]) * 1000000 : 0);
  return hi + BigInt(lo);
}

export function sumTxBreakdown(txBreakdown: { [key: string]: LovelaceAmount }) {
  return sumLovelaceAmount(
    Object.values(txBreakdown).filter((value) => !!value)
  );
}
