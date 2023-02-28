type Sha256 = string;

/**
 * Sometimes we want to push an object to our backend, or to store
 * some data in the local storage. However, as long as there is a
 * field with value `blob:...`, we know that we cannot store them
 * directly.
 *
 * For example, we have an object like this:
 * ```
 * const user: User = {
 *   name: "John Doe",
 *   avatar: "blob:http://localhost:3000/eaf92410-1b41-4523-a8e8-093705173d37"
 * }
 * ```
 *
 * We want to transform it to:
 * ```
 * const userWB: WithBufs<User> = {
 *   data: {
 *     name: "John Doe",
 *     avatar: "sha256:0b6fec3ad94d153dd501dbeefa14cb179c661126296888ad5d93cb523d04a01c"
 *   },
 *   bufs: {
 *     "0b6fec3ad94d153dd501dbeefa14cb179c661126296888ad5d93cb523d04a01c": [ArrayBuffer]
 *   }
 * }
 * ```
 *
 * After we have a value of `WithBufs<T>`, we can safely store it in
 * our backend or local storage.
 *
 * @deprecated Use `WithBufsAs<T, ArrayBuffer>` from `@/modules/with-bufs-as` instead
 */
export type WithBufs<T> = {
  data: T;
  bufs: Record<Sha256, ArrayBuffer>;
};

/**
 * `WithBufs<T>` is a Monoid. We can concat them.
 * ```
 * concat([a, b, c]) = {
 *   data: [a.data, b.data, c.data],
 *   bufs: {...a.bufs, ...b.bufs, ...c.bufs},
 * }
 * ```
 */
export function concat<T>(array: WithBufs<T>[]): WithBufs<T[]> {
  return {
    data: array.map((item) => item.data),
    bufs: Object.assign({}, ...array.map((item) => item.bufs)),
  };
}

/**
 * `WithBufs<T>` is a Functor.
 *
 * ```
 * pure(x) = { data: x, bufs: {} }
 * ```
 */
export function pure<T>(value: T): WithBufs<T> {
  return { data: value, bufs: {} };
}
