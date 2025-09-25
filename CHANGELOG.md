# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2025-09-25

### Added

- Bundling with rollup
- Test instructions
- @eslint/js recommended config with pattern exclusions and globals
- LICENSE

### Changed

- Refactored Babel config loading to enable bundle tree shaking

### Removed

- Plugin default export

## [0.1.1] - 2025-09-24

### Added

- This CHANGELOG

## [0.1.0] - 2025-09-24

### Added

- Source code:
  - The plugin
  - A babel config loader
  - A wrapped version of prettier's 'babel' parser
- Vendor code:
  - Prettier's 'babel' parser, 'estree' printer, and dependencies
- Configuration files for babel, eslint, and prettier
- A README

[unreleased]: https://github.com/rich-27/prettier-plugin-js-hack-pipes-wrapper/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/rich-27/prettier-plugin-js-hack-pipes-wrapper/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/rich-27/prettier-plugin-js-hack-pipes-wrapper/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/rich-27/prettier-plugin-js-hack-pipes-wrapper/releases/tag/v0.1.0
