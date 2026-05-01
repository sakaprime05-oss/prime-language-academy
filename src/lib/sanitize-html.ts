const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "ul",
]);

const ALLOWED_ATTRS = new Set(["href", "title", "target", "rel", "class"]);
const VOID_TAGS = new Set(["br", "hr"]);

function sanitizeAttributes(rawAttributes: string) {
  const attrs: string[] = [];
  const attrPattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(rawAttributes))) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";

    if (!ALLOWED_ATTRS.has(name)) continue;
    if (name === "class" && !value.startsWith("prose-")) continue;
    if (name === "href" && !/^(https?:|mailto:|tel:|\/|#)/i.test(value)) continue;
    if (name === "target" && value !== "_blank") continue;

    const escaped = value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    attrs.push(`${name}="${escaped}"`);
  }

  if (attrs.some((attr) => attr.startsWith('target="_blank"')) && !attrs.some((attr) => attr.startsWith("rel="))) {
    attrs.push('rel="noopener noreferrer"');
  }

  return attrs.length ? ` ${attrs.join(" ")}` : "";
}

export function sanitizeHtml(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|svg|math)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|svg|math)\b[^>]*\/?\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*\/?\s*([a-zA-Z0-9-]+)([^>]*)>/g, (fullTag, rawTagName: string, rawAttributes: string) => {
      const tagName = rawTagName.toLowerCase();
      const isClosing = /^<\s*\//.test(fullTag);

      if (!ALLOWED_TAGS.has(tagName)) return "";
      if (isClosing) return VOID_TAGS.has(tagName) ? "" : `</${tagName}>`;
      return `<${tagName}${sanitizeAttributes(rawAttributes)}>`;
    });
}
