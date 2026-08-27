// Server-only helper: translates Vietnamese text to English using MyMemory's
// free, keyless translation API. Used to pre-fill the EN admin fields with a
// draft translation the admin can review/edit before saving — not treated as
// authoritative, just a starting point.
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const MAX_CHUNK = 450; // MyMemory's practical limit per anonymous request

async function translateChunk(text: string): Promise<string> {
  if (!text.trim()) return text;
  const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=vi|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("translate_failed");
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string") throw new Error("translate_failed");
  return translated;
}

function splitLongParagraph(paragraph: string): string[] {
  const sentences = paragraph.match(/[^.!?\n]+[.!?]*\s*/g) ?? [paragraph];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current + sentence).length > MAX_CHUNK) {
      chunks.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function translateViToEn(text: string): Promise<string> {
  const paragraphs = text.split("\n");
  const translatedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      translatedParagraphs.push(paragraph);
      continue;
    }
    if (paragraph.length <= MAX_CHUNK) {
      translatedParagraphs.push(await translateChunk(paragraph));
      continue;
    }
    const chunks = splitLongParagraph(paragraph);
    const translatedChunks: string[] = [];
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk));
    }
    translatedParagraphs.push(translatedChunks.join(" "));
  }

  return translatedParagraphs.join("\n");
}
