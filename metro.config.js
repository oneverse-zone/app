/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultValues } = require("metro-config/src/defaults");
const { resolver: { sourceExts } } = getDefaultValues();

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // 增加cjs和mjs支持
    sourceExts: [...sourceExts, "cjs", "mjs"],
  },
};
