import { cleanup } from "@marko/testing-library";
import { afterEach } from "vitest";

// @marko/testing-library only auto-registers its cleanup when a GLOBAL
// afterEach exists (see its `typeof afterEach === "function"` check), and
// vitest globals are off here so that test files import what they use.
// Without this, every render in a file stays mounted and the next query
// finds two of everything.
afterEach(cleanup);
