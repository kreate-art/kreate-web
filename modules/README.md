# `modules/`

This folder contains modules, where each module is a package-like folder.

## Rules

Treat modules like packages:

- When a file imports another file within the same module, use relative
  paths, e.g. `from "../utils"`.
- When a file imports another file in a different module, use absolute
  paths starting with `@`, e.g. `from "@/modules/foo"`.
- A file in a module cannot import files outside `modules/` folder.
- When a file outside `modules/` folder imports another file in `modules/`,
  use absolute paths starting with `@`, e.g. `from "@/modules/foo"`.
