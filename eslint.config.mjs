import react from "@silverassist/npm-package-standards/eslint/react";
import { ESLINT_IGNORE_PATTERNS } from "@silverassist/next-testing-toolkit";
import reactHooksExtra from "eslint-plugin-react-hooks-extra";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...react,
  {
    files: ["**/*.tsx"],
    plugins: {
      "react-hooks-extra": reactHooksExtra,
    },
  },
  {
    ignores: [...ESLINT_IGNORE_PATTERNS, "node_modules/**"],
  },
);
