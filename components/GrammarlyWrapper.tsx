import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import * as React from "react";

import { NEXT_PUBLIC_GRAMMARLY_CLIENT_ID } from "../config/client";

type Props = {
  children: React.ReactNode;
};

const GrammarlyWrapper = ({ children }: Props) => {
  return (
    <GrammarlyEditorPlugin clientId={NEXT_PUBLIC_GRAMMARLY_CLIENT_ID}>
      {children}
    </GrammarlyEditorPlugin>
  );
};

export default GrammarlyWrapper;
