import { tryAsResultT } from "@/modules/async-utils";
import { Project } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";
import { load, save } from "@/modules/storage-v2";
import { Converters } from "@/modules/with-bufs-as-converters";
import CodecBlob from "@/modules/with-bufs-as-converters/codecs/CodecBlob";

export function getStorageId(projectId: string): string {
  // https://www.notion.so/shinka-network/549ee87019e240cd8c9de1cc3f49bbab
  return `storage-v2://creator-update-project/by-project-id/${projectId}/project--auto-saved`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isProject(obj: any): obj is Project {
  return (
    typeof obj?.description === "object" &&
    typeof obj?.basics === "object" &&
    // typeof obj?.roadmap === "object" &&
    typeof obj?.community === "object"
  );
}

export async function saveProjectToBrowserStorage(
  storageId: string,
  project: Project
): Promise<void> {
  const projectWBA$Blob = await Converters.fromProject(CodecBlob)(project);
  await save(storageId, projectWBA$Blob);
}

export async function loadProjectFromBrowserStorage(
  storageId: string
): Promise<Project> {
  const { data, bufs } = await load(storageId);
  assert(isProject(data));
  return Converters.toProject(CodecBlob)({ data, bufs });
}

export async function loadProject(projectId: string): Promise<Project> {
  // 1. Try to load from browser storage first
  const loadProject$ResultT = await tryAsResultT(
    async () => await loadProjectFromBrowserStorage(getStorageId(projectId))
  );
  if (loadProject$ResultT.ok) {
    return loadProject$ResultT.result;
  }

  // 2. Load from backend
  const response = await httpGetProject({ projectId, preset: "full" });
  assert(!response.error, "response has non-null error");
  const { description, tiers, basics, roadmap, community } = response.project;
  assert(description && tiers && basics && community, "missing fields");
  return { description, tiers, basics, roadmap, community };
}
