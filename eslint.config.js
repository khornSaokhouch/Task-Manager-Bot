// eslint.config.cjs
module.exports = [
    {
      files: ["*.js"],
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: "script",
      },
      rules: {
        // Add custom rules here if needed
      },
      globals: {
        NodeJS: "readonly",
      },
    },
  ];
  