module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // 如果你已經有其他 plugin，請確保 reanimated 放在最後一個
    plugins: ["react-native-reanimated/plugin"],
  };
};