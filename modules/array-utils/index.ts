export function joinWithSeparator<T>(nodes: T[], separator: T) {
  const result: T[] = [];
  for (const node of nodes) {
    if (result.length > 0) {
      result.push(separator);
    }
    result.push(node);
  }
  return result;
}

export function groupedBy<T>(items: T[], keyFn: (value: T) => string) {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (key in result) {
      result[key].push(item);
    } else {
      result[key] = [item];
    }
  }
  return result;
}

export function sortedBy<T>(
  items: T[],
  keyFn: (value: T) => number | bigint | string
) {
  return [...items].sort((a, b) => {
    const _a = keyFn(a);
    const _b = keyFn(b);
    return _a < _b ? -1 : _a > _b ? 1 : 0;
  });
}

export function rankOf<T>(
  value: T,
  array: T[],
  keyFn: (value: T) => number | bigint
) {
  let result = 1;
  for (const item of array) {
    if (keyFn(item) > keyFn(value)) result += 1;
  }
  return result;
}

/**
 * Similar to Python's range function.
 *
 * This function returns an array containing integers from `start` (inclusive)
 * to `stop` (exclusive). In case that the second parameter is not defined,
 * `range(n)` is equivalent to `range(0, n)`.
 *
 * For examples:
 * - `range(5) = [0,1,2,3,4]`
 * - `range(2,4) = [2,3]`
 */
export function range(start: number, stop?: number): number[] {
  if (stop == null) return range(0, start);
  const result: number[] = [];
  for (let value = start; value < stop; value += 1) {
    result.push(value);
  }
  return result;
}

export function isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}

/**
 * @sk-yagi: This function partition a message
 * into lines of at most `sizeLimit` bytes each.
 */
export function splitToLines(message: string, sizeLimit: number): string[] {
  const result: string[] = [];
  for (const line of message.split(/(?:\r?\n)+/)) {
    const words = line.split(/\s/).filter((w) => !!w);
    let accumulator: string[] = [];
    let remaining = sizeLimit;
    for (const word of words) {
      const wordSize = Buffer.from(word, "utf-8").byteLength;
      if (wordSize > sizeLimit) {
        if (accumulator.length > 0) {
          result.push(accumulator.join(" "));
          accumulator = [];
          remaining = sizeLimit;
        }
        let subAccumulator = "";
        let subRemaining = sizeLimit;
        for (const char of word) {
          const charSize = Buffer.from(char, "utf-8").byteLength;
          if (charSize > subRemaining) {
            result.push(subAccumulator);
            subAccumulator = char;
            subRemaining = sizeLimit - charSize;
          } else {
            subRemaining -= charSize;
            subAccumulator += char;
          }
        }
        if (subAccumulator) result.push(subAccumulator);
      } else {
        // Plus the whitespace " "
        if (wordSize + 1 > remaining) {
          result.push(accumulator.join(" "));
          accumulator = [word];
          remaining = sizeLimit - wordSize;
        } else {
          remaining -= wordSize + 1;
          accumulator.push(word);
        }
      }
    }
    if (accumulator.length > 0) result.push(accumulator.join(" "));
  }
  return result;
}
