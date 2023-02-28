import { FromFn, ToFn } from "../types";

import { concat, pure, WithBufsAs } from "@/modules/with-bufs-as";

/** Converts `T[]` to `WithBufsAs<T[], V>` */
export function fromArray<T, V>(fromItem: FromFn<T, V>): FromFn<T[], V> {
  return async function (array: T[]) {
    return concat(await Promise.all(array.map((item) => fromItem(item))));
  };
}

/** Converts `WithBufsAs<T[], V>` to `T[]` */
export function toArray<T, V>(toItem: ToFn<T, V>): ToFn<T[], V> {
  return function ({ data, bufs }) {
    return data.map((item) => toItem({ data: item, bufs }));
  };
}

/** Converts `T` (object) to `WithBufsAs<T, V>` */
export function fromObject<T extends object, V>(fromField: {
  [P in keyof T]?: FromFn<T[P], V>;
}): FromFn<T, V> {
  return async function (value: T) {
    const result: WithBufsAs<T, V> = { data: { ...value }, bufs: {} };
    const tasks: (() => Promise<void>)[] = [];
    for (const key in fromField) {
      const cb = fromField[key];
      if (!cb) continue;
      tasks.push(async () => {
        // We push these thunks to an array so that later we can run them in parallel.
        // This approach is for optimization only.
        const { data, bufs } = await cb(value[key]);
        result.data[key] = data;
        Object.assign(result.bufs, bufs);
      });
    }
    await Promise.all(tasks.map((cb) => cb()));
    return result;
  };
}

/** Converts `WithBufsAs<T, V>` to `T` (object) */
export function toObject<T extends object, V>(toField: {
  [P in keyof T]?: ToFn<T[P], V>;
}): ToFn<T, V> {
  return function ({ data, bufs }) {
    const result = { ...data };
    for (const key in toField) {
      const cb = toField[key];
      if (!cb) continue;
      result[key] = cb({ data: data[key], bufs });
    }
    return result;
  };
}

/**
 * Converts `T | null | undefined` to `WithBufsAs<T | null | undefined, V>`.
 *
 * `T | null`, `T | undefined` are also supported.
 */
export function fromNullable<T, V>(fromValue: FromFn<T, V>) {
  return async <T0 extends T | null | undefined>(value: T0) =>
    value != null ? await fromValue(value) : pure(value);
}

/**
 * Converts `WithBufsAs<T | null | undefined, V>` to `T | null | undefined`.
 *
 * `T | null`, `T | undefined` are also supported.
 */
export function toNullable<T, V>(toValue: ToFn<T, V>) {
  return <T0 extends T | null | undefined>({ data, bufs }: WithBufsAs<T0, V>) =>
    data != null ? toValue({ data, bufs }) : data;
}
