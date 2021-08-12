module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "next"
  ],
  plugins: ["@typescript-eslint", "react"],
  env: {
    browser: true,
    node: true,
    es2021: true,
    serviceworker: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021
  },
  settings: { react: { version: "detect" } },
  rules: {
    semi: ["error", "always"],
    curly: ["error", "multi-line", "consistent"],
    "default-case-last": "error",
    "dot-location": ["error", "property"],
    "dot-notation": ["error", { allowPattern: "^[a-z]+([-_][a-z]+)+$" }],
    eqeqeq: ["error", "always"],
    "no-alert": "error",
    "no-constructor-return": "error",
    "no-eval": "error",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "warn",
    "no-invalid-this": "error",
    "no-multi-spaces": "error",
    "no-labels": "warn",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-str": "error",
    "no-new": "off",
    "no-new-func": "error",
    "no-new-wrappers": "warn",
    "no-param-reassign": ["error", { props: false }],
    "no-return-assign": ["error", "always"],
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-unused-expressions": "warn",
    "no-useless-call": "error",
    "no-useless-catch": "error",
    "no-useless-concat": "error",
    "no-useless-escape": "warn",
    "no-useless-return": "error",
    "no-void": "error",
    "no-with": "error",
    yoda: ["error", "never"],
    "no-undef-init": "error",
    "no-undefined": "error",
    "no-use-before-define": "off",
    "array-bracket-newline": ["warn", "consistent"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    camelcase: [
      "warn",
      {
        properties: "never",
        ignoreImports: false
      }
    ],
    "comma-dangle": ["error", "never"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "eol-last": ["error", "always"],
    "func-call-spacing": ["error", "never"],
    "func-name-matching": "warn",
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": "off",
    "implicit-arrow-linebreak": "off",
    "indent": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
        mode: "strict"
      }
    ],
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true
      }
    ],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["error", "never"],
    "max-len": [
      "error",
      {
        code: 140,
        ignoreTrailingComments: true,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    "new-parens": ["error", "always"],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 5 }],
    "no-empty": [
      "error",
      { allowEmptyCatch: true }
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 3,
        maxEOF: 0
      }
    ],
    "no-nested-ternary": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": "off",
    "object-curly-newline": ["error", { multiline: true }],
    "object-curly-spacing": ["error", "always"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "semi-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "sort-vars": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "space-in-parens": ["error", "never"],
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": "error",
    "no-var": "error",
    "array-element-newline": ["error", "consistent"],
    "react/jsx-indent": ["error", 2],
    "no-empty-function": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-use-before-define": ["error"]
  }
};
