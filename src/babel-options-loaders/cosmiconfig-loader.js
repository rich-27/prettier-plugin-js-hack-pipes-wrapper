import { cosmiconfigSync, defaultLoadersSync } from 'cosmiconfig';
import { BABEL_CONFIG_FILENAMES } from './babel-config-filenames.js';
import { BABEL_PLUGIN_NAME } from './pipeline-plugin-info.js';

export class CosmiconfigLoader {
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