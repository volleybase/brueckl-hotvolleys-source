var mapLeague = {
  'br4': [22934, leagueSchedule, 'Termine Unterliga', 29075],
  'br3': [22934, leagueSchedule, 'Termine Unterliga', 28955],
  'br2': [22933, leagueSchedule, 'Termine Landesliga', 28951],
  'br1': [22691, leagueSchedule, 'Termine Bundesliga', 27423]
};
var mapKids = {
  // 'u10': [18858, kidsSchedule, 'Termine U10'],
  // 'u11': [18865, kidsSchedule, 'Termine U11'],
  // 'u12': [18863, kidsSchedule, 'Termine U12'],
  // 'u13': [18861, kidsSchedule, 'Termine U13'],
  'u15': [20752, kidsSchedule, 'Termine U15', 'brückl']
};

var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];


/**
 * Starts the loading of the schedule.
 * @return {void}
 */
function getSchedule() {
  var IDX_BEW = 0,
      IDX_TEA = 3,
      IDX_ONSUCCESS = 1,
      key = bhv.request.utils.getKey();

  if (mapLeague && mapLeague[key]) {
    bhv.request.querySchedule(mapLeague[key][IDX_BEW], mapLeague[key][IDX_TEA],
      mapLeague[key][IDX_ONSUCCESS], getScheduleOffline);

  } else if (mapKids && mapKids[key]) {
    bhv.request.queryKidsSchedule(mapKids[key][IDX_BEW],
      mapKids[key][IDX_ONSUCCESS], getScheduleOffline);

  } else {
    bhv.request.utils.inject('Ungültige Termine!');
  }
}

/**
 * Injects the stored schedule if offline.
 * @return {void}
 */
function getScheduleOffline() {
  bhv.request.utils.showOffline('schedule');
}


/**
 * Creates the schedule for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsSchedule(response) {
  // create xml data
  var xml = bhv.request.xml.fromText(response, 'html');
  if (xml) {

    // get list of dates
    var trs = bhv.request.xml.getNodes(xml, 'tr');
    if (trs) {
      var tournaments = [],
          tournament = null,
          key = bhv.request.utils.getKey(),
          pattern = mapKids[key] ? mapKids[key][3] : '';

      for (var t = 0; t < trs.length; ++t) {
        var tr = trs[t];

        // start of new tournament
        if (tr.className === 'tablehead') {
          tournament = {
            name: tr.children[1].innerText,
            date: tr.children[2].innerText.replace('&nbsp;', ' ').trim(),
            time: tr.children[3].innerText.replace('&nbsp;', ' ').trim(),
            location: tr.children[4].innerText.replace('&nbsp;', ' ').trim(),
            own: false,
            teams: []
          };
          tournaments.push(tournament);

        // team of current tournament
        } else if (tournament) {
          var nam = tr.children[1].innerText.replace('&nbsp;', ' ').trim(),
              own = false;
          if (pattern && nam.toLowerCase().indexOf(pattern) > -1) {
            own = tournament.own = true;
          }
          tournament.teams.push({
            name: nam,
            own: own
          });
        }
      }

      var msg = '';
      for (var t2 = 0; t2 < tournaments.length; ++t2) {
        var tour = tournaments[t2];
        if (tour.own) {
          if (msg != '') {
            msg += NL;
          }
          msg += NL + '<b class="team">' + tour.name + ' (' + tour.date + ' '
            + tour.time + ' ' + tour.location + ')</b>' + NL;
          for (var t3 = 0; t3 < tour.teams.length; ++t3) {
            msg += '- '
              + (tour.teams[t3].own ? '<b class="team">' : '')
              + tour.teams[t3].name
              + (tour.teams[t3].own ? '</b>' : '')
              + NL;
          }
        }
      }
      // msg += '<hr>' + JSON.stringify(tournaments, null, 2);
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, mapKids) + msg);
    }
  }
}

/**
 * Creates the schedule of a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueSchedule(response) {

  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of dates
    var list = bhv.request.xml.getNodes(xml, 'termin');
    if (list && list.length) {

      var L1 = 4,
          L2 = 12,
          L3 = 7,
          LNR = 4,
          L45 = 28,
          fmt = bhv.request.utils.fillColumn;

      // create text
      var msg = NL + fmt('Tag', L1) + fmt('Datum', L2) + fmt('Zeit', L3)
          + fmt('Nr', LNR)
          + fmt('Heim', L45 + 1) + fmt('Gast', L45 + 1) + 'Halle&nbsp;' + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn(days[bhv.request.xml.findNode(list[i].childNodes, 'tag')], L1)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'datum'), L2)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'zeit'), L3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'spi_nummer'), LNR)
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'), L45)) + '&nbsp;'
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'), L45)) + '&nbsp;'
            + bhv.request.xml.findNode(list[i].childNodes, 'spo_name') + '&nbsp;' + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), mapLeague) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, mapLeague) + msg);
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
  bhv.db.write('schedule:' + bhv.request.utils.getKey(), txt);
}
