export type ForumRichContent = {
  text: string;
  imageUrl?: string;
};

export function parseForumContent(value: string | null | undefined): ForumRichContent {
  const raw = String(value || "");
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
      return {
        text: parsed.text,
        imageUrl: typeof parsed.imageUrl === "string" ? parsed.imageUrl : undefined,
      };
    }
  } catch {
  }
  return { text: raw };
}

export function stringifyForumContent(input: ForumRichContent) {
  const text = input.text.trim();
  const imageUrl = input.imageUrl?.trim();
  if (!imageUrl) return text;
  return JSON.stringify({ text, imageUrl });
}
