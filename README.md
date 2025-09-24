# Patching JS Hack Pipes in Prettier &nbsp;[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`prettier-plugin-js-hack-pipes-wrapper` is a [Prettier](https://prettier.io/) plugin that enables formatting using JavaScript's proposed Hack pipe operator with the topic token specified in your Babel configuration.

## The Problem

Prettier's built-in JavaScript parser hardcodes the pipeline operator topic token to `%`. The token is still to be determined, as of September 2025. `@babel/plugin-proposal-pipeline-operator` allows for the configuration of the topic token. When using a non-default topic token, Prettier fails to parse and format the code correctly, raising the following syntax error:

```
SyntaxError: Invalid topic token {token}. In order to use {token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "{token}" }
```

Prettier does not expose a pipelineOperator plugin nor provide the ability to configure it.

## How it works

This plugin:
1. Attempts to read your Babel configuration to detect the configured topic token
2. Wraps Prettier's `babel` JS parser, replacing the topic token for AST generation
3. Wraps Prettier's `estree` printer to print the AST with with the correct topic token

As of mid 2025, `#` seems to be the most promising candidate for the operator's topic token (see [Bikeshedding on the wiki](https://github.com/tc39/proposal-pipeline-operator/wiki/Bikeshedding-the-Hack-topic-token) and [Bikeshedding discussion](https://github.com/tc39/proposal-pipeline-operator/issues/91#issuecomment-2784940602)), hence its use subsequent use in this readme.

## Installation

The following is a placeholder, currently the plugin only supports [being run locally via relative resolution](https://prettier.io/docs/plugins#testing-plugins).

```bash
npm install --save-dev prettier-plugin-js-hack-pipes-wrapper
```

## Usage

The following is a placeholder, currently the plugin only supports [being run locally via relative resolution](https://prettier.io/docs/plugins#testing-plugins).


### Via Configuration File

```json
{
  "plugins": ["prettier-plugin-js-hack-pipes-wrapper"]
}
```

### Via CLI

```bash
prettier --write --plugin=prettier-plugin-js-hack-pipes-wrapper "**/*.js"
```

### Via API

```javascript
import prettier from 'prettier';

const formatted = await prettier.format(code, {
  parser: '|>-babel-wrapper',
  printer: '|>-wrapped-ast',
  plugins: ['prettier-plugin-js-hack-pipes-wrapper'],
});
```

## Configuration

### Babel Configuration

Configure the pipeline operator plugin in your Babel config with your preferred topic token:

```json
{
  "plugins": [
    [
      "@babel/plugin-proposal-pipeline-operator",
      { "proposal": "hack", "topicToken": "#" }
    ]
  ]
}
```

### Supported Topic Tokens

The plugin supports any topic token that Babel's pipeline operator plugin accepts:
- `%` (default)
- `^^`
- `@@`
- `^`
- `#`

## Examples

**Input:**
```javascript
'Pipeline operator test' |> #.length |> console.log(#);
```

**Formatted output:**
```javascript
'Pipeline operator test' |> #.length |> console.log(#);
```

## Babel Configuration Loading

The plugin has three potential methods for attempting to load the relevant Babel configuration file. See `/src/babel-options-loader` for an explanation.

If no Babel configuration is found or no pipeline operator plugin is configured, the plugin falls back to Prettier's default `%` topic token.

## Compatibility

- **Prettier**: tested with 3.6.2
- **Babel**: tested with 7.28.4

## Architecture

This plugin vendors specific portions of Prettier's source code via git submodules to modifiy Prettier's 'babel' JavaScript parser and 'estree' printer with minimal changes. This approach:

- Makes the required changes explicit and demonstrable
- Provides a working solution for reference in discussion about/proposal for Prettier contribution

## Known Issues

- Currently only supports `.js` files
- Currently reads the babel configuration during each parse:
  - What is the best way to cache this information?
  - Is it possible to gain access to the codebase's working directory at initialisation?
  - Could a user have multiple babel configurations in different parts of their project that would need separate handling?
    - Would this indicate it is better to depend on babel for config parsing?
- No bundling/packaging at this stage, must be run locally
- Minimal tests and verification at this stage

## Related

- [TC39 Pipeline Operator Proposal](https://github.com/tc39/proposal-pipeline-operator)
- [@babel/plugin-proposal-pipeline-operator](https://babeljs.io/docs/babel-plugin-proposal-pipeline-operator)
- [Prettier Plugin API](https://prettier.io/docs/plugins.html)

## License

MIT