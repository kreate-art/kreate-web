import { WithBufsAs } from "@/modules/with-bufs-as";

export type Url = string;

export type Codec<V> = {
  fromUrl: (value: Url) => Promise<WithBufsAs<Url, V>>;
  toUrl: ({ data, bufs }: WithBufsAs<Url, V>) => Url;
};

export type FromFn<T, V> = (data: T) => Promise<WithBufsAs<T, V>>;

export type ToFn<T, V> = (wba: WithBufsAs<T, V>) => T;
