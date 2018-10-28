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

/**
 * Creates the results for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsResult(response) {


  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of results
    var list = bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      // create text
      var msg = bhv.request.utils.fillColumn('', 47)
        + 'P  T'.replace(/ /g, '&nbsp;') + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn('' + (i + 1), -2) + '. '
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
                bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 40))
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3) + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
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
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of results
    // var list = xml.getElementsByTagName('tabelle');
    var list = bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      // create text
      var msg = bhv.request.utils.fillColumn('', 56)
          + 'S/N  Sätze   Punkte'.replace(/ /g, '&nbsp;') + NL
          + bhv.request.utils.fillColumn('', 50)
          + 'Sp.  +  -   +  -    +   -  P'.replace(/ /g, '&nbsp;') + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn('' + (i + 1), -2) + '. '
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 45))
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gewonnen'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'verloren'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'satzgewonnen'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'satzverloren'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punktgewonnen'), -5)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punktverloren'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -3) + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
    }
  }
}

function _save(txt) {
  // store data for offline reading
  bhv.db.write('result:' + bhv.request.utils.getKey(), txt);
}

/**
 * Starts the loading of the results.
 * @return {void}
 */
function getResults() {
  var key = bhv.request.utils.getKey();

  if (map && map[key]) {
    bhv.request.queryResults(map[key][0], map[key][1], getResultsOffline);
  } else {
    bhv.request.utils.inject('Ungültige Tabelle!');
  }
}

/**
 * Injects the stored results if offline.
 * @return {void}
 */
function getResultsOffline() {
  bhv.request.utils.showOffline('result');
}
