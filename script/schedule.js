var map = {
  // 'u10': [18858, kidsSchedule, 'Termine U10'],
  // 'u11': [18865, kidsSchedule, 'Termine U11'],
  // 'u12': [18863, kidsSchedule, 'Termine U12'],
  // 'u13': [18861, kidsSchedule, 'Termine U13'],
  // 'u15': [18859, kidsSchedule, 'Termine U15'],

  'br4': [22934, leagueSchedule, 'Termine Unterliga', 29075],
  'br3': [22934, leagueSchedule, 'Termine Unterliga', 28955],
  'br2': [22933, leagueSchedule, 'Termine Landesliga', 28951]
};

var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];

// /**
//  * Creates the results for a junior chamionship.
//  * @param {string} reponse The response from the web service.
//  * @return {void}
//  */
// function kidsResult(response) {
//
//   // create xml data
//   var xml = bhv.request.utils.getXml(response);
//   if (xml) {
//
//     // get list of results
//     var list = xml.getElementsByTagName('tabelle');
//     if (list && list.length) {
//
//       // create text
//       var msg = _fill('', 47) + 'P  T\n';
//       for (var i = 0; i < list.length; ++i) {
//         msg += _fill('' + (i + 1), -2) + '. '
//             + _fill(_find(list[i].childNodes, 'tea_name'), 40)
//             + _fill(_find(list[i].childNodes, 'punkte'), -4)
//             + _fill(_find(list[i].childNodes, 'gespielt'), -3) + "\n";
//       }
//
//       // save data for offline mode
//       _save(bhv.request.utils.getTitle(new Date(), map) + msg);
//       // add created text to page
//       bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
//     }
//   }
// }

/**
 * Creates the results for a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueSchedule(response) {

  // create xml data
  var xml = bhv.request.utils.getXml(response);
  if (xml) {

    // get list of results
    var list = xml.getElementsByTagName('termin');
    if (list && list.length) {

      var L1 = 4,
          L2 = 12,
          L3 = 7,
          L45 = 28,
          fmt = bhv.request.utils.fillColumn;

      // create text
      var msg = '\n' + fmt('Tag', L1) + fmt('Datum', L2) + fmt('Zeit', L3)
          + fmt('Heim', L45 + 1) + fmt('Gast', L45 + 1) + 'Halle\n';
      // Di  23.10.2018  18:15  ATSC Klagenfurt 4        Brückl hotvolleys 4       HS Hasnerschule (1. Stock) {KLAGENFURT}\n';
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn(days[bhv.request.utils.findNode(list[i].childNodes, 'tag')], L1)
            + bhv.request.utils.fillColumn(bhv.request.utils.findNode(list[i].childNodes, 'datum'), L2)
            + bhv.request.utils.fillColumn(bhv.request.utils.findNode(list[i].childNodes, 'zeit'), L3)
            + bhv.request.utils.fillColumn(bhv.request.utils.findNode(list[i].childNodes, 'heimteamname'), L45) + ' '
            + bhv.request.utils.fillColumn(bhv.request.utils.findNode(list[i].childNodes, 'gastteamname'), L45) + ' '
            + bhv.request.utils.findNode(list[i].childNodes, 'spo_name') + "\n";
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
    }
  }
}

/**
 * Stores the data for offline access.
 * @param {string} txt The data to display.
 * @return {void}
 */
function _save(txt) {
  // store data for offline reading
  bhv.db.set('schedule:' + bhv.request.utils.getKey(), txt);
}

/**
 * Starts the loading of the schedule.
 * @return {void}
 */
function getSchedule() {
  var key = bhv.request.utils.getKey();

  if (map && map[key]) {
    //                        bew_id       tea_id       onSuccess,   onError
    bhv.request.querySchedule(map[key][0], map[key][3], map[key][1],
      getScheduleOffline);
  } else {
    bhv.request.utils.inject('Ungültige Termine!');
  }
}

/**
 * Injects the stored Schedule if offline.
 * @return {void}
 */
function getScheduleOffline() {
  bhv.request.utils.show('schedule', bhv.request.utils.inject);
}
