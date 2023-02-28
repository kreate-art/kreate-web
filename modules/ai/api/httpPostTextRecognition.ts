import { assert } from "@/modules/common-utils";

type Params = {
  baseUrl: string;
  imageBlob: Blob;
};

type Response = {
  ocr: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): boolean {
  return typeof obj?.ocr === "string";
}

export async function httpPostTextRecognition({
  baseUrl,
  imageBlob,
}: Params): Promise<Response> {
  const formData = new FormData();
  formData.append("images", imageBlob);

  const response = await fetch(`${baseUrl}/text-recognition`, {
    method: "POST",
    headers: {
      // NOTE: do not set "Content-Type", the browser will set it for us
      // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
      Accept: "application/json",
    },
    body: formData,
  });

  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}
