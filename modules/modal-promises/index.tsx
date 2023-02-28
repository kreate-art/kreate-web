import * as React from "react";

export type RenderFunction<T> = (
  resolve: (value: T) => void,
  reject: (reason: unknown) => void
) => React.ReactNode;

export type ShowModalFunction = <T>(render: RenderFunction<T>) => Promise<T>;

export type ModalPromises = {
  showModal: ShowModalFunction;
};

const defaultModalPromises: ModalPromises = {
  showModal: () => {
    throw new Error("ModalPromisesContext not injected");
  },
};

export const ModalPromisesContext =
  React.createContext<ModalPromises>(defaultModalPromises);

export function useModalPromises() {
  return React.useContext(ModalPromisesContext);
}

export function withModalPromises<P>(WrappedComponent: React.ComponentType<P>) {
  const WithModalPromises: React.ComponentType<P> = (props: P) => {
    const [nextId, setNextId] = React.useState(0);
    const [nodes, setNodes] = React.useState<Record<number, React.ReactNode>>(
      {}
    );

    const setNode = (id: number, node: React.ReactNode) => {
      setNodes((obj) => ({ ...obj, [id]: node }));
    };

    const showModal: ShowModalFunction = function <T>(
      render: RenderFunction<T>
    ) {
      return new Promise<T>((resolve, reject) => {
        const id = nextId;
        const node = render(
          (value) => {
            setNode(id, null);
            resolve(value);
          },
          (reason) => {
            setNode(id, null);
            reject(reason);
          }
        );
        setNextId((value) => value + 1);
        setNode(id, node);
      });
    };

    return (
      <ModalPromisesContext.Provider value={{ showModal }}>
        <WrappedComponent key={"@"} {...props} />
        {Object.entries(nodes).map(([id, node]) => (
          <React.Fragment key={id}>{node}</React.Fragment>
        ))}
      </ModalPromisesContext.Provider>
    );
  };
  WithModalPromises.displayName = `WithModalPromises(${
    WrappedComponent.displayName || "WrappedComponent"
  })`;
  return WithModalPromises;
}
