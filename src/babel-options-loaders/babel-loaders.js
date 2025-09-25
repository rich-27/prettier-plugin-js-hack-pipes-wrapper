import { loadOptions, loadPartialConfig } from '@babel/core';
import { BABEL_PLUGIN_KEY, BABEL_PLUGIN_NAME } from './pipeline-plugin-info.js';
import { BabelOptionsLoader } from './base-loader.js';

export class BabelLoadOptionsLoader extends BabelOptionsLoader {
  _getBabelOptions() {
    return loadOptions({ cwd: this.searchFrom });
  }

  _extractPluginOptions({ plugins }) {
    return plugins.find(({ key }) => key === BABEL_PLUGIN_KEY)?.options;
  }
}

export class BabelLoadPartialConfigLoader extends BabelOptionsLoader {
  _getBabelOptions() {
    return loadPartialConfig({ cwd: this.searchFrom }).options;
  }

  _extractPluginOptions({ plugins }) {
    return plugins.find(
      ({ file }) =>
        file?.request === BABEL_PLUGIN_NAME ||
        new RegExp(BABEL_PLUGIN_NAME).test(file?.resolved),
    )?.options;
  }
}