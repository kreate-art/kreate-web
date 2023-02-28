import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpGetIllustration } from "@/modules/ai/api/httpGetIllustration";
import { httpPostIllustrationGeneration } from "@/modules/ai/api/httpPostIllustrationGeneration";
import { toJson } from "@/modules/json-utils";

type IllustrationId = string;
type BlobUrl = string;

/**
 * Returns the blob url of the given illustration id.
 *
 * Note that the generation process takes time. While the result is not ready,
 * this hook will return `undefined`.
 */
function useIllustrationAsBlobUrl(
  illustrationId: IllustrationId | null
): BlobUrl | undefined {
  const { data, error } = useSWR(
    ["05c2154c-ef1f-497d-903c-878dc3678c73", illustrationId],
    async () => {
      if (!illustrationId) return undefined;
      const blob = await httpGetIllustration({
        baseUrl: NEXT_PUBLIC_AI_URL,
        illustrationId,
      });
      return URL.createObjectURL(blob);
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
// NOTE: this hook does not provide the debounce mechanism
export function useSuggestedCoverImages(
  keywords: string[] | string | null
): BlobUrl[] | undefined {
  const { data } = useSWR(
    ["0f58cf6d-4bb7-429a-ba07-4ea557ac112b", toJson(keywords)],
    async () => {
      if (!keywords || !keywords.length) return;
      const response = await httpPostIllustrationGeneration({
        baseUrl: NEXT_PUBLIC_AI_URL,
        keywords,
      });
      return response.illustrations;
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
  const t0 = useIllustrationAsBlobUrl(data?.[0] || null);
  const t1 = useIllustrationAsBlobUrl(data?.[1] || null);
  const t2 = useIllustrationAsBlobUrl(data?.[2] || null);
  const t3 = useIllustrationAsBlobUrl(data?.[3] || null);
  const t4 = useIllustrationAsBlobUrl(data?.[4] || null);
  const t5 = useIllustrationAsBlobUrl(data?.[5] || null);
  const t6 = useIllustrationAsBlobUrl(data?.[6] || null);
  const t7 = useIllustrationAsBlobUrl(data?.[7] || null);
  const t8 = useIllustrationAsBlobUrl(data?.[8] || null);
  const t9 = useIllustrationAsBlobUrl(data?.[9] || null);

  const result: BlobUrl[] | undefined = data
    ? [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9]
        .filter((value) => !!value)
        .map((value) => value || "")
    : undefined;
  return result;
}
