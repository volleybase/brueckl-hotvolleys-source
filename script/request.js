function log(txt) {
  if (console && console.log) {
    console.log(txt);
  }
}

if (window.bhv === undefined) {
  window.bhv = {};
}

window.bhv.request = {
  queryResults: function(id, onsuccess, onerror) {
    if (!id || !Number.isFinite(id)) {
      log('Invalid id ' + id + '!');
      return false;
    }

    var request = null;
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    }
    if (!request || ! ("withCredentials" in request)) {
      log('XMLHttpRequest is not available!');
      return false;
    }

    function reqHandler(evtXHR) {
      if (request.readyState === 4 && request.status == 200) {
        onsuccess(request.responseText);
      }
    }

    function reqError(event) {
      log('Error handler called!');
      onerror();
    }

    // start request (add dummy timestamp to avoid caching)
    var url = 'http://kvv.volleynet.at/volleynet/service/xml2.php?action=tabelle&bew_id=' + id;
    request.open('GET', url + '&dummy=' + (new Date()).getTime(), true);
    request.onerror = reqError;
    request.onreadystatechange = reqHandler;
    request.send();

    return true;
  }
}

/**
 * Some utilities.
 */
window.bhv.request.utils = {

  /**
   * Returns the title of the current request.
   * @param {Date} date The current date to create the offline data.
   * @param {{}} map The main data map.
   * @return {string} The titel of the curremnt request.
   */
  getTitle: function(date, map) {

    // get key of current team
    var key = this.getKey();

    // check if any entry for this team
    if (map && map[key] && map[key][2]) {

      // create title and return it
      return '<b>'
        + map[key][2]
        // add optional date info (for offline data, only)
        + this._dateInfo(date)
        + '</b>\n';
    }

    // else: empty string
    return '';
  },

  /**
   * Creates a xml document from the response text.
   * @param {string} reponse The response from the web service.
   * @return {DOMDocument} The xml document.
   */
  getXml: function(response) {

    try {

      // check for parser
      if (window.DOMParser) {

        // create the parser, if ok, parse xml document from text and return it
        var parser = new DOMParser();
        if (parser) {
          return parser.parseFromString(response, "text/xml");
        }
      }
    } catch (err) {}

    // simple error handling
    log('Cannot parse results!');
    return null;
  },

  /**
   * Shows offline data.
   * @param {string} type The type of the data (results, schedule).
   * @param {function(txt)} callback The callback to inject the result into
   * the page.
   */
  show: function(type, callback) {
    var key = this.getKey();
    if (key !== '?') {
      var txt = bhv.db.get(type + ':' + key);
      if (txt) {
        callback(txt);
      }
    }
  },

  /**
   * Returns the key of the current query (schedule, results).
   * @return {string} The key of the team to query.
   */
  getKey: function() {

    // default to detect errors
    var key = '?';

    // get key from query string
    var parts = location.search.substring(1).split('&');
    // only one param
    if (parts.length == 1) {
      // extract value of key
      parts = parts[0].split('=');
      if (parts.length == 2 && parts[0] == 'key') {
        key = parts[1];
      }
    }

    // done: return key
    return key;
  },

  /**
   * Adds an optional date info.
   * @param {Date} date A date structure or null.
   * @return The date info for the title or an empty string.
   */
  _dateInfo: function(date) {

    // if date given
    if (date && date instanceof Date) {

      // create and return info
      var m = date.getMinutes();
      return ' ('
        + date.getDate() + '.'
        + (date.getMonth() + 1) + '.'
        + date.getFullYear() + ' '
        + date.getHours() + ':'
        + (m < 10 ? '0' + m : m)
        + ')';
    }

    // else: return empty string
    return '';
  }
}
