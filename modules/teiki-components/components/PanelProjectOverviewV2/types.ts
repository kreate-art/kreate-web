export type Options = {
  buttonBackProject: {
    visible: boolean;
    isBacking: boolean;
    disabled: boolean;
    priority?: boolean; // priority: true suggests that the button should be visible outside the ellipsis button
    onClick?: () => void;
  };
  buttonUpdateProject: {
    visible: boolean;
    disabled: boolean;
    priority?: boolean; // priority: true suggests that the button should be visible outside the ellipsis button
    onClick?: () => void;
  };
  buttonShare: {
    visible: boolean;
    disabled: boolean;
    priority?: boolean; // priority: true suggests that the button should be visible outside the ellipsis button
    onClick?: () => void;
  };
  buttonPostUpdate: {
    visible: boolean;
    disabled: boolean;
    priority?: boolean; // priority: true suggests that the button should be visible outside the ellipsis button
    onClick?: () => void;
  };
  buttonCloseProject: {
    visible: boolean;
    disabled: boolean;
    priority?: boolean; // priority: true suggests that the button should be visible outside the ellipsis button
    onClick?: () => void;
  };
};
