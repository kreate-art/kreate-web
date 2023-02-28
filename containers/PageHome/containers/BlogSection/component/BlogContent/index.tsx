import cx from "classnames";
import moment from "moment";
import * as React from "react";

import { BlogSection } from "../../types";

import IconArrow from "./icons/IconArrow";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  blog: BlogSection;
  className?: string;
  style?: React.CSSProperties;
};

const BlogContent = ({ blog, className, style }: Props) => {
  return (
    <div className={cx(className, styles.container)} style={style}>
      <div
        className={styles.cover}
        style={{
          backgroundImage: `url(${blog.picture.src})`,
          backgroundSize: "cover",
        }}
      />
      <div className={styles.contentContainer}>
        <Title className={styles.title} size="h3" color="ink100">
          {blog.title}
        </Title>
        <div className={styles.createdAt}>
          <span className={styles.posted}>Posted on </span>
          <span className={styles.dayPosted}>
            {moment(blog.createdAt).format("DD MMMM YYYY")}
          </span>
        </div>
        <div className={styles.articleDescription}>{blog.description}</div>
        <Button.Outline
          className={styles.learnMoreButton}
          icon={<IconArrow />}
          onClick={() => window.open(blog.url, "_blank")}
          content="Read More"
        />
      </div>
    </div>
  );
};

export default BlogContent;
