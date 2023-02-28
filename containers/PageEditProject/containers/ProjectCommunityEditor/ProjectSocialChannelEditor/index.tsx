import * as React from "react";

import { getUrlInfo } from "../helper/findURL";

import IconClose from "./components/IconClose";
import IconPlus from "./components/IconPlus";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Input from "@/modules/teiki-ui/components/Input";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  value: string[];
  onChange: (newValue: string[]) => void;
};
export default function ProjectSocialChannelEditor({ value, onChange }: Props) {
  const [url, setUrl] = React.useState("");

  const handleAdd = () => {
    if (url) {
      onChange([...value, url]);
      setUrl("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography.Div>
          <Typography.Span content="Social Channel" size="heading5" />
          <Typography.Span
            size="bodyExtraSmall"
            className={styles.titleMessage}
            content="You must list at least one social media"
          />
        </Typography.Div>
      </div>
      {value.length > 0 ? (
        <div className={styles.socialList}>
          {value.map((url, index) => {
            const urlInfo = getUrlInfo(url);
            return (
              <div key={index} className={styles.social}>
                <div className={styles.iconUrl}>{urlInfo.icon}</div>
                <div className={styles.prefixUrl}>
                  {urlInfo.prefixUrl !== "" ? urlInfo.prefixUrl + "/" : ""}
                </div>
                <div>{getUrlInfo(url).name}</div>
                <div className={styles.closeButton}>
                  <button
                    onClick={() => {
                      const indexToDelete = index;
                      onChange(value.filter((_, i) => i !== indexToDelete));
                    }}
                    className={styles.buttonSocial}
                  >
                    <IconClose />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <Input
        placeholder="Enter Social URL"
        value={url}
        onChange={(value) => {
          setUrl(value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            handleAdd();
          }
        }}
        className={styles.inputBox}
        rightSlot={
          <div className={styles.addButtonWrapper}>
            <Button.Solid
              content="Add"
              icon={<IconPlus />}
              onClick={handleAdd}
              size="small"
              className={styles.addButton}
            />
          </div>
        }
      />
    </div>
  );
}
