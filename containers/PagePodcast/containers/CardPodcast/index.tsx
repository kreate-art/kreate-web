import { useRouter } from "next/router";
import React from "react";

import { NEXT_PUBLIC_TEIKI_CDN } from "../../../../config/client";
import { Result } from "../../hooks/useAllPodcasts";

import DropdownSelect from "./components/DropdownSelect";
import PodcastItem from "./components/PodcastItem";
import IconPause from "./icons/IconPause";
import IconPlay from "./icons/IconPlay";
import styles from "./index.module.scss";

import { Podcast } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";

type Props = { title: string; data?: Result; podcastBackground: string };

/**TODO: @sk-tenba: implement this element in small window */

export default function CardPodcast({ title, data, podcastBackground }: Props) {
  const tagList: string[] =
    data?.error !== null
      ? []
      : Array.from(
          new Set(data.data.podcasts.flatMap((podcast) => podcast.pbasics.tags))
        ).sort();
  const router = useRouter();
  const [tagDropdownActive, setTagDropdownActive] = React.useState(false);
  const [tagPrefix, setTagPrefix] = React.useState("");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPodcastId, setCurrentPodcastId] = React.useState(0);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [uncensoredItemIds, setUncensoredItemIds] = React.useState<number[]>(
    []
  );

  function tagsToTitle(selectedTags: string[]) {
    return !selectedTags.length
      ? "No tags selected"
      : selectedTags.length === tagList.length
      ? "All tags selected"
      : `${[...selectedTags].sort()[0]}${
          selectedTags.length > 1 ? ` + ${selectedTags.length - 1}` : ""
        }`;
  }
  const titleDropdown = tagsToTitle(selectedTags);

  if (data === undefined) return null;
  if (data.error !== null) return <>error</>; // TODO: Better error component here
  if (data.data.podcasts.length === 0) return null;

  const filteredPodcasts = data.data.podcasts.filter(
    (podcast) =>
      selectedTags.length === 0 ||
      podcast.pbasics.tags.some((tag: string) => selectedTags.includes(tag))
  );

  function play(id: number) {
    if (data?.error !== null) return;
    const cid = data.data.podcasts.find((podcast) => podcast.id === id)?.cid;
    if (cid == null) return;
    const url = `${NEXT_PUBLIC_TEIKI_CDN}/podcasts/${cid}.wav`;
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error(error));
    }
  }

  function isUncensored(podcast: Podcast) {
    return (
      podcast.censorship == null ||
      // TODO: @sk-umiuma: Remove this filter when the tag is more reliable
      podcast.censorship.filter((value) => value !== "political").length ===
        0 ||
      uncensoredItemIds.includes(podcast.id)
    );
  }

  function findNextPodcastId(id: number): number | undefined {
    let passedCurrentId = false;
    for (const podcast of filteredPodcasts) {
      if (!isUncensored(podcast)) continue;
      if (podcast.id === id) {
        passedCurrentId = true;
        continue;
      }
      if (passedCurrentId) {
        return podcast.id;
      }
    }
    if (passedCurrentId) return undefined;

    return filteredPodcasts.find((podcast) => isUncensored(podcast))?.id;
  }

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${podcastBackground})` }}
    >
      <div className={styles.topContainer}>
        <div className={styles.topLeftContainer}>
          <audio
            ref={audioRef}
            preload="none"
            onEnded={() => {
              const nextPodcastId = findNextPodcastId(currentPodcastId);

              if (nextPodcastId != null) {
                setCurrentPodcastId(nextPodcastId);
                play(nextPodcastId);
              } else {
                setCurrentPodcastId(data.data.podcasts[0].id);
                setIsPlaying(false);
              }
            }}
          />
          <Button.Solid
            className={styles.playButton}
            icon={isPlaying ? <IconPause /> : <IconPlay />}
            onClick={() => {
              if (isPlaying) {
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              } else {
                play(currentPodcastId);
              }
            }}
          />
          <div className={styles.titleContainer}>
            <div className={styles.title}>{title}</div>
            <DropdownSelect
              active={tagDropdownActive}
              label={titleDropdown}
              tagPrefix={tagPrefix}
              onClick={() => setTagDropdownActive(!tagDropdownActive)}
              items={tagList}
              selectedItems={selectedTags}
              onSelectedItemsChange={(newSelectedTags) =>
                setSelectedTags(newSelectedTags)
              }
              onTagPrefixChange={(newTagPrefix: string) =>
                setTagPrefix(newTagPrefix)
              }
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {/* <Button.Solid
            disabled
            icon={<IconDownload />}
            content="Download all podcasts"
            size="medium"
            onClick={() => {
              // TODO: Download all podcasts
            }}
          /> */}
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.podcastContainer}>
          <div style={{ padding: "16px 0px" }}>
            {filteredPodcasts.map((podcast) => (
              <PodcastItem
                key={podcast.id}
                isPlaying={isPlaying && currentPodcastId === podcast.id}
                value={podcast}
                onClick={() => {
                  setCurrentPodcastId(podcast.id);
                  play(podcast.id);
                }}
                onClickViewProject={() =>
                  router.push(`/projects-by-id/${podcast.pid}`)
                }
                uncensored={isUncensored(podcast)}
                onClickUncensor={() =>
                  setUncensoredItemIds([...uncensoredItemIds, podcast.id])
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
