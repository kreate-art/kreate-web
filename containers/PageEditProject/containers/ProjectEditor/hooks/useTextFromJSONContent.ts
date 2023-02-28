import { JSONContent } from "@tiptap/core";
import React from "react";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostTextRecognition } from "@/modules/ai/api/httpPostTextRecognition";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { getText } from "@/modules/teiki-components/components/RichTextEditor/utils/get-text";

export function useTextFromJSONContent(
  value: JSONContent | undefined
): string | undefined {
  const cachedOcrResults = React.useRef<Record<string, string>>({});

  const [result, reason] = useMemo$Async(
    async (signal) => {
      if (value == null) return undefined;
      return await getText(value, {
        image: async ({ node }) => {
          const src = node.attrs["src"];
          if (typeof src !== "string" || !src.startsWith("blob:")) return "";

          const cachedResult = cachedOcrResults.current[src];
          if (cachedResult) {
            return cachedResult;
          }

          const fetchedImage = await fetch(src);
          const imageBlob = await fetchedImage.blob();
          signal.throwIfAborted();

          const response = await httpPostTextRecognition({
            baseUrl: NEXT_PUBLIC_AI_URL,
            imageBlob,
          });
          cachedOcrResults.current[src] = response.ocr;
          return response.ocr;
        },
      });
    },
    { debouncedDelay: 1000 },
    [value]
  );

  if (reason) {
    // we intentionally ignore errors here
    console.error(reason);
  }

  return result;
}
