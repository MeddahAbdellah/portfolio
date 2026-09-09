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

test("allows direct, substantive discussion of private repositories", () => {
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /not as a reason to refuse or retreat to an anonymized answer/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /“How about Alethio\?”/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /name a private repository and discuss the concrete technologies/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /Apply the evidence-priority order above regardless of repository visibility/);
});

test("prioritizes framework contributions, then project size, then recency", () => {
  const framework = INTERVIEWER_SYSTEM_PROMPT.indexOf("First, prioritize substantive contributions to major, widely used frameworks");
  const biggest = INTERVIEWER_SYSTEM_PROMPT.indexOf("Second, prioritize the biggest relevant repositories and projects");
  const recent = INTERVIEWER_SYSTEM_PROMPT.indexOf("Third, among otherwise comparable evidence, prioritize repositories Abdallah contributed to most recently");

  assert.ok(framework >= 0, "framework-contribution priority is present");
  assert.ok(framework < biggest, "framework contributions come before project size");
  assert.ok(biggest < recent, "project size comes before recency");
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /Recency is a tie-breaker/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /asks about a specific repository, answer about that repository directly/);
});

test("keeps sensitive private-repository material protected", () => {
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /Do not share a private repository's URL/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /Do not infer confidential business facts/);
  assert.match(INTERVIEWER_SYSTEM_PROMPT, /withhold credentials, secrets, personal data/);
});
