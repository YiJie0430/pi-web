export function getEnvLimit(envName: string, defaultValue: number): number {
  const value = typeof process !== "undefined" ? (process.env[envName] || process.env[`NEXT_PUBLIC_${envName}`]) : undefined;
  if (value) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return defaultValue;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${Number.isInteger(kb) ? kb : kb.toFixed(1)}KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)}MB`;
  }
  const gb = bytes / (1024 * 1024 * 1024);
  return `${Number.isInteger(gb) ? gb : gb.toFixed(1)}GB`;
}

export const TEXT_PREVIEW_MAX_BYTES = getEnvLimit("PI_WEB_TEXT_PREVIEW_MAX_BYTES", 10 * 1024 * 1024);
export const IMAGE_PREVIEW_MAX_BYTES = getEnvLimit("PI_WEB_IMAGE_PREVIEW_MAX_BYTES", 100 * 1024 * 1024);
export const DOCX_PREVIEW_MAX_BYTES = getEnvLimit("PI_WEB_DOCX_PREVIEW_MAX_BYTES", 100 * 1024 * 1024);

export type DocumentPreviewKind = "pdf" | "docx";

export const IMAGE_EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  avif: "image/avif",
};

export const AUDIO_EXT_TO_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  opus: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  flac: "audio/flac",
  weba: "audio/webm",
  webm: "audio/webm",
};

export const DOCUMENT_EXT_TO_MIME: Record<DocumentPreviewKind, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function getBaseName(filePath: string): string {
  return filePath.replace(/\\/g, "/").split("/").pop() ?? "";
}

export function getFileExt(filePath: string): string {
  return getBaseName(filePath).toLowerCase().split(".").pop() ?? "";
}

export function getImageMime(filePath: string): string | null {
  return IMAGE_EXT_TO_MIME[getFileExt(filePath)] ?? null;
}

export function getAudioMime(filePath: string): string | null {
  return AUDIO_EXT_TO_MIME[getFileExt(filePath)] ?? null;
}

export function getDocumentMime(filePath: string): string | null {
  return DOCUMENT_EXT_TO_MIME[getFileExt(filePath) as DocumentPreviewKind] ?? null;
}

export function documentPreviewKind(filePath: string): DocumentPreviewKind | null {
  const ext = getFileExt(filePath);
  if (ext === "pdf" || ext === "docx") return ext;
  return null;
}

export function isImagePath(filePath: string): boolean {
  return getImageMime(filePath) !== null;
}

export function isAudioPath(filePath: string): boolean {
  return getAudioMime(filePath) !== null;
}

export function isDocumentPreviewPath(filePath: string): boolean {
  return documentPreviewKind(filePath) !== null;
}
