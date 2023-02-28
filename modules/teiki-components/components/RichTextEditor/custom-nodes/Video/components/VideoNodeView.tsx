import { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import { Input } from "semantic-ui-react";

import { getOptimalSize } from "../utils";

import styles from "./VideoNodeView.module.scss";

export function VideoNodeView({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const { src, title, width, height } = node.attrs as Record<
    string,
    string | undefined
  >;
  return (
    <NodeViewWrapper draggable data-drag-handle="">
      {src ? (
        <div className={styles.videoContainer}>
          <div className={selected ? styles.videoSelectedHalo : undefined} />
          <video
            className={styles.video}
            src={src}
            title={title}
            width={width}
            height={height}
            controls
          />
        </div>
      ) : (
        <Input
          type="file"
          accept="video/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            const size = await getOptimalSize(url);
            updateAttributes({
              src: url,
              width: `${size.width}px`,
              height: `${size.height}px`,
            });
          }}
        />
      )}
    </NodeViewWrapper>
  );
}
