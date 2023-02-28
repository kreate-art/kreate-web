import { NEXT_PUBLIC_AI_URL } from "../../config/client";

export const getDescriptionSentiment = async (description: string) => {
  const res = await fetch(`${NEXT_PUBLIC_AI_URL}/sentiment-analysis`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: description,
    }),
  });

  return await res.json();
};
