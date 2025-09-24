/**
 * To avoid having to pull in '@babel/core' to load options, gather
 * options from '@babel/core/lib/config/files/configuration.js'
 */

// BEGIN '@babel/core/lib/config/files/configuration.js'

const ROOT_CONFIG_FILENAMES = /*exports.ROOT_CONFIG_FILENAMES =*/ ["babel.config.js", "babel.config.cjs", "babel.config.mjs", "babel.config.json", "babel.config.cts", "babel.config.ts", "babel.config.mts"];
const RELATIVE_CONFIG_FILENAMES = [".babelrc", ".babelrc.js", ".babelrc.cjs", ".babelrc.mjs", ".babelrc.json", ".babelrc.cts"];

// END '@babel/core/lib/config/files/configuration.js'

export const BABEL_CONFIG_FILENAMES = [...ROOT_CONFIG_FILENAMES, ...RELATIVE_CONFIG_FILENAMES];