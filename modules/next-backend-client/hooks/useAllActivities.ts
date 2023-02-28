import useSWR from "swr";

import {
  httpGetAllActivities,
  HttpGetAllActivities$Params,
  HttpGetAllActivities$Response,
} from "../api/httpGetAllActivities";

export function useAllActivities({
  actor,
  relationship,
  cursor,
  limit,
}: HttpGetAllActivities$Params): [
  HttpGetAllActivities$Response | undefined,
  unknown
] {
  const { data, error } = useSWR(
    [
      "35c73f78-eda5-4e3f-9bf1-3717c3b3bba6",
      actor,
      relationship,
      cursor,
      limit,
    ],
    async () =>
      await httpGetAllActivities({
        actor,
        relationship,
        cursor,
        limit,
      })
  );
  return [data, error];
}
