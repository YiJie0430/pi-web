import assert from "node:assert/strict";
import test from "node:test";

async function loadSubject() {
  return import("./file-viewer-display.ts");
}

test("defaults HTML and Markdown files to preview unless diff was requested", async () => {
  const { getInitialDisplayMode } = await loadSubject();

  assert.equal(getInitialDisplayMode("html"), "preview");
  assert.equal(getInitialDisplayMode("markdown"), "preview");
  assert.equal(getInitialDisplayMode("text"), "source");
  assert.equal(getInitialDisplayMode("html", "diff"), "diff");
});

test("uses plain source rendering for large files", async () => {
  const { shouldUsePlainSourceRenderer } = await loadSubject();

  assert.equal(shouldUsePlainSourceRenderer({ size: 100 * 1024, lineCount: 200 }), false);
  assert.equal(shouldUsePlainSourceRenderer({ size: 600 * 1024, lineCount: 200 }), true);
  assert.equal(shouldUsePlainSourceRenderer({ size: 100 * 1024, lineCount: 4000 }), true);
});
