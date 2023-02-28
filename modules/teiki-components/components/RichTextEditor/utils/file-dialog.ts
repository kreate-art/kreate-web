export function selectFiles({
  accept,
  multiple,
}: {
  accept: "image/*" | "video/*";
  multiple: boolean;
}) {
  return new Promise<FileList | null>((resolve, reject) => {
    const element = document.createElement("input");
    element.style.display = "none";
    element.type = "file";
    element.accept = accept;
    element.multiple = multiple;
    element.onchange = () => {
      resolve(element.files);
      document.body.removeChild(element);
    };
    element.onerror = (error) => {
      reject(error);
      document.body.removeChild(element);
    };
    document.body.appendChild(element);
    element.click();
  });
}

export async function selectOneFile({
  accept,
}: {
  accept: "image/*" | "video/*";
}) {
  try {
    const fileList = await selectFiles({ accept, multiple: false });
    return fileList?.item(0) || undefined;
  } catch (error) {
    // we intentionally drop errors
    console.error(error);
    return undefined;
  }
}
