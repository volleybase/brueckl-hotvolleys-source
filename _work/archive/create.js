// #region -- TODOS -----------------------------------------------------------

// TODO load players -> create archive
// TODO combine old data into archive
//      statistics
//      ...

// #endregion

// #region -- Load libraries, main config -------------------------------------

// html loader
const cheerio = require('cheerio')
// io
const path = require('path')
const fs = require('fs')
// file compressor
const pako = require('pako')

// which data to load
const withMap = false
const load = {
  results: false,
  standings: false,
  schedules: false,
  players: true
}

// #endregion

console.log('Create archive.')

// #region -- simulate a browser - not beautiful, but it works ----------------

// window is the main namespace of a browser
window = {
  bhv: {
    archive: {}
  }
}

// simulate location of browser
location = {
  protocol: 'http:'
}

// its not an IE
ie = 0  // NOSONAR  make var global!

// simulate AJAX of browser
window.XMLHttpRequest = XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// #endregion

// #region -- load scripts to query kvv server into "simulated browser" -------

// load request
var req = require('../../script/request.js')
// load results handler
var results = require('../../script/results.js')
// load standings handler
var standings = require('../../script/standings.js')
// load schedules handler
var schedules = require('../../script/schedule.js')
// load players handler
var players = require('../../script/players.js')

// the season to load
const currentSeason = '20';
// the directory where to create the archive
const archiveDir = 'D:/workdir/brueckl-hotvolleys-source/archive/' + currentSeason;
// the final date of the season
const titlePostfix = ' (31.3.2020)';

/**
 * A dummy offline handler to output an error info.
 * @return {void}
 */
function offline() {
  console.log('##############################################################')
  console.log('??????????????????????????????????????????????????????????????')
  console.log('offline')
  console.log('??????????????????????????????????????????????????????????????')
  console.log('##############################################################')
}

// #endregion

// #region -- xml generator ---------------------------------------------------

/**
 * An xml item.
 */
class Item {

  /**
   * Creates an xml item.
   * @param {string} tag The name of the tag.
   * @param {string|Item|Array<Item>} [content] The optional content.
   */
  constructor(tag, content) {
    this.tag = tag;
    var cont = content;
    if (typeof cont === 'string') {
      cont = cont
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
    }
    this.content = cont;
    this.attr = [];
  }

  /**
   * Adds an attribute.
   * @param {string} key The name of the attribute.
   * @param {string} [value] The optional value of the attribute. If not set,
   * the key will be taken as value. Pass an empty string if you need an empty
   * value.
   * @return {void}
   */
  addAttribute(key, value) {
    var val = value === null || value === undefined ? '' + key : '' + value;
    this.attr.push(key + '="' + val.replace('"', "&quot;") + '"');
  }

  /**
   * Adds a content.
   * @param {string|Item} item The item to add to content.
   * @return {void}
   */
  add(item) {
    if (item) {
      if (!this.content) {
        this.content = item;

      } else if (Array.isArray(this.content)) {
        this.content.push(item);

      } else {
        const buf = [];
        buf.push(this.content);
        buf.push(item);
        this.content = buf;
      }
    }
  }

  /**
   * Creates the resulting string representation.
   * @return {string} The string representation of the xml item and its content.
   */
  toStr() {
    const content = this.contentToStr();
    return this.startTag() + (content ? content : '') + this.endTag();
  }

  /**
   * Creates the resulting string representation of the content of this item.
   * @return {string} The string representation of the content of this item.
   */
  contentToStr() {
    if (typeof this.content === 'string' && this.content) {
      return this.content;

    } else if (this.content instanceof Item) {
      return this.content.toStr();

    } else if (Array.isArray(this.content)) {
      let msg = '';
      this.content.forEach((item) => {
        if (typeof item === 'string' && item) {
          msg += item;
        } else if (item instanceof Item) {
          msg += item.toStr();
        }
      })

      return msg;
    }

    return undefined;
  }

  /**
   * Creates the start tag.
   * @return {string} The start tag.
   */
  startTag() {
    let tag = '\n<' + this.tag;
    if (this.attr.length > 0) {
      this.attr.forEach((attr) => {
        tag += ' ' + attr;
      })
    }
    if (!this.content) {
      tag += ' /';
    }
    tag += '>';

    return tag;
  }

  /**
   * Creates the end tag.
   * @return {string} The end tag, or empty if items has not any content.
   */
  endTag() {
    if (this.content) {
      return (this.content instanceof Item || Array.isArray(this.content)
              ? '\n' : '') + '</' + this.tag + '>';
    }

    return '';
  }
}

/**
 * The xml data structure.
 */
class Xml extends Item {

  /**
   * Creates the xml data structure.
   */
  constructor() {
    super('xml', undefined)
  }

  /**
   * Creates the resulting string representation.
   * @return {string} The string representation of the xml data.
   */
  toStr() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'
      // + super.toStr();
      + Item.prototype.toStr.call(this)
  }
}

/**
 * Handles the html entities (currently only &).
 * @param {string} str The input string.
 * @return {string} The updated string.
 */
function handleEntities(str) {
  return str.replace('&', '&amp;');
}

/**
 * Compresses the given file.
 * @param {string} fn The name of the file to compress.
 * @return {void}
 */
function compress(fn) {
  // load, compress, and save a file.
  const data = fs.readFileSync(fn);
  const compressed = pako.deflate(data);
  fs.writeFileSync(fn + '.gz', compressed);
  console.log('The file ' + fn + '.gz has been saved!');
}

// #endregion

// #region -- Load the results. -----------------------------------------------

if (load.results) {
  console.log('Create results ' + currentSeason + '.')

  // create xml data
  const xmlRes = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlRes.add(xmlMap)
  }

  // load the map of results
  var mapResults = window.bhv.archive.getResultsMap(currentSeason);
  // console.log(mapResults);

  // 'br1_19': [23666, leagueResults, 'Ergebnisse Bundesliga (MR)', 27423],
  // 'u10f_19': [[24376, 24377, 24435, 24436], leagueResults, 'Ergebnisse', [30816, 30817, 30812]],
  // 'br4g_19': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 29075],
  var IDX_BEW = 0,
      IDX_FUN = 1,
      IDX_TIT = 2,
      IDX_TEA = 3,
      IDX_CLUB = 4,
      limitR = 999,
      // the counter of the enries of the map
      counterR1 = 0,
      // the counter of the read results
      counterR2 = 0;

  /**
   * The handler to add the read results to the xml data.
   * @param {string} response The response from server.
   * @param {string} key The key of the competition.
   * @param {string|Array<string>} comp The id or the ids of the competition(s).
   * @param {string} fun The name of the function to handle the results.
   * @param {string} tit The title of the results.
   * @param {string|Array<string>} team The id or the ids of the affected team(s).
   * @return {void}
   */
  function leagueResults(response, key, comp, fun, tit, team) {
    console.log((++counterR2) + ' - create xml data of results for ' + key + '.')

    // create a html parser to read the results
    const xmlResults = cheerio.load(response, {
      xmlMode: true
    })

    // create xml entry for a result
    const result = new Item('result', []);
    xmlRes.add(result);
    result.addAttribute('key', key);
    result.addAttribute('competition', comp);
    result.addAttribute('handler', fun);
    result.addAttribute('title', tit);
    result.addAttribute('team', team);

    // get all the results
    const arr = xmlResults('xml > ergebnis')
    arr.each((idx, res) => {

      // create an entry
      const ergebnis = new Item('ergebnis', [])
      result.add(ergebnis)

      // create a data item
      const arrItems = xmlResults('ergebnis > *', res)
      arrItems.each((idx2, item) => {
        if (item.type == 'tag') {
          ergebnis.add(new Item(item.name, cheerio.text(item.children)))
        } else {
          console.log('Invalid entry in xml: ', item)
        }
      })
    })

    // if all results read and written: output resulting xml file
    if (counterR2 === counterR1) {
      const fn = path.join(archiveDir, 'results.xml')

      fs.writeFile(fn, xmlRes.toStr(), 'utf8', (err) => {
        if (err) throw err;
        compress(fn)
        console.log('Archive has been created for results.');
      });
    }
  }

  // handle each entry of map of results
  Object.keys(mapResults).forEach((key0) => {
    const key = key0

    // current competitions
    const comp0 = mapResults[key][IDX_BEW];
    const comp = Array.isArray(comp0) ? comp0.join('|') : comp0;

    // handler
    const fun = mapResults[key][IDX_FUN].name;

    // title + date
    const tit = mapResults[key][IDX_TIT] + titlePostfix;

    // affected team(s) of club
    const team0 = mapResults[key][IDX_TEA];
    const team = Array.isArray(team0) ? team0.join('|') : team0;
    const idClub = mapResults[key][IDX_CLUB] === undefined
      ? 21 : mapResults[key][IDX_CLUB];

    // map entry if necessary
    if (withMap) {
      const result = new Item('result');
      xmlMap.add(result);
      result.addAttribute('key', key);
      result.addAttribute('competition', comp);
      result.addAttribute('handler', fun);
      result.addAttribute('title', tit);
      result.addAttribute('team', team);
    }

    if (--limitR >= 0) {
      // start query of kvv server
      console.log((++counterR1) + ' - create results for ' + key + '.')
      window.bhv.request.queryResults(
        comp0, team0, idClub,
        // handle the response to create xml entries
        function res(response) {
          leagueResults(response, key, comp, fun, tit, team)
        }, offline
      )
    }
  })
}

// #endregion

// #region -- Load the standings. ---------------------------------------------

if (load.standings) {
  console.log('Create standings ' + currentSeason + '.')

  // create xml data
  const xmlSt = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlSt.add(xmlMap)
  }

  // load the map of standings
  var mapStandings = window.bhv.archive.getStandingsMap(currentSeason);
  // console.log(mapStandings);

  // 'br1_19': [23666, leagueStandings, 'Tabelle Bundesliga (MR)'],
  // 'u10_19': [23058, kidsStandings, 'Tabelle U10 (Qualifikation)'],
  // 'u10f_19': [24437, kidsStandingsF, 'Endstand U10'],
  var IDXS_BEW = 0,
      IDXS_FUN = 1,
      IDXS_TIT = 2,
      limitS = 999,
      // the counter of the enries of the map
      counterS1 = 0,
      // the counter of the read standings
      counterS2 = 0;

  /**
   * The handler to add the read standings to the xml data.
   * @param {string} response The response from server.
   * @param {string} key The key of the competition.
   * @param {string|Array<string>} comp The id or the ids of the competition(s).
   * @param {string} fun The name of the function to handle the standings.
   * @param {string} tit The title of the standings.
   * @return {void}
   */
  function handleStandings(response, key, comp, fun, tit) {
    console.log((++counterS2) + ' - create xml data of standings for ' + key + '.')

    // create a html parser to read the standings
    const xmlStandings = cheerio.load(response, {
      xmlMode: true
    })

    // create xml entry for a competition
    const standings = new Item('standings', []);
    xmlSt.add(standings);
    standings.addAttribute('key', key);
    standings.addAttribute('competition', comp);
    standings.addAttribute('handler', fun);
    standings.addAttribute('title', tit);

    // get all the standings
    const arr = xmlStandings('xml > tabelle')
    arr.each((idx, res) => {
      // str += cheerio.xml(res) + '\n';

      // create an entry
      const st = new Item('tabelle', [])
      standings.add(st)

      // create a data item
      const arrItems = xmlStandings('tabelle > *', res)
      arrItems.each((idx2, item) => {
        if (item.type == 'tag') {
          st.add(new Item(item.name, cheerio.text(item.children)))
        } else {
          console.log('Invalid entry in xml: ', item)
        }
      })
    })

    // if all competition read and written: output standings xml file
    if (counterS2 === counterS1) {
      const fn = path.join(archiveDir, 'standings.xml')

      fs.writeFile(fn, xmlSt.toStr(), 'utf8', (err) => {
        if (err) throw err;
        compress(fn)
        console.log('Archive has been created for standings.');
      });
    }
  }

  // handle each entry of map of competitions
  Object.keys(mapStandings).forEach((key0) => {
    const key = key0

    // current competitions
    const comp0 = mapStandings[key][IDXS_BEW];
    const comp = Array.isArray(comp0) ? comp0.join('|') : comp0;

    // handler
    const fun = mapStandings[key][IDXS_FUN].name;

    // title + date
    const tit = mapStandings[key][IDXS_TIT] + titlePostfix;

    // map entry if necessary
    if (withMap) {
      const standings = new Item('standings');
      xmlMap.add(standings);
      standings.addAttribute('key', key);
      standings.addAttribute('competition', comp);
      standings.addAttribute('handler', fun);
      standings.addAttribute('title', tit);
    }

    if (--limitS >= 0) {
      // start query of kvv server
      console.log((++counterS1) + ' - create standings for ' + key + '.')
      window.bhv.request.queryStandings(
        comp0,
        // handle the response to create xml entries
        function res(response) {
          handleStandings(response, key, comp, fun, tit)
        }, offline
      )
    }
  })
}

// #endregion

// #region -- Load the schedules. ---------------------------------------------

if (load.schedules) {
  console.log('Create schedules ' + currentSeason + '.')

  // create xml data
  const xmlSch = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlSch.add(xmlMap)
  }

  // load the map of results
  var mapSchedules = window.bhv.archive.getSchedulesMaps(currentSeason),
      mapKids = mapSchedules['kids'];

  // kids schedules
  // 'u10_19': [23058, kidsSchedules, 'Turniere U10', 'brückl'],
  var IDXSCH_BEW = 0,
      IDXSCH_FUN = 1,
      IDXSCH_TIT = 2,
      IDXSCH_TEA = 3,
      limitSch = 999,
      // the counter of the enries of the map
      counterSch1 = 0,
      // the counter of the read results
      counterSch2 = 0;

  /**
   * The handler to add the read results to the xml data.
   * @param {string} response The response from server.
   * @param {string} key The key of the competition.
   * @param {string|Array<string>} comp The id or the ids of the competition(s).
   * @param {string} fun The name of the function to handle the results.
   * @param {string} tit The title of the results.
   * @param {string|Array<string>} team The id or the ids of the affected team(s).
   * @return {void}
   */
  function leagueKidsSchedules(response, key, comp, fun, tit, team) {
    console.log((++counterSch2) + ' - create xml data of schedules for ' + key + '.')

    // create a html parser to read the schedules
    const xmlSchedules = cheerio.load(response, {
      xmlMode: true
    })

    // create xml entry for a schedule
    const result = new Item('tournament', []);
    xmlSch.add(result);
    result.addAttribute('key', key);
    result.addAttribute('competition', comp);
    result.addAttribute('handler', fun);
    result.addAttribute('title', tit);
    result.addAttribute('team', team);

    // get all the tournaments
    const arr = xmlSchedules('xml > turniere')
    arr.each((idx, res) => {
      // str += handleEntities(cheerio.xml(res)) + '\n';

      // create a tournament
      const tournament = new Item('turniere', [])
      result.add(tournament)

      // create a data item
      const arrItems = xmlSchedules('turniere > *', res)
      arrItems.each((idx2, item) => {
        if (item.type == 'tag') {
          tournament.add(new Item(item.name, cheerio.text(item.children)))
        } else {
          console.log('Invalid entry in xml: ', item)
        }
      })
    })

    // if all competition read and written: output resulting xml file
    if (counterSch2 === counterSch1) {
      // console.log(xml.toStr())
      const fn = path.join(archiveDir, 'kidsschedules.xml')

      fs.writeFile(fn, xmlSch.toStr(), 'utf8', (err) => {
        if (err) throw err;
        compress(fn)
        console.log('Archive has been created for kids\' schedules.');
      });
    }
  }

  // handle each entry of map of tournaments of kids
  Object.keys(mapKids).forEach((key0) => {
    const key = key0

    // current competitions
    const comp0 = mapKids[key][IDXSCH_BEW];
    const comp = Array.isArray(comp0) ? comp0.join('|') : comp0;

    // handler
    const fun = mapKids[key][IDXSCH_FUN].name;

    // title + date
    const tit = mapKids[key][IDXSCH_TIT] + titlePostfix;

    // affected team(s)
    const team0 = mapKids[key][IDXSCH_TEA];
    const team = Array.isArray(team0) ? team0.join('|') : team0;

    // map entry if necessary
    if (withMap) {
      const result = new Item('result');
      xmlMap.add(result);
      result.addAttribute('key', key);
      result.addAttribute('competition', comp);
      result.addAttribute('handler', fun);
      result.addAttribute('title', tit);
      result.addAttribute('team', team);
    }

    if (--limitSch >= 0) {
      // start query of kvv server
      console.log((++counterSch1) + ' - create schedules for ' + key + '.')
      window.bhv.request.queryKidsSchedules(
        comp0,
        // handle the response to create xml entries
        function res(response) {
          leagueKidsSchedules(response, key, comp, fun, tit, team)
        }, offline
      )
    }
  })
}

// #endregion

// #region -- Load the players. -----------------------------------------------

if (load.players) {
  console.log('Create players ' + currentSeason + '.')

  // create xml data
  const xmlPla = new Xml()

  // load the map of players
  var mapPlayers = window.bhv.archive.getPlayersMap(currentSeason);

  var IDXP_TEA = 0,
      IDXP_TIT = 2,
      limitP = 999,
      // the counter of the enries of the map
      counterP1 = 0,
      // the counter of the read results
      counterP2 = 0;

  /**
   * The handler to add the read players to the xml data.
   * @param {string} response The response from server.
   * @param {string} key The key of the competition.
   * @param {string} team The id the affected team.
   * @param {string} tit The title of the players.
   * @return {void}
   */
  function handlePlayers(response, key, team, tit) {
    console.log((++counterP2) + ' - create xml data of players for ' + key + '.')

    // create a html parser to read the results
    const xmlPlayers = cheerio.load(response, {
      xmlMode: true
    })

    // create xml entry for a result
    const result = new Item('players', []);
    xmlPla.add(result);
    result.addAttribute('key', key);
    result.addAttribute('team', team);
    result.addAttribute('title', tit);

    // get all the results
    const arr = xmlPlayers('xml > kader')
    arr.each((idx, res) => {

      // create an entry
      const player = new Item('kader', [])
      result.add(player)

      // create a data item
      const arrItems = xmlPlayers('kader > *', res)
      arrItems.each((idx2, item) => {
        if (item.type == 'tag') {
          player.add(new Item(item.name, cheerio.text(item.children)))
        } else {
          console.log('Invalid entry in xml: ', item)
        }
      })
    })

    // if all players read and written: output resulting xml file
    if (counterP2 === counterP1) {
      const fn = path.join(archiveDir, 'players.xml')

      fs.writeFile(fn, xmlPla.toStr(), 'utf8', (err) => {
        if (err) throw err;
        compress(fn)
        console.log('Archive has been created for players.');
      });
    }
  }

  // handle each entry of map of results
  Object.keys(mapPlayers).forEach((key0) => {
    const key = key0

    // id of team
    const team = mapPlayers[key][IDXP_TEA];

    // title + date
    const tit = mapPlayers[key][IDXP_TIT] + titlePostfix;

    if (--limitP >= 0) {
      // start query of kvv server
      console.log((++counterP1) + ' - create players for ' + key + '.')
      window.bhv.request.queryPlayers(team,
        // handle the response to create xml entries
        function res(response) {
          handlePlayers(response, key, team, tit)
        }, offline
      )
    }
  })
}

// #endregion
