import { Project } from "../business-types";

import { CodecCid } from "@/modules/next-backend/utils/CodecCid";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

export function getProjectDetailsResponse(
  projectWBA: WithBufsAs<Project, string> | undefined
) {
  if (projectWBA) {
    const project = Converters.toProject(CodecCid)(projectWBA);

    return {
      ok: true,
      project: {
        data: project,
        bufs: projectWBA.bufs,
      },
    };
  } else {
    return {
      ok: false,
      message: "Invalid project details format",
    };
  }
}
