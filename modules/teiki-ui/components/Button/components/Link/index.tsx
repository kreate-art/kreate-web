import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  buttonRef?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A button that looks like a link.
 *
 * @experimental
 */
function Link$({
  className,
  style,
  content,
  children,
  buttonRef,
  ...others
}: Props) {
  const displayedContent = children || content;
  return (
    <button
      // NOTE: from @sk-kitsune: it is totally fine to pass `ref={buttonRef}`
      // because `HTMLElement` is a super class of both `HTMLDivElement`
      // and `HTMLButtonElement`.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={buttonRef as any}
      className={cx(styles.container, className)}
      style={style}
      type="button"
      {...others}
    >
      {displayedContent}
    </button>
  );
}

const Link = React.forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Link$ buttonRef={ref} {...props} />
));

Link.displayName = "Link";

export default Link;
