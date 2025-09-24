import * as path from 'node:path';
import { BabelOptionsLoader } from './babel-options-loader.js';
import { babel as defaultParser } from '../vendor/prettier/src/language-js/parse/babel.js';
import {
  babel as wrappedParser,
  getBabelParserTopicToken as getWrappedParserTopicToken,
  setBabelParserTopicToken as setWrappedParserTopicToken,
} from './babel-wrapper.js';
import * as estreePrinter from '../vendor/prettier/src/language-js/printer.js';
import { default as originalPrint } from '../vendor/prettier/src/language-js/print/index.js';

export const languages = [
  {
    name: 'JavaScript',
    parsers: ['|>-babel-wrapper'],
    extensions: ['.js'],
  },
];

export const parsers = {
  '|>-babel-wrapper': {
    ...defaultParser,
    parse: function (text, options) {
      const babelOptionsLoader = new BabelOptionsLoader(
        options.filepath ?? path.resolve('./'),
      );

      // Set this to pass it to the printer
      // Use the prettier default topic token ('%') if we can't get one from a babel config
      options.hackPipeTopicToken =
        babelOptionsLoader.getTopicToken() ?? getWrappedParserTopicToken();

      // Inject the found token into the plugin's 'babel' parser instance
      setWrappedParserTopicToken(options.hackPipeTopicToken);

      return wrappedParser.parse(text, options);
    },
    astFormat: '|>-wrapped-ast',
  },
};

export const printers = {
  '|>-wrapped-ast': {
    ...estreePrinter,
    print: function (path, options, print, args) {
      if (path.node.type === 'TopicReference') {
        return options.hackPipeTopicToken;
      }
      return originalPrint(path, options, print, args);
    },
  },
};
