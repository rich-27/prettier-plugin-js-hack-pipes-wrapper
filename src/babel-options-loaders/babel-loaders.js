import { loadOptions, loadPartialConfig } from '@babel/core';
import { BABEL_PLUGIN_KEY, BABEL_PLUGIN_NAME } from './pipeline-plugin-info.js';

export class BabelLoadOptionsLoader {
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

export class BabelLoadPartialConfigLoader {
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