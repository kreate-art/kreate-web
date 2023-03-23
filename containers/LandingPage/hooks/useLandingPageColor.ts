import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";

export function useLandingPageColor() {
  useBodyClasses([styles.landingPageColor]);
}
