var map = {
  'u10': [18858, kidsResult, 'Tabelle U10'],
  'u11': [18865, kidsResult, 'Tabelle U11'],
  'u12': [18863, kidsResult, 'Tabelle U12'],
  'u13': [18861, kidsResult, 'Tabelle U13'],
  'u15': [18859, kidsResult, 'Tabelle U15'],

  'br4': [22934, leagueResult, 'Tabelle Unterliga'],
  'br3': [22934, leagueResult, 'Tabelle Unterliga'],
  'br2': [22933, leagueResult, 'Tabelle Landesliga']
};

function _getTitle(date) {

  var key = _getKey();

  if (map && map[key] && map[key][2]) {

    var tit = '<b>' + map[key][2];

    if (date && date instanceof Date) {
      var m = date.getMinutes();
      tit += ' (' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' '
          + date.getHours() + ':' + (m < 10 ? '0' + m : m) + ')';
    }

    tit += '</b>\n';

    return tit;
  }

  return '';
}

function _fill(txt, len) {
  if (txt === undefined || txt === null || typeof txt !== 'string') {
    txt = '';
  }
  if (len < 0) {
    len *= -1;
    while (txt.length < len) {
      txt = ' ' + txt;
    }
  } else {
    while (txt.length < len) {
      txt += ' ';
    }
  }

  return txt.substr(0, len);
}

function _find(list, name) {
  if (list && list.length) {
    for (var i = 0; i < list.length; ++i) {
      if (list[i].nodeName === name) {
        return list[i].textContent;
      }
    }
  }
  return '';
}

/**
 * Creates the results for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsResult(response) {

  // create xml data
  var xml = _getXml(response);
  if (xml) {

    // get list of results
    var list = xml.getElementsByTagName('tabelle');
    if (list && list.length) {

      // create text
      var msg = _fill('', 47) + 'P  T\n';
      for (var i = 0; i < list.length; ++i) {
        msg += _fill('' + (i + 1), -2) + '. '
            + _fill(_find(list[i].childNodes, 'tea_name'), 40)
            + _fill(_find(list[i].childNodes, 'punkte'), -4)
            + _fill(_find(list[i].childNodes, 'gespielt'), -3) + "\n";
      }

      // save data for offline mode
      _save(_getTitle(new Date()) + msg);
      // add created text to page
      _inject(_getTitle() + msg);
    }
  }
}

/**
 * Creates the results for a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueResult(response) {

  // create xml data
  var xml = _getXml(response);
  if (xml) {

    // get list of results
    var list = xml.getElementsByTagName('tabelle');
    if (list && list.length) {

      // create text
      var msg = _fill('', 51) + 'S/N  Sätze   Punkte\n'
          + _fill('', 45) + 'Sp.  +  -   +  -    +   -  P\n';
      for (var i = 0; i < list.length; ++i) {
        msg += _fill('' + (i + 1), -2) + '. '
            + _fill(_find(list[i].childNodes, 'tea_name'), 40)
            + _fill(_find(list[i].childNodes, 'gespielt'), -3)
            + _fill(_find(list[i].childNodes, 'gewonnen'), -4)
            + _fill(_find(list[i].childNodes, 'verloren'), -3)
            + _fill(_find(list[i].childNodes, 'satzgewonnen'), -4)
            + _fill(_find(list[i].childNodes, 'satzverloren'), -3)
            + _fill(_find(list[i].childNodes, 'punktgewonnen'), -5)
            + _fill(_find(list[i].childNodes, 'punktverloren'), -4)
            + _fill(_find(list[i].childNodes, 'punkte'), -3) + "\n";
      }

      // save data for offline mode
      _save(_getTitle(new Date()) + msg);
      // add created text to page
      _inject(_getTitle() + msg);
    }
  }
}

/**
 * Creates a xml document from the response text.
 * @param {string} reponse The response from the web service.
 * @return {DOMDocument} The xml document.
 */
function _getXml(response) {

  try {
    // check
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
}

/**
 * Add the results to the page.
 * @param {string} txt The text to add.
 * @return {void}
 */
function _inject(txt) {
  var div = document.getElementById('content');
  div.innerHTML = txt;
}

function _save(txt) {
  // store data for offline reading
  bhv.db.set('result:' + _getKey(), txt);
}

/**
 * Starts the loading of the results.
 * @return {void}
 */
function getResults() {
  var key = _getKey();

  if (map && map[key]) {
    bhv.request.queryResults(map[key][0], map[key][1], getResultsOffline);
  } else {
    _inject('Ungültige Tabelle!');
  }
}

function _getKey() {
  var key = '?';

  var parts = location.search.substring(1).split('&');
  if (parts.length == 1) {
    parts = parts[0].split('=');
    if (parts.length == 2) {
      key = parts[1];
    }
  }

  return key;
}

function getResultsOffline() {
  var key = _getKey();
  if (key !== '?') {
    var txt = bhv.db.get('result:' + key);
    if (txt) {
      _inject(txt);
    }
  }
}
