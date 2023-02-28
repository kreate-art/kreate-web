import TagSocialMedia from "./TagSocialMedia";

type Props = {
  listSocialMedia: string[];
  projectLink: string;
};

export default function TagSocialMediaWrapper({
  listSocialMedia,
  projectLink,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "36px" }}>
      <>
        {listSocialMedia.map((socialMedia, key) => (
          <TagSocialMedia
            socialMedia={socialMedia}
            projectLink={projectLink}
            key={key}
          />
        ))}
      </>
    </div>
  );
}
