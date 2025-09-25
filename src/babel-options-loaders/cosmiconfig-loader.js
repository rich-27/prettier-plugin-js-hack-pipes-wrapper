import { cosmiconfigSync, defaultLoadersSync } from 'cosmiconfig';
import { BABEL_CONFIG_FILENAMES } from './babel-config-filenames.js';
import { BABEL_PLUGIN_NAME } from './pipeline-plugin-info.js';
import { BabelOptionsLoader } from './base-loader.js';

export class CosmiconfigLoader extends BabelOptionsLoader {
  _getBabelOptions() {
    const babelConfig = cosmiconfigSync('babel', {
      searchStrategy: 'global',
      searchPlaces: BABEL_CONFIG_FILENAMES,
      loaders: {
        '.mjs': defaultLoadersSync['.js'],
        '.cts': defaultLoadersSync['.ts'],
        '.mts': defaultLoadersSync['.ts'],
      },
    }).search(this.searchFromPath);

    return babelConfig?.config ?? { plugins: [] };
  }

  _extractPluginOptions({ plugins }) {
    const [_, pluginOptions] =
      plugins.find(([name]) => name === BABEL_PLUGIN_NAME) ?? [];
    return pluginOptions;
  }
}
