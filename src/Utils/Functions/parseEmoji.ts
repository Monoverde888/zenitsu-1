function parseEmoji(text: string): { animated: boolean; name: string; id: string | null } {
  if (!text.includes(':')) return { animated: false, name: text, id: null };
  const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
  if (!m) return null;
  return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
}

export default parseEmoji;
