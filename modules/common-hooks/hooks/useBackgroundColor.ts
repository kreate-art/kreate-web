import * as React from "react";

/**
 * Sets `document.body.style.backgroundColor` to the desired color
 * and restores the original value when the component is unmounted.
 */
export default function useBackgroundColor(color: string) {
  React.useEffect(() => {
    const oldColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = oldColor;
    };
  }, [color]);
}
