import assert from "node:assert/strict";
import test from "node:test";

async function loadSubject() {
  return import("./file-types.ts");
}

test("detects image, audio, and document preview paths", async () => {
  const {
    getAudioMime,
    getDocumentMime,
    getImageMime,
    isAudioPath,
    isDocumentPreviewPath,
    isImagePath,
  } = await loadSubject();

  assert.equal(getImageMime("/tmp/screenshot.PNG"), "image/png");
  assert.equal(getAudioMime("C:\\Users\\me\\voice.OPUS"), "audio/ogg");
  assert.equal(getDocumentMime("/tmp/report.docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  assert.equal(isImagePath("/tmp/screenshot.PNG"), true);
  assert.equal(isAudioPath("C:\\Users\\me\\voice.OPUS"), true);
  assert.equal(isDocumentPreviewPath("/tmp/report.pdf"), true);
  assert.equal(isDocumentPreviewPath("/tmp/report.txt"), false);
});

test("extracts extensions from mixed path styles", async () => {
  const { documentPreviewKind, getFileExt } = await loadSubject();

  assert.equal(getFileExt("/tmp/archive.tar.gz"), "gz");
  assert.equal(getFileExt("C:\\Users\\me\\photo.AVIF"), "avif");
  assert.equal(documentPreviewKind("/tmp/manual.PDF"), "pdf");
  assert.equal(documentPreviewKind("/tmp/manual.md"), null);
});

test("formats bytes cleanly into human-readable strings", async () => {
  const { formatBytes } = await loadSubject();

  assert.equal(formatBytes(500), "500B");
  assert.equal(formatBytes(1024), "1KB");
  assert.equal(formatBytes(256 * 1024), "256KB");
  assert.equal(formatBytes(1536), "1.5KB");
  assert.equal(formatBytes(10 * 1024 * 1024), "10MB");
  assert.equal(formatBytes(100 * 1024 * 1024), "100MB");
  assert.equal(formatBytes(500 * 1024 * 1024), "500MB");
  assert.equal(formatBytes(1024 * 1024 * 1024), "1GB");
});

test("provides configurable limits and fallback defaults", async () => {
  const {
    TEXT_PREVIEW_MAX_BYTES,
    IMAGE_PREVIEW_MAX_BYTES,
    DOCX_PREVIEW_MAX_BYTES,
    getEnvLimit,
  } = await loadSubject();

  assert.equal(TEXT_PREVIEW_MAX_BYTES, 10 * 1024 * 1024);
  assert.equal(IMAGE_PREVIEW_MAX_BYTES, 100 * 1024 * 1024);
  assert.equal(DOCX_PREVIEW_MAX_BYTES, 100 * 1024 * 1024);

  assert.equal(getEnvLimit("NON_EXISTENT_VAR", 42), 42);

  process.env.TEST_LIMIT_VAR = "123456";
  assert.equal(getEnvLimit("TEST_LIMIT_VAR", 10), 123456);

  process.env.TEST_LIMIT_VAR = "-5";
  assert.equal(getEnvLimit("TEST_LIMIT_VAR", 10), 10);

  process.env.TEST_LIMIT_VAR = "invalid";
  assert.equal(getEnvLimit("TEST_LIMIT_VAR", 10), 10);
  delete process.env.TEST_LIMIT_VAR;
});
