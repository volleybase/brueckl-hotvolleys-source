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
   * Creates the request object and sends the data. If headers are given, they
   * will be added to the request and the reponse headers will be querued and
   * added to the response.
   * @param {string} url The url to query.
   * @param {number} wait The timeout.
   * @param {function} onsuccess The on success callback.
   * @param {function} onerror The on error callback.
   * @param {boolean} addDummy True to add a dummy query string part, otherwise
   * false.
   * @param {Map} headers The optional headers to send.
   * @param {string} mode The request mode (default: GET).
   * @param {string} data The data to send for POST or PUT.
   * @return {boolean} True if request has been started, otherwise false.
   */
  _startRequest: function(
    url, wait, onsuccess, onerror, addDummy,
    headers, mode, data
  ) {

    // prepare Ajax-CORS for IE8/9
    var ie89 = ie === 8 || ie === 9,
        // the http request mode
        mode2 = typeof mode === 'string' ? mode : 'GET',
        // create request object
        request = null,
        // this in handlers
        self = this;

    if (ie89) {
      request = new XDomainRequest();
    } else if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
      request.withCredentials = false;
    }

    // old ie
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

    if (ie89) {
      // avoid aborting
      request.onprogress = function() {};
      request.ontimeout = function() {};

      request.onload = function() {
        // if any headers given: query response headers
        var headersResponse = undefined;
        if (headers !== undefined) {
          headersResponse = self._getResponseHeaders(request);
        }
        onsuccess(request.responseText, headersResponse);
      };

      request.onerror = function() {
        log('Error handler called!');
        onerror();
      };

    } else {

      function reqHandler(evtXHR) {
        var headersResponse = undefined,
            data, found;

        if (request.readyState === 4) {
          switch (request.status) {

            // ok
            case 200:
              // if any headers given: query response headers
              if (headers !== undefined) {
                headersResponse = self._getResponseHeaders(request);
              }

              // return result
              onsuccess(request.responseText, headersResponse);
              break;

            // not found
            case 404:
              onerror('Cannot find ' + request.responseURL + '!');
              break;

            case 304:
              found = false;
              if (bhv.db && request.responseURL) {
                data = bhv.db.readObj(request.responseURL);
                if (data && data.data) {
                  // if any headers given: query response headers
                  if (headers !== undefined) {
                    headersResponse = self._getResponseHeaders(request);
                  }

                  // return result
                  found = true;
                  onsuccess(data.data, headersResponse);
                }
              }

              if (!found) {
                onerror('Cannot find ' + request.responseURL + ' in old data!');
              }
              break;

            default:
              onerror('Url: ' + request.responseURL + ' -> status: ' + request.status + '!');
          }
        }
      }

      request.onreadystatechange = reqHandler;

      function reqError(event) {
        log('Error handler called!');
        onerror();
      }

      request.onerror = reqError;
    }

    // start request (optional: add dummy timestamp to avoid caching)
    request.open(
      mode2,
      url + (addDummy ? '&dummy=' + (new Date()).getTime() : ''),
      true
    );

    // try to set a timeout handler (not for old ie)
    if (!ie89 && request.timeout !== undefined && wait > 0) {
      request.timeout = wait;
      request.ontimeout = function(e) {
        log('Timeout -> call error handler!');
        onerror();
      };
    }

    // handle optional headers
    if (headers) {
      var i,
          keys = Object.keys(headers);
      for (i = 0; i < keys.length; ++i) {
        request.setRequestHeader(keys[i], headers[keys[i]]);
      }
    }

    // send request
    switch (mode2) {
      case 'PUT':
      case 'POST':
        request.send(data);
        break;
      default:
        request.send();
    }

    // done
    return true;
  },

  '_getResponseHeaders': function(request) {
     var i, parts, key, val,
         raw = request.getAllResponseHeaders(),
         arr = raw.trim().split(/[\r\n]+/),
         headersResponse = {};

    for (i = 0; i < arr.length; ++i) {
      parts = arr[i].split(': ');
      key = parts.shift().toLowerCase();
      val = parts.join(': ');
      headersResponse[key] = val;
    }

    return headersResponse;
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

  queryStandings: function(id, onsuccess, onerror) {

    if (!this._checkId(id, 'competition')) {
      onerror();
      return false;
    }

    // start request
    var url = location.protocol
      + '//kvv.volleynet.at/volleynet/service/xml2.php?action=tabelle&bew_id='
      + id;
    if (!this._startRequest(url, 5000, onsuccess, onerror, true)) {
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
    var url = location.protocol
      + '//kvv.volleynet.at/volleynet/service/xml2.php'
      + '?action=termin&where='
      + encodeURIComponent('bew_id=' + idBew
        + 'and (vrn_id_a=21 or vrn_id_b=21) and (spi_tea_id_a=' + idTea
        + ' or spi_tea_id_b=' + idTea
        + ") and spi_datum >= timestamp '"
        + bhv.request.utils.yyyymmdd(new Date()) + " 00:00'")
      + '&orderBy=spi_datum';

    // request data
    if (!this._startRequest(url, 5000, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
    return true;
  },

  queryMultiSchedules: function(from, till, onsuccess, onerror) {

    // the url to get the schedule
    var url = location.protocol
      + '//kvv.volleynet.at/volleynet/service/xml2.php'
      // + '//kv.volleynet.at/volleynet/service/xml2.php'
      + '?action=termin&where=' + encodeURIComponent(
        '(vrn_id_a = 21 or vrn_id_b = 21)'
        + " and spi_datum >= TO_TIMESTAMP('" + from + " 00:00', 'YYYY-MM-DD HH24:MI')"
        + " and spi_datum <= TO_TIMESTAMP('" + till + " 23:59', 'YYYY-MM-DD HH24:MI')"
        + ' order by spi_datum');

    // request data
    if (!this._startRequest(url, 5000, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
    return true;
  },


  queryKidsSchedule: function(idBew, onsuccess, onerror) {

    // check id of competition and team
    if (!this._checkId(idBew, 'competition')) {
      onerror();
      return false;
    }

    // the url to get the schedule
    var url = location.protocol
      + '//kvv2.volleynet.at/volleynet/service/xml2.php'
      + '?action=turniere&bewerb_id=' + idBew;

    // request data
    if (!this._startRequest(url, 15000, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
    return true;
  },

  queryMultiKidsSchedules: function(from, till, filter, onsuccess, onerror) {

    // the url to get the schedule
    var url = location.protocol
      + '//kvv2.volleynet.at/volleynet/service/xml2.php'
      // + '//kv2.volleynet.at/volleynet/service/xml2.php'
      + '?action=turniere&where=' + encodeURIComponent(
        "von >= '" + from + "' and von <= '" + till
        + "' and anmerkung ilike '%" + filter + "%'");

    // request data
    if (!this._startRequest(url, 15000, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
    return true;
  },

  'queryXtraDates': function(from, till, onsuccess, onerror) {
    var addrFrom = this._urlXtraDates(from),
        addrTill = this._urlXtraDates(till),
        keyData = '',
        oldData = null,
        headers = {
          // 'Accept': 'application/vnd.github.v3.raw',

          // TODO create personal access token in settings application and use it instead of password

          // 'Authorization': 'Basic ' + btoa('BruecklHotvolleys:bhv1bhv1bhv')
          'Authorization': 'Basic ' + btoa('bhv-reader:bhv1reader')
        },

        handlerSuccess = function(response, headersResponse) {

          // get etag from response headers
          if (keyData && bhv.db && headersResponse && headersResponse['etag']) {
            bhv.db.writeObj(keyData, {
              'etag': headersResponse['etag'],
              'data': response
            });
          }

          onsuccess(response);
        },

        handlerError = function(err) {
          onerror(err);
        };

    // request data
    keyData = addrFrom;
    if (bhv.db) {
      oldData = bhv.db.readObj(addrFrom);
      if (oldData && oldData.etag) {
        headers['If-None-Match'] = oldData.etag;
      }
    }
    if (!this._startRequest(addrFrom, 5000, handlerSuccess, handlerError, false, headers)) {
      onerror();
      return false;
    }

    // if 2nd address is different
    if (addrTill !== addrFrom) {
      // request data again
      keyData = addrTill;
      if (bhv.db) {
        oldData = bhv.db.readObj(addrTill);
        if (oldData && oldData.etag) {
          headers['If-None-Match'] = oldData.etag;
        }
      }
      if (!this._startRequest(addrTill, 5000, handlerSuccess, handlerError, false, headers)) {
        onerror();
        return false;
      }
    }

    return true;
  },

  '_urlXtraDates': function(dat) {
    // real data
    var url = 'https://api.github.com/repos/BruecklHotvolleys/data/contents/{{year}}.json',
    // test data
    // var url = 'http://localhost:5001/testdata/githubdata/repos/BruecklHotvolleys/data/contents/{{year}}.json',
        year = dat.substr(0, 4);

    return url.replace('{{year}}', year);
  },


  'queryResults': function(idBew, idTea, onsuccess, onerror) {

    // check id of competition and team
    if (!this._checkId(idBew, 'competition') || !this._checkId(idTea, 'team')) {
      onerror();
      return false;
    }

    // the url to get the schedule
    var url = location.protocol
      + '//kvv.volleynet.at/volleynet/service/xml2.php'
      + '?action=ergebnis&where='
      + encodeURIComponent('bew_id=' + idBew
        + 'and (vrn_id_a=21 or vrn_id_b=21) and (spi_tea_id_a=' + idTea
        + ' or spi_tea_id_b=' + idTea + ')')
      + '&orderBy=spi_datum';

    // request data
    if (!this._startRequest(url, 5000, onsuccess, onerror, false)) {
      onerror();
      return false;
    }

    // done
    return true;
  },

  /**
   * Sends a file of x-dates.
   * @param {string} file The file to send.
   * @param {string} sha The sha file to send.
   * @param {function} onsuccess The on success callback.
   * @param {function} onerror The on error callback.
   * @return {boolean} True if update has been started, otherwise false.
   */
  'sendXtraDates': function(year, file, sha, onsuccess, onerror) {
    // examples: https://gist.github.com/EtienneR/2f3ab345df502bd3d13e

    // PUT /repos/:owner/:repo/contents/:path
    var url = this._urlXtraDates(year);

    // the headers of the request
    var headers = {
      // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      'Content-type': 'application/json; charset=utf-8',

      // TODO create bhv writer
      'Authorization': 'Basic ' + btoa('BruecklHotvolleys:bhv1bhv1bhv')
      // 'Authorization': 'Basic ' + btoa('bhv-reader:bhv1reader')
    };

    // the data to send
    /* {
      "message": "my commit message",
      "committer": {
        "name": "Scott Chacon",
        "email": "schacon@gmail.com"
      },
      "content": "bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnRz",
      "sha": "329688480d39049927147c162b9d2deaf885005f"
    } */
    var data = {
      'message': 'update dates ' + window.bhv.request.utils.dateInfo(new Date()),
      'committer': {
        // 'name': 'bhv-reader',
        'name': 'bhv-writer',
        'email': 'bhv@der-ball-ist-rund.net'
      },
      'content': base64.encode(file),
      'sha': sha
    };

    // var xhr = new XMLHttpRequest();
    // xhr.open('PUT', url, true);
    // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    // xhr.onload = function () {
    // 	 var updated = JSON.parse(xhr.responseText);
    // 	 if (xhr.readyState === 4 && xhr.status === 200) {
    // 		 console.table(updated);
    // 	 } else {
    //  	 console.error(updated);
    //   }
    // }
    // xhr.send(JSON.stringify(data));

    // request data
    if (!this._startRequest(
      url, 15000, onsuccess, onerror, false,
      headers, 'PUT', JSON.stringify(data)
    )) {
      onerror();
      return false;
    }

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
        + this.dateInfo(date)
        + '</b>' + NL;
    }

    // else: empty string
    return '';
  },

  /**
   * Shows offline data.
   * @param {string} type The type of the data (standings, schedule).
   * the page.
   */
  showOffline: function(type) {
    var key = this.getKey();
    if (key !== '?') {
      var txt = bhv.db.read(type + ':' + key);
      if (txt) {
        bhv.request.utils.inject(txt);
      }
    }
  },

  /**
   * Returns the key of the current query (schedule, standings).
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
    var check = 'brückl&nbsp;hotvolleys';
    var check2 = 'volleys&nbsp;brückl';
    if (txt.toLowerCase().replace(/ /g, '&nbsp;').indexOf(check) > -1) {
      return '<b class="team">' + txt + '</b>';
    }
    if (txt.toLowerCase().replace(/ /g, '&nbsp;').indexOf(check2) > -1) {
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

    // IE8: special handling for 'pre'
    if (ie <= 8) {
      txt = txt.replace(/ /g, '&nbsp;');
    }

    // return standings
    return txt;
  },

  /**
   * Add the standings to the page.
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
  dateInfo: function(date) {

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
  fromText: function(response, type) {

    try {

      // check for parser
      if (window.DOMParser
        && (!ie || type === 'xml' && ie >= 9 || type === 'html' && ie >= 10)) {

        // create the parser, if ok, parse xml document from text and return it
        var parser = new DOMParser();
        if (parser) {
          return parser.parseFromString(response, 'text/' + type);
        }

      } else if (ActiveXObject) {

        if (type === 'xml') {

          var doc = new ActiveXObject('Microsoft.XMLDOM');
          doc.async = false;
          try {
            doc.loadXML(response);
          } catch(e) {
            doc = undefined;
          }
          // if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
          //   status.code = 500;
          //   status.message = 'parseerror';
          //   throw 'Invalid XML: ' + xdr.responseText;
          // }
          return doc;
        } else {

          var div = document.createElement('div'),
              // extract content
              posStart = response.indexOf('<!-- start of content -->'),
              txt = response.substr(posStart + 25),
              posEnd = txt.indexOf('<!-- end of content -->');
          div.innerHTML = txt.substr(0, posEnd).trim();
          return div.document;
        }
      }
    } catch (err) {}

    // simple error handling
    log('Cannot parse standings!');
    return null;
  },

  /**
   * Returns all nodes of a given name from the xml document.
   * @param {(Xml)Document} xml The xml document.
   * @param {string} name The name of the nodes to read.
   * @return {NodeList} The nodes.
   */
  getNodes: function(xml, name) {

    // ie8: check with polyfilled own property
    if (Object.prototype.hasOwnProperty.call(xml, 'getElementsByTagName')) {
      return xml.getElementsByTagName(name);
    }

    // if (xml.querySelectorAll !== undefined) {
    if (Object.prototype.hasOwnProperty.call(xml, 'querySelectorAll')) {
      return xml.querySelectorAll(name);
    }

    // ie9: check
    if (xml.getElementsByTagName !== undefined) {
      return xml.getElementsByTagName(name);
    }

    return null;
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
  },

  /**
   * Creates the result info from the xml data.
   * @param {NodeList} nodes The infos about a game containing the result info.
   * @param {String} The formatted resuöt info or an empty string.
   */
  'createGameResult': function(nodes) {
    var setAa, setBb, sets, s,
        res = '',
        setA = bhv.request.xml.findNode(nodes, 'spi_saetze_a'),
        setB = bhv.request.xml.findNode(nodes, 'spi_saetze_b'),
        ptA = [
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz1_a'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz2_a'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz3_a'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz4_a'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz5_a')
        ],
        ptB = [
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz1_b'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz2_b'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz3_b'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz4_b'),
          bhv.request.xml.findNode(nodes, 'spi_punkte_satz5_b')
        ];

    if (!isNaN(setA) && !isNaN(setB)) {
      setAa = parseInt(setA);
      setBb = parseInt(setB);
      sets = setAa + setBb;
      if (sets > 0) {
        res = setA + ':' + setB + '&nbsp;(';
        for (s = 0; s < sets; ++s) {
          if (s > 0) {
            res += ',&nbsp;';
          }
          res += ptA[s] + ':' + ptB[s];
        }
        res += ')&nbsp;';
      }
    }

    return res;
  }
}
