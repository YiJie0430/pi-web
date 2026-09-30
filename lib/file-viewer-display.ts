export type FileDisplayMode = "source" | "preview" | "diff";

export const SOURCE_HIGHLIGHT_MAX_BYTES = 512 * 1024;
export const SOURCE_HIGHLIGHT_MAX_LINES = 3000;

export function getInitialDisplayMode(
  language: string,
  requestedMode?: FileDisplayMode,
): FileDisplayMode {
  if (requestedMode === "diff") return "diff";
  if (language === "html" || language === "markdown") return "preview";
  return "source";
}

export function shouldUsePlainSourceRenderer({
  size,
  lineCount,
}: {
  size: number;
  lineCount: number;
}): boolean {
  return size > SOURCE_HIGHLIGHT_MAX_BYTES || lineCount > SOURCE_HIGHLIGHT_MAX_LINES;
}
