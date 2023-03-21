import { redis } from "./connections";

import { tryUntil } from "@/modules/async-utils";
import { throw$ } from "@/modules/async-utils";
import { identity } from "@/modules/common-utils";

async function pingLock(key: string) {
  return await redis.get(key);
}

type Expiration = "forever" | { ttl: number } | { until: number }; // seconds

async function attemptLock(
  key: string,
  identifier: string,
  expiration: Expiration
) {
  return (
    (await (expiration === "forever"
      ? redis.set(key, identifier, "NX")
      : "ttl" in expiration
      ? redis.set(key, identifier, "EX", expiration.ttl, "NX")
      : "until" in expiration
      ? redis.set(key, identifier, "EXAT", expiration.until, "NX")
      : throw$("invalid expiration"))) === "OK"
  );
}

async function acquireLock(
  key: string,
  identifier: string,
  expiration: Expiration
) {
  await tryUntil({
    run: () => {
      const locked = attemptLock(key, identifier, expiration);
      if (!locked) console.log(`Waiting for lock: ${key} | ${identifier}`);
      return locked;
    },
    until: identity,
  });
  return { release: () => releaseLock(key, identifier) };
}

async function releaseLock(key: string, identifier: string) {
  return !!(await redis.delif(key, identifier));
}

const exports = {
  ping: pingLock,
  attempt: attemptLock,
  acquire: acquireLock,
  release: releaseLock,
};

export default exports;
