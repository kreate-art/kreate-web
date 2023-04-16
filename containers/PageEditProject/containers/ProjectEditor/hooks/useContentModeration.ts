import React from "react";
import useSWR from "swr";

import { httpPostContentModeration } from "@/modules/ai/api/httpPostContentModeration";
import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";

type Params = {
  uuid: string;
  section: string;
  text: string;
  alertNewModerationWarning: (section: string, tags: string[]) => void;
  delay?: number;
};

/** @deprecated */
export function useContentModeration(_params: Params) {
  return undefined;
}
