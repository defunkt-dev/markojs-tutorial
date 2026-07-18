import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", ".marko-run/"] },

  // ESLint cannot parse TypeScript on its own; typescript-eslint gives it
  // the parser. This lints your .ts files -- handlers, helpers, tests.
  // Nothing here lints .marko: no ESLint parser for templates exists.
  // Templates belong to the language server and to mtc.
  ...tseslint.configs.recommended,

  // Marko-aware linting for TEST files, from eslint-plugin-testing-library.
  {
    files: ["**/*.test.ts"],
    ...testingLibrary.configs["flat/marko"],
  },
);
