import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksExtra from "eslint-plugin-react-hooks-extra";
import { ESLINT_IGNORE_PATTERNS } from "@silverassist/next-testing-toolkit";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks-extra": reactHooksExtra,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    ignores: [
      // Fixture, build-output and generated-file globs come from the harness
      // itself, so a change there (a new generated file, say) reaches every
      // consumer without editing this list.
      ...ESLINT_IGNORE_PATTERNS,
      "node_modules/**",
    ],
  },
);
