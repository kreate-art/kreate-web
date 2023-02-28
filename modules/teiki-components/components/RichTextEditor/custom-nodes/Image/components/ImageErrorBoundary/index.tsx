import React from "react";

import IconFileClose from "../../icons/IconFileClose";

import styles from "./index.module.scss";

import { writeErrorToConsole } from "@/modules/displayable-error";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export class ImageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    writeErrorToConsole(error);
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    writeErrorToConsole(error);
  }

  render() {
    if (this.state.hasError) {
      return <IconFileClose className={styles.icon} />;
    }

    return this.props.children;
  }
}
