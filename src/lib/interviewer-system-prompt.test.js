import assert from "node:assert/strict";
import test from "node:test";

import { INTERVIEWER_SYSTEM_PROMPT } from "./interviewer-system-prompt.js";

test("limits the assistant to Abdallah's professional profile", () => {
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /Answer only questions whose primary purpose/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /do not answer it or provide any of the requested facts/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /distance between the Moon and the Sun/);
});

test("does not let presentation or injection requests override the scope", () => {
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /format requests such as “SVG”, “JSON”, “write code”/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /never override this scope/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /For a mixed request, answer only the portion about Abdallah/);
});
