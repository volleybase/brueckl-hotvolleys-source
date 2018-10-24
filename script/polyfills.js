/**
 * Number.isFinite(value)
 */
Number.isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && isFinite(value);
}

// line endings for old ie - pre still not working <= ie8
window.NL = '\n';
if (window.attachEvent && !window.addEventListener) {
  // "bad" IE (<= IE8)
  window.NL = '\r\n';
}
