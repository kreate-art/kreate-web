import * as Toast from "@radix-ui/react-toast";
import cx from "classnames";
import React from "react";

import IconClose from "./icons/IconClose";
import styles from "./index.module.scss";

type ToastInterface = {
  alert: (message: string) => void;
  showMessage: (params: ToastData$Message) => void;
};

const defaultValue$ToastContext: ToastInterface = {
  alert: (message) => globalThis.alert(message),
  showMessage: (params) =>
    globalThis.alert(params.title + "\n\n" + params.description),
};

export const ToastContext = React.createContext<ToastInterface>(
  defaultValue$ToastContext
);

export function useToast() {
  return React.useContext(ToastContext);
}

// https://getbootstrap.com/docs/5.3/customize/color/
const COLOR_TO_CLASS_NAME = {
  info: styles.colorInfo,
  warning: styles.colorWarning,
  success: styles.colorSuccess,
  danger: styles.colorDanger,
};

type ToastData$Alert = { message: string };

type ToastData$Message = {
  color?: keyof typeof COLOR_TO_CLASS_NAME;
  title?: string;
  description?: string;
  // icon?: "info" | "warning" | "success" | "danger";
  // buttons?: { label: string; onClick?: () => void; }[];
};

type ToastData =
  | ({ type: "alert" } & ToastData$Alert)
  | ({ type: "message" } & ToastData$Message);

export function withToastContext<P>(WrappedComponent: React.ComponentType<P>) {
  const WithToastContext: React.ComponentType<P> = (props: P) => {
    const [toastItems, setToastItems] = React.useState<
      Record<number, ToastData | undefined>
    >({});

    const addToastItem = (toastItem: ToastData) => {
      const id = Date.now();
      setToastItems((obj) => ({ ...obj, [id]: toastItem }));
    };

    const alert = (message: string) => {
      addToastItem({ type: "alert", message });
    };

    const showMessage = (params: ToastData$Message) => {
      addToastItem({ type: "message", ...params });
    };

    return (
      <ToastContext.Provider value={{ alert, showMessage }}>
        <Toast.Provider>
          <WrappedComponent key="" {...props} />
          <Toast.Viewport className={styles.toastViewport} />
          {Object.entries(toastItems).map(([id, toastItem]) => {
            switch (toastItem?.type) {
              case "alert":
                return (
                  <Toast.Root key={id} className={styles.toastRoot}>
                    <Toast.Description>{toastItem.message}</Toast.Description>
                  </Toast.Root>
                );
              case "message":
                return (
                  <Toast.Root
                    key={id}
                    className={cx(
                      styles.toastRoot,
                      toastItem.color
                        ? COLOR_TO_CLASS_NAME[toastItem.color]
                        : null
                    )}
                  >
                    {toastItem.title ? (
                      <Toast.Title className={styles.toastTitle}>
                        {toastItem.title}
                      </Toast.Title>
                    ) : null}
                    {toastItem.description ? (
                      <Toast.Description className={styles.toastDescription}>
                        {toastItem.description}
                      </Toast.Description>
                    ) : null}
                    <Toast.Close className={styles.toastClose}>
                      <IconClose />
                    </Toast.Close>
                  </Toast.Root>
                );
              default:
                return null;
            }
          })}
        </Toast.Provider>
      </ToastContext.Provider>
    );
  };

  WithToastContext.displayName = `WithToastContext(${
    WrappedComponent.displayName || "..."
  })`;

  return WithToastContext;
}
