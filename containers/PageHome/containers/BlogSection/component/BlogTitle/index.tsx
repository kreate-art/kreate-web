import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlogTitle = ({ className, style }: Props) => {
  return (
    <div className={className} style={style}>
      <div className={styles.container}>
        <div className={styles.title}>Blog</div>
      </div>
    </div>
  );
};

export default BlogTitle;
