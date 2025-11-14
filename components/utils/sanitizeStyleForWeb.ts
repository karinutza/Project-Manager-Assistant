// Minimal sanitizer for web: flatten RN style arrays into a plain object and
// drop RN-only complex values. This avoids passing arrays/objects to the DOM.
export default function sanitizeStyleForWeb(style: any) {
  // Minimal, safe sanitizer: flatten arrays and return a plain object.
  if (!style) return {};
  if (Array.isArray(style)) return Object.assign({}, ...style.filter(Boolean));
  if (typeof style === 'object' && style !== null) return style;
  return {};
}