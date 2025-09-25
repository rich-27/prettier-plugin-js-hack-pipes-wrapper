import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * This is the base class for three loaders, each a different method of getting Babel config that exposes
 * plugin configuration in different formats, hence needing three separate loader implementations.
 *
 * Option 1, BabelLoadOptionsLoader:
 *  @babel/core -> loadOptions()
 *  - Probably way overkill for what we need, but would be the most robust to what the user is actually
 *    transpiling their code with.
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

export class BabelOptionsLoader {
  constructor(searchFromPath) {
    this.searchFromPath = this.#getDirectory(searchFromPath);
  }

  getTopicToken() {
    return this._extractPluginOptions(this._getBabelOptions())?.topicToken;
  }

  /**
   * Find babel options
   * @returns {{ plugins: unknown[] }}
   */
  _getBabelOptions() {
    throw new Error('Subclass must implement _getBabelOptions()');
  }

  /**
   * Extract topic token from babel options
   * @param {object} babelOptions
   * @param {unknown[]} babelOptions.plugins
   */
  // eslint-disable-next-line no-unused-vars
  _extractPluginOptions({ plugins }) {
    throw new Error(
      `Subclass must implement _extractPluginOptions({ plugins })`,
    );
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
}
