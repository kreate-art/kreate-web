import React from "react";
import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostContentModeration } from "@/modules/ai/api/httpPostContentModeration";
import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";

type Params = {
  uuid: string;
  section: string;
  text: string;
  alertNewModerationWarning: (section: string, tags: string[]) => void;
  delay?: number;
};

export function useContentModeration({
  uuid,
  section,
  text,
  alertNewModerationWarning,
  delay,
}: Params) {
  const [value$Debounced, value$Dirty] = useDebounce(text, {
    delay: delay ?? 6000,
  });
  const [currentContentModeration, setCurrentContentModeration] =
    React.useState<string[]>([]);

  const { data, error } = useSWR(
    [uuid, value$Debounced, value$Dirty],
    async () => {
      if (!value$Debounced || value$Dirty) return undefined;
      const response = await httpPostContentModeration({
        baseUrl: NEXT_PUBLIC_AI_URL,
        text: value$Debounced,
      });
      return response.tags;
    },
    {
      shouldRetryOnError: true,
      errorRetryCount: Infinity,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  React.useEffect(() => {
    // purposely ignore the error because it is not important
    if (error) {
      console.log(error);
      return;
    }
    if (data === undefined) return;
    const newTags = data.filter(
      (tag) => !currentContentModeration.includes(tag)
    );
    if (newTags.length) {
      alertNewModerationWarning(section, newTags);
      setCurrentContentModeration(data);
    } else if (data && !data?.length && currentContentModeration.length) {
      alertNewModerationWarning(section, []);
      setCurrentContentModeration(data);
    }
  }, [currentContentModeration, data, section, error]);
}
