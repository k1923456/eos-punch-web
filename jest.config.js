module.exports = {
  verbose: true,
  setupFiles: ['<rootDir>/.storybook/register-context.js'],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy"
  }
};