module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "plugin:json/recommended", "prettier"],

  parserOptions: {
    ecmaVersion: 12,
  },
  parser: "babel-eslint",
  rules: {
    "comma-dangle": "off",
    "space-before-function-paren": "off",
  },
};
