var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];

// #region -- prepare main namespace ------------------------------------------

if (window.bhv === undefined) {
  window.bhv = {};
}

// #endregion -- prepare main namespace ---------------------------------------

// #region -- The schedules. --------------------------------------------------

/**
 * The schedules.
 */
window.bhv.schedule = {

  /**
   * Starts the loading of the schedules.
   * @return {void}
   */
  getSchedules: function() {
    var IDX_BEW = 0,
        IDX_TEA = 3,
        IDX_ONSUCCESS = 1,
        found = false,
        key = window.bhv.request.utils.getKey();

    // check senior league
    if (mapLeague) {
      var keys = Object.keys(mapLeague);
      for (var k1 = 0; k1 < keys.length; ++k1) {
        var mm = mapLeague[keys[k1]];
        if (mm && mm[key]) {
          if (keys[k1] === activeSeason) {
            found = window.bhv.request.querySchedules(
              mm[key][IDX_BEW], mm[key][IDX_TEA],
              mm[key][IDX_ONSUCCESS], this.getSchedulesOffline
            );
          } else {
            found = window.bhv.request.querySchedulesArchiveGz(
              keys[k1], key,
              mm[key][IDX_ONSUCCESS], this.getSchedulesOffline
            );
          }
        }
      }
    }

    // check kids leagues/tournaments
    if (!found && mapKids) {
      var keysK = Object.keys(mapKids);
      for (var k2 = 0; k2 < keysK.length; ++k2) {
        var mmK = mapKids[keysK[k2]];
        if (mmK && mmK[key]) {
          if (keysK[k2] === activeSeason) {
            found = window.bhv.request.queryKidsSchedules(
              mmK[key][IDX_BEW],
              mmK[key][IDX_ONSUCCESS], this.getSchedulesOffline
            );
          } else {
            found = window.bhv.request.queryKidsSchedulesArchiveGz(
              keysK[k2], key,
              mmK[key][IDX_ONSUCCESS], this.getSchedulesOffline
            );
          }
        }
      }
    }

    // error: league/tournament not found
    if (!found) {
      window.bhv.request.utils.inject('Ungültige Termine!');
    }
  },

  getAllSchedules: function(keyEnabled, from, till, clubs, callbackLeague) {
    var handlerXDates;

    // query games
    window.bhv.request.queryMultiSchedules(
      from, till, clubs,
      function(response) {

        var i, list, bew, id, work, datKey, day, date, time, spNr, teams, gymn,
            gameRes,
            res = [],
            loaded = [],
            // create xml data
            xml = window.bhv.request.xml.fromText(response, 'xml');
        if (xml) {

          // get list of dates
          list = window.bhv.request.xml.getNodes(xml, 'termin');
          if (list && list.length) {

            for (i = 0; i < list.length; ++i) {

              // get id of next game to block if loaded twice
              // (some games might belong to two leagues - mevza some years ago)
              id = window.bhv.request.xml.findNode(list[i].childNodes, 'spi_id');
              if (loaded.indexOf(id) === -1) {
                loaded.push(id);

                datKey = window.bhv.request.xml.findNode(list[i].childNodes, 'spi_datum');
                if (datKey && datKey.length >= 10) {
                  work = datKey.substr(0, 10)
                    // .replace('2015', '2019')
                    .split('.');
                  datKey = '' + work[2] + work[1] + work[0];

                  bew = window.bhv.request.xml.findNode(list[i].childNodes, 'bew_kurz');

                  spNr = window.bhv.request.xml.findNode(list[i].childNodes, 'spi_nummer');
                  day = days[window.bhv.request.xml.findNode(list[i].childNodes, 'tag')];
                  date = window.bhv.request.xml.findNode(list[i].childNodes, 'datum');
                  time = window.bhv.request.xml.findNode(list[i].childNodes, 'zeit');

                  teams = window.bhv.request.utils.checkBold(
                    window.bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'))
                    + ' : '
                    + window.bhv.request.utils.checkBold(
                      window.bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'));
                  gymn = window.bhv.request.xml.findNode(list[i].childNodes, 'spo_name');

                  gameRes = window.bhv.request.xml.createGameResult(list[i].childNodes);

                  res.push({
                    'date': datKey,
                    'enabled': datKey.substr(0, keyEnabled.length) === keyEnabled,
                    'text': bew,
                    'info': spNr + ' ' + day + ' ' + date + ' ' + time + ' '
                      + teams + '  ' + (gameRes ? gameRes : gymn)
                  });
                }
              }
            }
          }
        }

        callbackLeague(res);

      }, function(err) {
        console.log('Cannot load data!');
        console.log(err);
      });

    // query kids tournaments
    window.bhv.request.queryMultiKidsSchedules(
      from, till, 'brückl',
      function(response) {

        // create xml data
        var tournament, tournaments, t, id, work, key, text, info,
            teams0, teams, noTab,
            res = [],
            loaded = [],
            xml = window.bhv.request.xml.fromText(response, 'xml');
        if (xml) {

          // get list of tournaments
          tournaments = window.bhv.request.xml.getNodes(xml, 'turniere');
          if (tournaments && tournaments.length) {
            for (t = 0; t < tournaments.length; ++t) {
              tournament = tournaments[t];

              // get id of next tournament to block if loaded twice
              // (some tournaments belong to two leagues - m + f)
              id = window.bhv.request.xml.findNode(tournament.childNodes, 'id');
              if (loaded.indexOf(id) === -1) {
                loaded.push(id);

                work = window.bhv.request.xml.findNode(tournament.childNodes, 'von')
                  .split('.');
                key = '' + work[2] + work[1] + work[0];

                text = window.bhv.request.xml.findNode(tournament.childNodes, 'turnier_kurz');
                info = window.bhv.schedule._tournamentInfo(tournament) + NL + NL;

                teams0 = window.bhv.request.xml.findNode(tournament.childNodes, 'anmerkung');
                if (teams0) {
                  noTab = teams0.substr(0, 2) === '0:';
                  teams = teams0.split('|');

                  for (var tea = 0; tea < teams.length; ++tea) {
                    info += window.bhv.schedule._teamInfo(teams, tea, noTab, 'brückl');
                  }
                }

                res.push({
                  'date': key,
                  'enabled': key.substr(0, keyEnabled.length) === keyEnabled,
                  'text': text,
                  'info': info
                });
              }
            }
          }

          callbackLeague(res);
        }
      }, function(err) {
        console.log('Cannot load data!');
        console.log(err);
      });

    // query extra dates from github
    handlerXDates = function(data) {
      var dates0, dates, key, keys, i, item,
          res = [];

      if (data) {
        try {
          dates0 = JSON.parse(data);
          if (dates0 && dates0.content) {
            dates = JSON.parse(base64.decode(dates0.content));
            keys = Object.keys(dates);
            for (i = 0; i < keys.length; ++i) {
              key = keys[i];
              if (key >= from && key <= till) {
                item = dates[key];
                key = key.replace(/-/g, '');
                res.push({
                  'date': key,
                  'enabled': key.substr(0, keyEnabled.length) === keyEnabled && item.info,
                  'text': item.text,
                  'info': item.info ? item.info : ''
                });
              }
            }
          }
        } catch (err) {
          log('--------------------------------------------------------------');
          log('Cannot parse x-dates!');
          log(err);
          log('--------------------------------------------------------------');
        }
      }

      callbackLeague(res);
    };

    window.bhv.request.queryXtraDates(from, till, handlerXDates, function(err) {
      console.log('Cannot load x-dates!');
      console.log(err);
    });
  },

  /**
   * Injects the stored schedules if offline.
   * @return {void}
   */
  getSchedulesOffline: function() {
    window.bhv.request.utils.showOffline('schedules');
  },

  /**
   * Creates the schedules for a junior championship.
   * @param {string} reponse The response from the web service.
   * @return {void}
   */
  kidsSchedules: function(response) {
    // create xml data
    var msg = '',
        xml = window.bhv.request.xml.fromText(response, 'xml');
    if (xml) {

      // get list of tournaments
      var tournaments = window.bhv.request.xml.getNodes(xml, 'turniere');
      if (tournaments && tournaments.length) {
        var key = window.bhv.request.utils.getKey(),
            pattern = activeSeason && mapKids[activeSeason]
              && mapKids[activeSeason][key] && mapKids[activeSeason][key][3]
              ? mapKids[activeSeason][key][3] : 'brückl';
        for (var t = 0; t < tournaments.length; ++t) {
          var tournament = tournaments[t],
              teams0 = window.bhv.request.xml.findNode(tournament.childNodes, 'anmerkung');
          if (teams0
            && (!pattern || teams0.toLowerCase().indexOf(pattern) > -1)) {

            var noTab = teams0.substr(0, 2) === '0:',
                teams = teams0.split('|');

            msg += NL + window.bhv.schedule._tournamentInfo(tournament) + NL;
            for (var tea = 0; tea < teams.length; ++tea) {
              msg += window.bhv.schedule._teamInfo(teams, tea, noTab, pattern);
            }
          }
        }

        // add entry for finals
        if (finals && activeSeason && key
            && finals[activeSeason] && finals[activeSeason][key]) {
          msg += NL + NL + '<b class="team">' + finals[activeSeason][key] + '</b>' + NL;
        }
      }
    }

    // msg += '<hr>' + JSON.stringify(tournaments, null, 2);
    window.bhv.request.utils.inject(window.bhv.request.utils.getTitle('schedules', null, mapKids) + msg);
  },

  _tournamentInfo: function(tournament) {
    return '<b class="team">'
      + window.bhv.request.xml.findNode(tournament.childNodes, 'turnier_kurz')
      + ' ('
      + window.bhv.request.xml.findNode(tournament.childNodes, 'von')
      + ' '
      + window.bhv.request.xml.findNode(tournament.childNodes, 'bewerb_kurz')
      + '  '
      + window.bhv.request.xml.findNode(tournament.childNodes, 'bewerb_name')
      + ')</b>';
  },

  _teamInfo: function(teams, tea, noTab, pattern) {
    var parts = teams[tea].split(':'),
        pts = parts.shift(),
        nam = parts.join(':'),
        own = pattern && nam.toLowerCase().indexOf(pattern) > -1;

    if (noTab) {
      // entry list
      return '- '
        + (own ? '<b class="team">' : '')
        + nam
        + (own ? '</b>' : '')
        + NL;
    }

    // standings of tournament
    return (teams.length > 9 && tea < 9 ? '  ' : ' ')
      + (own ? '<b class="team">' : '')
      + (tea + 1) + '. ' + window.bhv.request.utils.fillColumn(nam, 40)
      + window.bhv.request.utils.fillColumn(pts, -4)
      + (own ? '</b>' : '')
      + NL;
  },

  /**
   * Creates the schedules of a league.
   * @param {string} reponse The response from the web service.
   * @return {void}
   */
  leagueSchedules: function(response) {

    // create xml data
    var xml = window.bhv.request.xml.fromText(response, 'xml');
    if (xml) {

      // get list of dates
      var list = window.bhv.request.xml.getNodes(xml, 'termin');
      if (list && list.length) {

        var LEN_DAY = 4,
            LEN_DATE = 12,
            LEN_TIME = 7,
            LEN_NO = -3,
            LEN_RD = -2,
            LEN_XNO = 8,
            LEN_TEAM = 28,
            fmt = window.bhv.request.utils.fillColumn;

        // create text
        var msg = NL + fmt('Tag', LEN_DAY) + fmt('Datum', LEN_DATE) + fmt('Zeit', LEN_TIME)
            + fmt('Nr', LEN_XNO)
            + fmt('Heim', LEN_TEAM + 1) + fmt('Gast', LEN_TEAM + 1) + 'Halle&nbsp;' + NL;
        for (var i = 0; i < list.length; ++i) {
          var day0 = window.bhv.request.xml.findNode(list[i].childNodes, 'tag'),
              day = fmt(day0 === '' ? '?' : days[day0], LEN_DAY),
              dat0 = window.bhv.request.xml.findNode(list[i].childNodes, 'datum'),
              dat = fmt(dat0 === '' ? '??.??.????' : dat0, LEN_DATE),
              tim0 = window.bhv.request.xml.findNode(list[i].childNodes, 'zeit'),
              tim = fmt(tim0 === '' ? '??:??' : tim0, LEN_TIME),
              no0 = window.bhv.request.xml.findNode(list[i].childNodes, 'spi_nummer'),
              no1 = fmt(no0 === '' ? '???' : no0, LEN_NO, '0'),
              rd0 = window.bhv.request.xml.findNode(list[i].childNodes, 'spi_runde'),
              rd = fmt(rd0 === '' ? '??' : rd0, LEN_RD, '0'),
              no = rd + '/' + no1,
              gymn0 = window.bhv.request.xml.findNode(list[i].childNodes, 'spo_name'),
              gymn = (gymn0 === '' ? '(???)' : gymn0.replace(' ', '&nbsp;'));

              msg += day + dat + tim + no + '&nbsp;' + '&nbsp;'
                + window.bhv.request.utils.checkBold(fmt(
                  window.bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'), LEN_TEAM)) + '&nbsp;'
                + window.bhv.request.utils.checkBold(fmt(
                  window.bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'), LEN_TEAM)) + '&nbsp;'
                + gymn + '&nbsp;' + NL;
        }

        // save data for offline mode
        window.bhv.schedule._save(window.bhv.request.utils.getTitle('schedules', new Date(), mapLeague) + msg);
        // add created text to page
        window.bhv.request.utils.inject(window.bhv.request.utils.getTitle('schedules', null, mapLeague) + msg);
      }
    }
  },

  /**
   * Stores the data for offline access.
   * @param {string} txt The data to display.
   * @return {void}
   */
  _save: function(txt) {
    // store data for offline reading
    window.bhv.db.write('schedules:' + window.bhv.request.utils.getKey(), txt);
  }
}

// #endregion -- The schedules. -----------------------------------------------

// #region -- create archive mode ---------------------------------------------

// if to create the archive
if (window.bhv.archive) {
  window.bhv.archive.getSchedulesMaps = function(key) {
    return {
      'leagues': mapLeague[key],
      'kids': mapKids[key],
      'finals': finals[key]
    };
  }
}

// #endregion -- create archive mode ------------------------------------------

var activeSeason = '21';

var mapLeague = {
  // dont forget to set the ids of the clubs in calendar/controller -> 21, 1220
  // on calling  window.bhv.schedule.getAllSchedules(...)
  '21': {
    // BL 26179, team: 33165
    'br1g_21': [26179, window.bhv.schedule.leagueSchedules, 'Termine (Herbst)', 33165],
    'br1sp_21': [26760, window.bhv.schedule.leagueSchedules, 'Termine', 33165],
    'br1r_21': [27090, window.bhv.schedule.leagueSchedules, 'Relegation', 33165],
    'br1cup_21': [26176, window.bhv.schedule.leagueSchedules, 'Termine (Cup)', 33212],
    // LL 26515, 33597
    'br2g_21': [26515, window.bhv.schedule.leagueSchedules, 'Termine Landesliga', [1220, 33597]],
    // UL 26519, 33611
    'br3g_21': [26519, window.bhv.schedule.leagueSchedules, 'Termine Unterliga', 33611],
    // U16
    'u16_21_1': [27020, window.bhv.schedule.leagueSchedules, 'ÖMS U16 - Halbfinale', [1220, 34211]],
    // U18
    'u18_21_5': [27058, window.bhv.schedule.leagueSchedules, 'ÖMS U18 - Gruppe 5', [1220, 34236]]
  },
  '20': {
    // // UL 24971 3: 31661, 4: 31662
    // 'br4g_20': [24971, window.bhv.schedule.leagueSchedules, 'Termine Unterliga', 31662],
    // 'br3g_20': [24971, window.bhv.schedule.leagueSchedules, 'Termine Unterliga', 31661],
    // // LLD: Termine/24967: Team als array von (vrn_id, tea_id)
    // 'br2g_20': [24967, window.bhv.schedule.leagueSchedules, 'Termine Landesliga (GD)', [1220, 31654]],
    // 'br2m_20': [25506, window.bhv.schedule.leagueSchedules, 'Termine Landesliga (MPO)', [1220, 31654]],
    // // BL 24649, 1: 30505
    // 'br1g_20': [24649, window.bhv.schedule.leagueSchedules, 'Termine Bundesliga', 30505],
  },
  '19': {
    // 'br4g_19': [22934, window.bhv.schedule.leagueSchedules, 'Termine Unterliga (GD)', 29075],
    // 'br4_19': [23784, window.bhv.schedule.leagueSchedules, 'Termine Unterliga (FD)', 29075],
    //
    // 'br3g': [22934, window.bhv.schedule.leagueSchedules, 'Termine Unterliga (GD)', 28955],
    // 'br3_19': [23747, window.bhv.schedule.leagueSchedules, 'Termine Landesliga (AR)', 30420],
    //
    // 'br2g_19': [22933, window.bhv.schedule.leagueSchedules, 'Termine Landesliga (GD)', 28951],
    // 'br2m_19': [23746, window.bhv.schedule.leagueSchedules, 'Termine Landesliga (MPO)', 28951],
    //
    // 'br1g_19': [22691, window.bhv.schedule.leagueSchedules, 'Termine Bundesliga (GD)', 27423],
    // 'br1_19': [23666, window.bhv.schedule.leagueSchedules, 'Termine Bundesliga (MR)', 27423]
  }
};

var mapKids = {
  '20': {
    'u16_20': [25172, window.bhv.schedule.kidsSchedules, 'Turniere U16', 'brückl'],
    'u15_20': [25174, window.bhv.schedule.kidsSchedules, 'Turniere U15', 'brückl'],
    'u14_20': [25175, window.bhv.schedule.kidsSchedules, 'Turniere U14', 'brückl'],
    'u13_20': [25176, window.bhv.schedule.kidsSchedules, 'Turniere U13', 'brückl'],
    'u12_20': [25177, window.bhv.schedule.kidsSchedules, 'Turniere U12', 'brückl'],
  },
  '19': {
    'u10_19': [23058, window.bhv.schedule.kidsSchedules, 'Turniere U10', 'brückl'],
    'u11_19': [23059, window.bhv.schedule.kidsSchedules, 'Turniere U11', 'brückl'],
    'u12_19': [23060, window.bhv.schedule.kidsSchedules, 'Turniere U12', 'brückl'],
    'u13_19': [23061, window.bhv.schedule.kidsSchedules, 'Turniere U13', 'brückl'],
    'u15_19': [23063, window.bhv.schedule.kidsSchedules, 'Turniere U15', 'brückl']
  }
};

var finals = {
  '20': {
    // use these dates before the kvv-system has entries for the finals
    'u16_20': "Finale (So 03.05.2019  ???)",
    'u15_20': "Finale (Sa 25.04.2019  ???)",
    'u14_20': "Finale (Fr 01.05.2019  ???)",
    'u13_20': "Finale (So 17.05.2019  ???)",
    'u12_20': "Finale (Do 21.05.2019  ???)"
  },
  '19': {
    // use these dates before the kvv-system has entries for the finals
    // 'u10_19': "Finale (Do 30.05.2019  Brückl)",
    // 'u11_19': "Finale (So 19.05.2019  Brückl)",
    // 'u12_19': "Finale (So 07.04.2019  Klagenfurt)",
    // 'u13_19': "Finale (Sa 27.04.2019  Wolfsberg)",
    // 'u15_19': "Finale (So 05.05.2019  Klagenfurt)",
    // 'u17_19': "Finale (So 03.03.2019  Villach)",
    // 'u19_19': "Finale (So 27.01.2019  Klagenfurt)"
  }
};
