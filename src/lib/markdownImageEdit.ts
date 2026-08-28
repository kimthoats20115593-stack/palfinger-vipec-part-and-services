// Small text-surgery helpers for the News content live-preview editor:
// find a Markdown image `![alt](url)` by its exact url and either drop it
// or swap its url, directly in the raw Markdown source string.

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function removeImageMarkdown(content: string, url: string): string {
  const escaped = escapeRegExp(url);
  const pattern = new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)\\n{0,2}`, "g");
  const stripped = content.replace(pattern, "").replace(/\n{3,}/g, "\n\n").trim();
  return stripped ? `${stripped}\n` : "";
}

export function replaceImageMarkdownUrl(content: string, oldUrl: string, newUrl: string): string {
  const escaped = escapeRegExp(oldUrl);
  const pattern = new RegExp(`(!\\[[^\\]]*\\]\\()${escaped}(\\))`, "g");
  return content.replace(pattern, `$1${newUrl}$2`);
}
