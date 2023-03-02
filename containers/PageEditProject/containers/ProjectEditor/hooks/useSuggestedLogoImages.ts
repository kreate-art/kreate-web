import useSWR from "swr";

import { NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN } from "../../../../../config/client";

import { httpPostBlazinglyFastLogos } from "@/modules/ai/api/httpPostBlazinglyFastLogos";
import { assert } from "@/modules/common-utils";

type LogoCid = string;
type BlobUrl = string;

/**
 * Returns the blob url of the given logo id.
 *
 * Note that the generation process takes time. While the result is not ready,
 * this hook will return `undefined`.
 */
function useLogoAsBlobUrl(logoCid: LogoCid | null): BlobUrl | undefined {
  const { data, error } = useSWR(
    ["b30cd14f-b28a-41c7-b7d4-e1ace64b2f3a", logoCid],
    async () => {
      if (!logoCid) return undefined;
      const response = await fetch(
        `${NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN}/ipfs/${logoCid}`
      );
      assert(response.ok, "response not ok");
      return URL.createObjectURL(await response.blob());
    },
    {
      shouldRetryOnError: true,
      errorRetryCount: Infinity,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error || !data) return undefined;
  return data;
}

/**
 * Returns a list of urls in format `blob:...` where each element refers
 * to an image returned by our AI service.
 *
 * Because the AI service returns multiple images, and one image might be
 * generated faster than another image, the length of the result will usually
 * be changed gradually 0 -> 1 -> 2 -> etc.
 */
// TODO: @sk-shishi, @sk-kitsune: Our blazingly fast logos generation return already-pinned CIDs,
// therefore we don't really need to load them as blobs and then re-pin them.
// Any ideas on how this can be done in a trivial way?
// NOTE: this hook does not provide the debounce mechanism
export function useSuggestedLogoImages(
  letter: string | null,
  keywords: string[] | null
): BlobUrl[] | undefined {
  const normalizedKeywords = (keywords ?? []).map((word) =>
    word.trim().toLowerCase()
  );
  const { data } = useSWR(
    [
      "f9cce207-2576-4331-8e1b-88c7f296d329",
      letter,
      normalizedKeywords.join(" "),
    ],
    async () => {
      if (!letter || !keywords || !keywords.length) return;
      const response = await httpPostBlazinglyFastLogos({
        letter,
        keywords: normalizedKeywords,
      });
      return response.logos;
    },
    {
      shouldRetryOnError: true,
      errorRetryCount: Infinity,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // NOTE: @sk-kitsune: We are not allowed to call hooks inside a loop.
  // We assume that the returned list will never have more than 10 elements.
  // This implementation might not be the cleanest solution, but it is
  // most practical one at the time of writing.
  // https://reactjs.org/docs/hooks-rules.html
  const t0 = useLogoAsBlobUrl(data?.[0] || null);
  const t1 = useLogoAsBlobUrl(data?.[1] || null);
  const t2 = useLogoAsBlobUrl(data?.[2] || null);
  const t3 = useLogoAsBlobUrl(data?.[3] || null);
  const t4 = useLogoAsBlobUrl(data?.[4] || null);
  const t5 = useLogoAsBlobUrl(data?.[5] || null);
  const t6 = useLogoAsBlobUrl(data?.[6] || null);
  const t7 = useLogoAsBlobUrl(data?.[7] || null);
  const t8 = useLogoAsBlobUrl(data?.[8] || null);
  const t9 = useLogoAsBlobUrl(data?.[9] || null);

  const result: BlobUrl[] | undefined = data
    ? [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9]
        .filter((value) => !!value)
        .map((value) => value || "")
    : undefined;
  return result;
}
