import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  {
    settings: {
      react: { version: "detect" } // Убирает предупреждение "React version not specified"
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-namespace": [
        "error",
        {
          "allowDeclarations": true
        }
      ]
    }
  }
]);