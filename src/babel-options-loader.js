import * as fs from 'node:fs';
import * as path from 'node:path';
import { loadOptions, loadPartialConfig } from '@babel/core';
import { cosmiconfigSync, defaultLoadersSync } from 'cosmiconfig';
import { BABEL_CONFIG_FILENAMES } from './babel-config-filenames.js';

const BABEL_PLUGIN_KEY = 'proposal-pipeline-operator';
const BABEL_PLUGIN_NAME = `@babel/plugin-${BABEL_PLUGIN_KEY}`;

/**
 * Each of the three methods below of getting Babel config exposes plugin configuration
 * in different formats, hence needing three separate loader implementations.
 *
 * Option 1, BabelLoadOptionsLoader:
 *  @babel/core -> loadOptions()
 *  - Probably way overkill for what we need, but would be the most robust to what the user is actually transpiling their code with.
 *  - Gets icky, messing around in babel's live configuration, especially if this happens to be the same
 *    instantiation running the transpilation of the user's project.
 *  - Surprisingly, actually the simplest to access.
 *
 * Option 2, BabelLoadPartialConfigLoader:
 *  @babel/core -> loadPartialConfig()
 *  - Also adds a direct dependency on @babel/core.
 *    It's a shame there isn't a lightweight config grabber module for babel, something like @babel/config
 *
 * Option 3, CosmiconfigLoader, default:
 *  - Parse directly using cosmiconfig
 *  - Probably the best way
 *    + No dependency on full babel
 *    - Means we're reimplementing babel config parsing, which isn't ideal
 *  - Uses search strategy and search places derived from babel's source code (as of @babel/core@7.28.4)
 */

class BabelLoadOptionsLoader {
  static getTopicToken(searchFrom) {
    return BabelLoadOptionsLoader.#extractTopicToken(
      loadOptions({ cwd: searchFrom }),
    );
  }

  static #extractTopicToken({ plugins }) {
    return plugins.find(({ key }) => key === BABEL_PLUGIN_KEY)?.options
      ?.topicToken;
  }
}

class BabelLoadPartialConfigLoader {
  static getTopicToken(searchFrom) {
    return BabelLoadPartialConfigLoader.#extractTopicToken(
      loadPartialConfig({ cwd: searchFrom }).options,
    );
  }

  static #extractTopicToken({ plugins }) {
    return plugins.find(
      ({ file }) =>
        file?.request === BABEL_PLUGIN_NAME ||
        new RegExp(BABEL_PLUGIN_NAME).test(file?.resolved),
    )?.options?.topicToken;
  }
}

class CosmiconfigLoader {
  static getTopicToken(searchFrom) {
    const babelConfig = cosmiconfigSync('babel', {
      searchStrategy: 'global',
      searchPlaces: BABEL_CONFIG_FILENAMES,
      loaders: {
        '.mjs': defaultLoadersSync['.js'],
        '.cts': defaultLoadersSync['.ts'],
        '.mts': defaultLoadersSync['.ts'],
      },
    }).search(searchFrom);
    return CosmiconfigLoader.#extractTopicToken(
      babelConfig?.config ?? { plugins: [] },
    );
  }

  static #extractTopicToken({ plugins }) {
    return plugins.find(([name]) => name === BABEL_PLUGIN_NAME)?.[1]
      ?.topicToken;
  }
}

export class BabelOptionsLoader {
  static Sources = Object.freeze({
    BABEL_LOAD_OPTIONS: 'loadOptions',
    BABEL_LOAD_PARTIAL_CONFIG: 'loadPartialConfig',
    COSMICONFIG: 'cosmiconfig',
  });

  #source;

  constructor(searchFromPath, source = BabelOptionsLoader.Sources.COSMICONFIG) {
    this.searchFromPath = this.#getDirectory(searchFromPath);
    this.#source = this.#resolveSource(source);
  }

  getTopicToken() {
    return this.#source.getTopicToken(this.searchFromPath);
  }

  #getDirectory(fileOrDirectoryPath) {
    const resolvedPath = path.resolve(path.normalize(fileOrDirectoryPath));

    let isDirectory;
    try {
      isDirectory = fs.lstatSync(resolvedPath).isDirectory();
    } catch {
      /**
       * lstat failed, assume it's a directory (avoids pruning the directory off the end) and hand it off to cosmiconfig/babel.
       * They'll give more specific errors if it doesn't work as the searchFrom or cwd parameters.
       */
      return resolvedPath;
    }

    if (isDirectory) {
      return resolvedPath;
    } else {
      return path.dirname(resolvedPath);
    }
  }

  #resolveSource(source) {
    switch (source) {
      case BabelOptionsLoader.Sources.BABEL_LOAD_OPTIONS:
        return BabelLoadOptionsLoader;
      case BabelOptionsLoader.Sources.BABEL_LOAD_PARTIAL_CONFIG:
        return BabelLoadPartialConfigLoader;
      default:
        return CosmiconfigLoader;
    }
  }
}
