/** Slugifies Latin text; Bengali/other non-Latin input falls back to a deterministic hash of
 *  the input (NOT Math.random() — that produced a different slug every call, which silently
 *  broke idempotent upserts like the shop seed script: reseeding the same Bengali product name
 *  minted a brand-new document instead of updating the existing one). */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base) return base;

  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return `item-${Math.abs(hash).toString(36)}`;
}
