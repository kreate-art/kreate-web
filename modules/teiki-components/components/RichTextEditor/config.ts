import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

import CustomNodes from "./custom-nodes";

export const editorExtensions = [
  StarterKit,
  // tiptap extensions
  Color,
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right"],
  }),
  TextStyle,
  Link,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  // our own extensions
  CustomNodes.Image,
  CustomNodes.Video,
];
