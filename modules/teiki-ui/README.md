# `@/modules/teiki-ui`

This module contains UI components which are:

- usually at the "atom" level (buttons, inputs, etc),
- not Teiki-specific,
- used in various places around the website.

## What are included and what are not?

**Decision tree**

1. Is this component found in another UI library (e.g. Semantic UI, MUI)?

- If yes, put it in this module.

2. Is this component used at only one place?

- If yes, don't put it in this module. Consider to put it in a subfolder where it is used.

3. Is this component Teiki-specific?

- If yes, don't put it in this module. Consider to put it in `@/modules/teiki-components/`.

- If no, it may be put under this module.

**Examples**

- Button
- Input
- Heading
- Dropdown

**Counter-examples**

- ButtonConnectWallet
- InputSearch
