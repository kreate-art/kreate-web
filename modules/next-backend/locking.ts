import { RedisKey, RedisValue } from "ioredis";

import { redis } from "./connections";

import { throw$, tryUntil } from "@/modules/async-utils";
import { assert } from "@/modules/common-utils";

async function pingLock(key: RedisKey) {
  return await redis.get(key);
}

type Expiration = "forever" | { ttl: number } | { until: number }; // seconds

export type Lock = { release: () => Promise<number> };

async function attemptLock(
  key: RedisKey,
  identifier: RedisValue,
  expiration: Expiration
): Promise<Lock | null> {
  const locked =
    (await (expiration === "forever"
      ? redis.set(key, identifier, "NX")
      : "ttl" in expiration
      ? redis.set(key, identifier, "EX", expiration.ttl, "NX")
      : "until" in expiration
      ? redis.set(key, identifier, "EXAT", expiration.until, "NX")
      : throw$("invalid expiration"))) === "OK";
  return locked ? { release: () => releaseLock(key, identifier) } : null;
}

async function acquireLock(
  key: RedisKey,
  identifier: RedisValue,
  expiration: Expiration,
  delay?: number
): Promise<Lock> {
  return tryUntil({
    run: () => {
      const locked = attemptLock(key, identifier, expiration);
      if (!locked) console.log(`Waiting for lock: ${key} | ${identifier}`);
      return locked;
    },
    until: (r) => !!r,
    delayBetween: delay,
  }) as Promise<Lock>;
}

async function releaseLock(key: RedisKey, identifier: RedisValue) {
  return redis.delif(key, identifier);
}

async function attemptMultiLock(
  keys: RedisKey[],
  identifier: RedisValue,
  expiration: Expiration
): Promise<Lock | null> {
  const locked = await redis.msetnx(...keys.flatMap((k) => [k, identifier]));
  if (locked) {
    const release = () => releaseMultiLock(keys, identifier);
    if (expiration !== "forever") {
      try {
        const mul = redis.multi({ pipeline: true });
        if ("ttl" in expiration) {
          const ttl = expiration.ttl;
          for (const key of keys) mul.expire(key, ttl);
        } else if ("until" in expiration) {
          const until = expiration.until;
          for (const key of keys) mul.expireat(key, until);
        }
        const replies = await mul.exec();
        assert(replies, "multi pipeline: replies must not be null");
        for (const [err, _] of replies) if (err) throw err;
      } catch (expError) {
        try {
          await release();
        } catch (rollbackError) {
          console.error("error while rollback...", rollbackError);
        }
        throw expError;
      }
    }
    return { release };
  } else {
    return null;
  }
}

async function acquireMultiLock(
  keys: RedisKey[],
  identifier: RedisValue,
  expiration: Expiration,
  delay?: number
): Promise<Lock> {
  return tryUntil({
    run: () => {
      const locked = attemptMultiLock(keys, identifier, expiration);
      if (!locked) console.log(`Waiting for locks | ${identifier}`);
      return locked;
    },
    until: (r) => !!r,
    delayBetween: delay,
  }) as Promise<Lock>;
}

async function releaseMultiLock(keys: RedisKey[], identifier: RedisValue) {
  // TODO: Less dangerous locking?
  const mul = redis.multi({ pipeline: true });
  for (const key of keys) mul.delif(key, identifier);
  const replies = await mul.exec();
  assert(replies, "multi pipeline: replies must not be null");
  let released = 0;
  for (const [error, result] of replies) {
    if (error) throw error;
    released += typeof result === "number" ? result : 0;
  }
  const total = keys.length;
  if (total !== released)
    console.warn(`can only release: ${released} / ${total}`);
  return released;
}

const exports = {
  ping: pingLock,
  attempt: attemptLock,
  acquire: acquireLock,
  release: releaseLock,
  multi: {
    attempt: attemptMultiLock,
    acquire: acquireMultiLock,
    release: releaseMultiLock,
  },
};

export default exports;
