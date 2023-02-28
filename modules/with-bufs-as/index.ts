type Sha256 = string;

type BufsAs<V> = Record<Sha256, V>;

export type WithBufsAs<T, V> = {
  data: T;
  bufs: Record<Sha256, V>;
};

/**
 * ```
 * pure(x) = { data: x, bufs: {} }
 * ```
 */
export function pure<T, V = never>(data: T): WithBufsAs<T, V> {
  return { data, bufs: {} };
}

/**
 * ```
 * concat([a, b, c]) = {
 *   data: [a.data, b.data, c.data],
 *   bufs: {...a.bufs, ...b.bufs, ...c.bufs},
 * }
 * ```
 */
export function concat<T, V>(array: WithBufsAs<T, V>[]): WithBufsAs<T[], V> {
  return {
    data: array.map((item) => item.data),
    bufs: Object.assign({}, ...array.map((item) => item.bufs)),
  };
}

/**
 * Similar to `Object.assign`, but for `WithBufsAs`.
 *
 * ```
 * assign(a, { b, c }) = {
 *   data: { ...a.data, b: b.data, c: c.data },
 *   bufs: { ...a.bufs, ...b.bufs, ...c.bufs }
 * }
 * ```
 *
 * Note that `target` is unchanged (different from `Object.assign`).
 */
export function assign<T extends object, V>(
  target: WithBufsAs<T, V>,
  ...sources: { [P in keyof T]?: WithBufsAs<T[P], V> }[]
): WithBufsAs<T, V> {
  const result = { data: { ...target.data }, bufs: { ...target.bufs } };
  for (const source of sources) {
    for (const key in source) {
      const value = source[key];
      if (value === undefined) break;
      result.data[key] = value.data;
      Object.assign(result.bufs, value.bufs);
    }
  }
  return result;
}

/** Applies `cb` to each value in `obj`. Returns the new object. */
export function mapValues<V1, V2>(
  obj: { [key: string]: V1 },
  cb: (value: V1, key: string) => V2
): { [k: string]: V2 } {
  const entries = Object.entries(obj);
  const newEntries = entries.map(
    ([key, value]) => [key, cb(value, key)] as const
  );
  return Object.fromEntries(newEntries);
}

/** Applies `cb` to each value in `obj`. Returns the new object. */
export async function mapValuesAsync<V1, V2>(
  obj: { [key: string]: V1 },
  cb: (value: V1, key: string) => Promise<V2>
): Promise<{ [k: string]: V2 }> {
  const entries = Object.entries(obj);
  const newEntries = await Promise.all(
    entries.map(async ([key, value]) => [key, await cb(value, key)] as const)
  );
  return Object.fromEntries(newEntries);
}

/** Applies `cb` to `wb.data` */
export function mapData<T1, V, T2>(
  { data, bufs }: WithBufsAs<T1, V>,
  cb: (data: T1) => T2
): WithBufsAs<T2, V> {
  return { data: cb(data), bufs };
}

/** Applies `cb` to `wb.data` */
export async function mapDataAsync<T1, V, T2>(
  { data, bufs }: WithBufsAs<T1, V>,
  cb: (data: T1) => Promise<T2>
): Promise<WithBufsAs<T2, V>> {
  return { data: await cb(data), bufs };
}

/** Applies `cb` to `wb.bufs` */
export function mapBufs<T, V1, V2>(
  { data, bufs }: WithBufsAs<T, V1>,
  cb: (bufs: BufsAs<V1>) => BufsAs<V2>
): WithBufsAs<T, V2> {
  return { data, bufs: cb(bufs) };
}

/** Applies `cb` to `wb.bufs` */
export async function mapBufsAsync<T, V1, V2>(
  { data, bufs }: WithBufsAs<T, V1>,
  cb: (bufs: BufsAs<V1>) => Promise<BufsAs<V2>>
): Promise<WithBufsAs<T, V2>> {
  return { data, bufs: await cb(bufs) };
}

/** Applies `cb` to each buf in `wb.bufs` */
export function mapEachBuf<T, V1, V2>(
  { data, bufs }: WithBufsAs<T, V1>,
  cb: (buf: V1, key: string) => V2
): WithBufsAs<T, V2> {
  return { data, bufs: mapValues(bufs, cb) };
}

/** Applies `cb` to each buf in `wb.bufs` */
export async function mapEachBufAsync<T, V1, V2>(
  { data, bufs }: WithBufsAs<T, V1>,
  cb: (buf: V1, key: string) => Promise<V2>
): Promise<WithBufsAs<T, V2>> {
  return { data, bufs: await mapValuesAsync(bufs, cb) };
}
