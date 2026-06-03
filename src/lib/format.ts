/**
 * Pad an integer with a leading zero up to width 2.
 */
export function pad2(n: number): string {
  if (n < 0) return "00";
  if (n < 10) return `0${n}`;
  return String(n);
}

/**
 * Format days with a minimum width of 2 but allowing overflow (e.g. 365, 1024).
 */
export function padDays(n: number): string {
  if (n < 0) return "00";
  return n < 10 ? `0${n}` : String(n);
}

/**
 * Sanitize a label: trim, cap at 60 chars, strip ASCII control characters.
 */
export function sanitizeLabel(raw: string | null | undefined): string {
  if (!raw) return "";
  let clean = "";
  for (const ch of raw) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code !== 127) clean += ch;
  }
  return clean.trim().slice(0, 60);
}
