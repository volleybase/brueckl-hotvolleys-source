function log(txt) {
  if (console && console.log) {
    console.log(txt);
  }
}

if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * The ajax request handler.
 */
window.bhv.request = {

  /**
   * Creates the request object.
   * @param {string} url Th eurl to query.
   * @param {function} onsuccess The on success callback.
   * @param {function} onerror The on error callback.
   * @return {boolean} True if request has been stated, otherwise false.
   */
  _startRequest: function(url, onsuccess, onerror, addDummy) {

    // create request object
    var request = null;
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    }

    if (!request && window.ActiveXObject) {
      try {
        request = new ActiveXObject('MSXML2.XMLHTTP');
      } catch (ex) {
      }
    }

    // check if ok
    // if (!request || request.onerror === undefined) {
    // just try it...
    if (!request) {
      log('XMLHttpRequest is not available!');
      return null;
    }

    function reqHandler(evtXHR) {
      if (request.readyState === 4 && request.status == 200) {
        onsuccess(request.responseText);
      }
    }

    request.onreadystatechange = reqHandler;

    function reqError(event) {
      log('Error handler called!');
      onerror();
    }

    request.onerror = reqError;

    // start request (add dummy timestamp to avoid caching)
    request.open('GET', url + (addDummy ? '&dummy=' + (new Date()).getTime() : ''), true);
    request.send();

    // done
    return true;
  },

  /**
   * Checks if id is valid.
   * @param {string} id The id to check.
   * @param {string} info An info for error logging.
   * @return {boolean} Ok or Nok.
   */
  _checkId: function(id, info) {
    if (!id || !Number.isFinite(id)) {
      log('Invalid id ' + id + ' for ' + info + '!');
      return false;
    }

    return true;
  },

  queryResults: function(id, onsuccess, onerror) {

    if (!this._checkId(id, 'competition')) {
      onerror();
      return false;
    }

    // start request
    var url = 'http://kvv.volleynet.at/volleynet/service/xml2.php?action=tabelle&bew_id=' + id;
    if (!this._startRequest(url, onsuccess, onerror, true)) {
      onerror();
      return false;
    }

    return true;
  },

  querySchedule: function(idBew, idTea, onsuccess, onerror) {

    // check id of competition and team
    if (!this._checkId(idBew, 'competition') || !this._checkId(idTea, 'team')) {
      onerror();
      return false;
    }

    // the url to get the schedule
    var url = 'http://kvv.volleynet.at/volleynet/service/xml2.php'
      + '?action=termin&where='
      + encodeURIComponent('bew_id=' + idBew
        + 'and (vrn_id_a=21 or vrn_id_b=21) and (spi_tea_id_a=' + idTea
        + ' or spi_tea_id_b=' + idTea
        + ") and spi_datum >= timestamp '"
        + bhv.request.utils.yyyymmdd(new Date()) + " 00:00'")
      + '&orderBy=spi_datum';

    // request data
    if (!this._startRequest(url, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
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
        + '</b>' + NL;
    }

    // else: empty string
    return '';
  },

  /**
   * Shows offline data.
   * @param {string} type The type of the data (results, schedule).
   * the page.
   */
  showOffline: function(type) {
    var key = this.getKey();
    if (key !== '?') {
      var txt = bhv.db.read(type + ':' + key);
      if (txt) {
        inject(txt);
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
   * Checks if a given text contains 'brückl hotvolleys' and make it bold if found.
   * @param {string} txt The text
   * @return {string} The text.
   */
  checkBold: function(txt) {
    if (txt.toLowerCase().indexOf('brückl hotvolleys') > -1) {
      return '<b class="team">' + txt + '</b>';
    }

    return txt;
  },

  /**
   * Text column padding.
   * @param {string} txt The text to display in a text column.
   * @param {number} The size of the column, + for left aligned text, - for
   * right aligned text.
   * The padded text.
   */
  fillColumn: function(txt, len) {

    // ensure a valid text
    if (txt === undefined || txt === null || typeof txt !== 'string') {
      txt = '';
    }

    // check for right alignment
    if (len < 0) {
      len *= -1;
      // pad text
      while (txt.length < len) {
        txt = ' ' + txt;
      }

    // else: left alignment
    } else {
      // do padding
      while (txt.length < len) {
        txt += ' ';
      }
    }

    // cut text if too long
    if (txt.length > len) {
      var num = txt.substr(txt.length - 1);
      if (isNaN(num)) {
        // cut some characters
        txt = txt.substr(0, len);
      } else {
        // cut some characters, but preserve number code of team
        txt = txt.substr(0, len - 2);
        if (txt.substr(txt.length - 1) != ' ') {
          txt += ' ' + num;
        } else {
          // avoid double space in text
          txt += num + ' ';
        }
      }
    }

    // return result
    return txt;
  },

  /**
   * Add the results to the page.
   * @param {string} txt The text to add.
   * @return {void}
   */
  inject: function(txt) {
    var elem = document.getElementById('content');
    elem.innerHTML = txt;
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
  },

  /**
   * Format date for timestamp for database.
   * @param {Date} date The date info.
   * @return {string} The formated date or an empty string.
   */
  yyyymmdd: function(date) {
    var pad2 = function(nr) {
      if (nr < 10) {
        return '0' + nr;
      }
      return nr;
    }

    if (date && date instanceof Date) {
      return date.getFullYear() + '-'
        + pad2(date.getMonth() + 1) + '-'
        + pad2(date.getDate());
    }

    return '';
  }
}

/**
 * Xml utilities.
 */
window.bhv.request.xml = {

  /**
   * Creates a xml document from the response text.
   * @param {string} reponse The response from the web service.
   * @return {DOMDocument} The xml document.
   */
  fromText: function(response) {

    try {

      // check for parser
      if (window.DOMParser) {

        // create the parser, if ok, parse xml document from text and return it
        var parser = new DOMParser();
        if (parser) {
          return parser.parseFromString(response, "text/xml");
        }
      } else if (ActiveXObject) {
        var parserIE = new ActiveXObject('Microsoft.XMLDom');
        if (parserIE && parserIE.loadXML(response)) {
          return parserIE.documentElement;
        }
      }
    } catch (err) {}

    // simple error handling
    log('Cannot parse results!');
    return null;
  },

  /**
   * Returns all nodes of a given name from the xml document.
   * @param {(Xml)Document} xml The xml document.
   * @param {string} name The name of the nodes to read.
   * @return {NodeList} The nodes.
   */
  getNodes: function(xml, name) {
    return xml.getElementsByTagName(name);
  },

  /**
   * Finds a node in a list of nodes by its name.
   * @param {Array} list The node list.
   * @param {string} name The name of name.
   * @return {string} The text content of the node or an empty string.
   */
  findNode: function(list, name) {

    // if any list: handle each item
    if (list && list.length) {
      for (var i = 0; i < list.length; ++i) {

        // if node found: return its content
        if (list[i].nodeName === name) {
          return list[i].textContent || list[i].text;
        }
      }
    }

    // nothing found: return empty string
    return '';
  }
}
