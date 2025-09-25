# Testing

## VSCode

VSCode does not provide the option to automate restarting extensions.

Do the following to build a copy of the plugin and test it:
1. Ensure you have the VSCode Prettier Extension installed.
2. Run "npm run build".
3. Restart Prettier (Ctrl+Shift+P -> Restart Extention Host).
4. Run "npm run format:check" or "npm run format:write" to check/format the codebase.