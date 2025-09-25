# Testing

## Standard Configuration

### Via API

Run /test/format.js

### Via CLI

Do the following to build a copy of the plugin and test it:

1. Run `npm run build`.
2. Run `npm run format:check` or `npm run format:write` to check/format the codebase.

### Via VSCode Prettier Extension

To manually test formatting:

1. Ensure you have the VSCode Prettier Extension installed.
2. Run `npm run build`.

> [!NOTE]
> The VSCode Prettier Extension will pick up the .prettierrc config and point to the built plugin, but it needs to be refreshed to pull in the new copy. VSCode does not provide the option to automate restarting extensions, so this must be done via the following command.

2. Restart Prettier (`Ctrl+Shift+P` -> `Restart Extention Host`).

3. Format `/test/test-code.js` (`Ctrl+Shift+P` -> `Format Document`).

## Using other loading methods

To use `loadOptions` or `loadPartialConfig` from `@babel/core` to source the Babel configuration, replace `import { CosmiconfigLoader as BabelOptionsLoader } from './babel-options-loaders/cosmiconfig-loader.js';` in `plugin.js` with `import { BabelLoadOptionsLoader as BabelOptionsLoader } from './babel-options-loaders/babel-loaders.js';` or `import { BabelLoadPartialConfigLoader as BabelOptionsLoader } from './babel-options-loaders/babel-loaders.js';` respectively.

Proceed following the steps from [Standard Configuration](#standard-configuration).

> [!NOTE]
> When debugging, ensure the debugger skips "\*\*/node_modules/@babel/template/\*\*" when retrieving files, otherwise Babel's config loading/error handling will fail.
