export type ForumRichContent = {
  text: string;
  imageUrl?: string;
  reportedBy?: string[];
  reportedAt?: string;
};

export function parseForumContent(value: string | null | undefined): ForumRichContent {
  const raw = String(value || "");
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
      return {
        text: parsed.text,
        imageUrl: typeof parsed.imageUrl === "string" ? parsed.imageUrl : undefined,
        reportedBy: Array.isArray(parsed.reportedBy) ? parsed.reportedBy.filter((id: unknown) => typeof id === "string") : undefined,
        reportedAt: typeof parsed.reportedAt === "string" ? parsed.reportedAt : undefined,
      };
    }
  } catch {
  }
  return { text: raw };
}

export function stringifyForumContent(input: ForumRichContent) {
  const text = input.text.trim();
  const imageUrl = input.imageUrl?.trim();
  const reportedBy = Array.isArray(input.reportedBy) ? Array.from(new Set(input.reportedBy.filter(Boolean))) : [];
  if (!imageUrl && reportedBy.length === 0) return text;
  return JSON.stringify({
    text,
    ...(imageUrl ? { imageUrl } : {}),
    ...(reportedBy.length > 0 ? { reportedBy, reportedAt: input.reportedAt || new Date().toISOString() } : {}),
  });
}
