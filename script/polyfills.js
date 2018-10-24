/**
 * Number.isFinite(value)
 */
Number.isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && isFinite(value);
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

// line endings for old ie - pre still not working <= ie8
window.NL = '\n';
if (window.attachEvent && !window.addEventListener) {
  // "bad" IE (<= IE8)
  window.NL = '<br>';
}

// IE detection
var ie = (function () {
  if (window.ActiveXObject === undefined) return 0; // Not IE
  if (!window.XMLHttpRequest) return 6;
  if (!document.querySelector) return 7;
  if (!document.addEventListener) return 8;
  if (!window.atob) return 9;
  if (!document.__proto__) return 10;
  return 11;
})();

// html extension for dom parser (if it exist)
if (window.DOMParser) {
  (function(DOMParser) {
  	'use strict';

  	var proto = DOMParser.prototype,
          nativeParse = proto.parseFromString;

  	// Firefox/Opera/IE throw errors on unsupported types
  	try {
  		// WebKit returns null on unsupported types
  		if ((new DOMParser()).parseFromString('', 'text/html')) {
  			// text/html parsing is natively supported
  			return;
  		}
  	} catch (ex) {}

    proto.parseFromString = function(markup, type) {
      if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
        var doc = document.implementation.createHTMLDocument('');
        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
          doc.documentElement.innerHTML = markup;
        } else {
          doc.body.innerHTML = markup;
        }
        return doc;
      } else {
        return nativeParse.apply(this, arguments);
      }
    };

  }(DOMParser));
}
