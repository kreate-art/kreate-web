import * as React from "react";

type Props = {
  separator: React.ReactNode;
  children: React.ReactNode[];
};

export default function JoinWithSeparator({ separator, children }: Props) {
  return (
    <>
      {children
        .filter((item) => !!item)
        .map((item, index) => (
          <React.Fragment key={index}>
            {index ? separator : null}
            {item}
          </React.Fragment>
        ))}
    </>
  );
}
