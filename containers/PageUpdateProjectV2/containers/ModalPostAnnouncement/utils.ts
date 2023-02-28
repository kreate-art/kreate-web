import { tryAsResultT } from "@/modules/async-utils";
import { ProjectAnnouncement } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { clear, load, save } from "@/modules/storage-v2";
import { Converters } from "@/modules/with-bufs-as-converters";
import CodecBlob from "@/modules/with-bufs-as-converters/codecs/CodecBlob";

type StorageType = "auto-save" | "last-submission";

function getStorageId(projectId: string, storageType: StorageType): string {
  // https://www.notion.so/shinka-network/549ee87019e240cd8c9de1cc3f49bbab
  switch (storageType) {
    case "auto-save":
      return `storage-v2://creator-update-project/by-project-id/${projectId}/project-announcement--auto-saved`;
    case "last-submission":
      return `storage-v2://creator-update-project/by-project-id/${projectId}/project-announcement--last-submission`;
    default:
      throw new TypeError();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isProjectAnnouncement(obj: any): obj is ProjectAnnouncement {
  return (
    typeof obj?.title === "string" &&
    typeof obj?.body === "object" &&
    typeof obj?.summary === "string"
  );
}

export async function loadProjectAnnouncementFromBrowserStorage(
  projectId: string,
  storageType: StorageType
): Promise<ProjectAnnouncement> {
  const storageId = getStorageId(projectId, storageType);
  const { data, bufs } = await load(storageId);
  assert(isProjectAnnouncement(data));
  return Converters.toProjectAnnouncement(CodecBlob)({ data, bufs });
}

export function newProjectAnnouncement(): ProjectAnnouncement {
  return {
    title: "",
    body: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    summary: "",
  };
}

export async function loadProjectAnnouncement(
  projectId: string,
  storageType: StorageType
): Promise<ProjectAnnouncement> {
  // 1. Try to load from browser storage first
  const resultT = await tryAsResultT(
    async () =>
      await loadProjectAnnouncementFromBrowserStorage(projectId, storageType)
  );
  if (resultT.ok) {
    return resultT.result;
  }

  // 2. Return the blank value
  return newProjectAnnouncement();
}

export async function saveProjectAnnouncement(
  projectId: string,
  value: ProjectAnnouncement,
  storageType: StorageType,
  signal?: AbortSignal
) {
  const storageId = getStorageId(projectId, storageType);
  const blobWBA = await Converters.fromProjectAnnouncement(CodecBlob)(value);
  signal && signal.throwIfAborted();
  await save(storageId, blobWBA);
}

export async function clearProjectAnnouncement(
  projectId: string,
  storageType: StorageType
) {
  await clear(getStorageId(projectId, storageType));
}
