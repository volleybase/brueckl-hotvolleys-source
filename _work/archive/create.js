// #region -- Load libraries, main config -------------------------------------

const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
// const zlib = require('zlib');
const pako = require('pako')

const withMap = false
const load = {
  results: false,
  standings: false,
  schedules: false
}

// #endregion

console.log('Create archive.')

// #region -- simulate a browser - not beautiful, but it works ----------------

window = {
  bhv: {
    archive: {}
  }
}

location = {
  protocol: 'http:'
}

ie = 0  // NOSONAR  make var global!

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

// the directory where to create the archive
const archiveDir19 = 'D:/workdir/brueckl-hotvolleys-source/archive/19';
// the final date of season 18/19
const title19 = ' (30.6.2019)';

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
    this.content = content;
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
    if (value === null || value === undefined) {
      value = key;
    }
    this.attr.push(key + '="' + value + '"');
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
    return this.content ? '</' + this.tag + '>' : '';
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

// /**
//  * Compresses the given file.
//  * @param {string} fn The name of the file to compress.
//  * @return {void}
//  */
// function compress(fn) {
//   const fnGz = fn + '.gz'
//   const gzip = zlib.createGzip();
//   const inp = fs.createReadStream(fn);
//   const out = fs.createWriteStream(fnGz);
//   inp.pipe(gzip).pipe(out);
// }

function handleEntities(str) {
  return str.replace('&', '&amp;');
}

/**
 * Compresses the given file.
 * @param {string} fn The name of the file to compress.
 * @return {void}
 */
function compress(fn) {
  // fs.readFile(fn, (err, data) => {
  //   if (err) throw err;
  //
  //   const compressed = pako.deflate(data);
  //
  //   fs.writeFile(fn + '.gz', compressed, (err) => {
  //     if (err) throw err;
  //
  //     console.log('The file ' + fn + '.gz has been saved!');
  //   });
  // });

  const data = fs.readFileSync(fn);
  const compressed = pako.deflate(data);
  fs.writeFileSync(fn + '.gz', compressed);
  console.log('The file ' + fn + '.gz has been saved!');
}

// #endregion

// #region -- Load the results. -----------------------------------------------

if (load.results) {
  console.log('Create results 19.')

  // create xml data
  const xmlRes = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlRes.add(xmlMap)
  }

  // load the map of results
  var mapResults = window.bhv.archive.getResultsMap('19');
  // console.log(mapResults);

  // 'br1_19': [23666, leagueResults, 'Ergebnisse Bundesliga (MR)', 27423],
  // 'u10f_19': [[24376, 24377, 24435, 24436], leagueResults, 'Ergebnisse', [30816, 30817, 30812]],
  // 'br4g_19': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 29075],
  var IDX_BEW = 0,
      IDX_FUN = 1,
      IDX_TIT = 2,
      IDX_TEA = 3,
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

    // console.log(response)
    // var xml = bhv.request.xml.fromText(response, 'xml');
    const xmlResults = cheerio.load(response, {
      xmlMode: true
    })

    // get all the results
    const arr = xmlResults('xml > ergebnis')
    let str = ''
    arr.each((idx, res) => {
      str += cheerio.xml(res) + '\n';
    })
    // create xml entry for a competition
    const result = new Item('result', '\n' + str);
    xmlRes.add(result);
    result.addAttribute('key', key);
    result.addAttribute('competition', comp);
    result.addAttribute('handler', fun);
    result.addAttribute('title', tit);
    result.addAttribute('team', team);

    // if all competition read and written: output resulting xml file
    if (counterR2 === counterR1) {
      // console.log(xml.toStr())
      const fn = path.join(archiveDir19, 'results.xml')

      fs.writeFile(fn, xmlRes.toStr(), 'utf8', (err) => {
        if (err) throw err;
        compress(fn)
        console.log('Archive has been created for results.');
      });
    }
  }

  // handle each entry of map of competitions
  Object.keys(mapResults).forEach((key0) => {
    const key = key0

    // current competitions
    const comp0 = mapResults[key][IDX_BEW];
    const comp = Array.isArray(comp0) ? comp0.join('|') : comp0;

    // handler
    const fun = mapResults[key][IDX_FUN].name;

    // title
    const tit = mapResults[key][IDX_TIT] + title19;

    // affected team(s)
    const team0 = mapResults[key][IDX_TEA];
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

    if (--limitR >= 0) {
      // start query of kvv server
      console.log((++counterR1) + ' - create results for ' + key + '.')
      window.bhv.request.queryResults(
        comp0, team0,
        // handle the response to create xml entries
        function res(response) {
          leagueResults(response, key, comp, fun, tit, team)
        }, offline
      )
    }
  })
}

// #endregion

// #region -- Load the standings. -----------------------------------------------

if (load.standings) {
  console.log('Create standings 19.')

  // create xml data
  const xmlSt = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlSt.add(xmlMap)
  }

  // load the map of standings
  var mapStandings = window.bhv.archive.getStandingsMap('19');
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

    // console.log(response)
    const xmlStandings = cheerio.load(response, {
      xmlMode: true
    })

    // get all the standings
    const arr = xmlStandings('xml > tabelle')
    let str = ''
    arr.each((idx, res) => {
      str += cheerio.xml(res) + '\n';
    })
    // create xml entry for a competition
    const standings = new Item('standings', '\n' + str);
    xmlSt.add(standings);
    standings.addAttribute('key', key);
    standings.addAttribute('competition', comp);
    standings.addAttribute('handler', fun);
    standings.addAttribute('title', tit);

    // if all competition read and written: output standings xml file
    if (counterS2 === counterS1) {
      const fn = path.join(archiveDir19, 'standings.xml')

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

    // title
    const tit = mapStandings[key][IDXS_TIT] + title19;

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
  console.log('Create schedules 19.')

  // create xml data
  const xmlSch = new Xml()
  // is the map necessary?
  const xmlMap = new Item('map')
  if (withMap) {
    xmlSch.add(xmlMap)
  }

  // load the map of results
  var mapSchedules = window.bhv.archive.getSchedulesMaps('19'),
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

    // console.log(response)
    const xmlSchedules = cheerio.load(response, {
      xmlMode: true
    })

    // get all the results
    const arr = xmlSchedules('xml > turniere')
    let str = ''
    arr.each((idx, res) => {
      str += handleEntities(cheerio.xml(res)) + '\n';
    })
    // create xml entry for a competition
    const result = new Item('tournament', '\n' + str);
    xmlSch.add(result);
    result.addAttribute('key', key);
    result.addAttribute('competition', comp);
    result.addAttribute('handler', fun);
    result.addAttribute('title', tit);
    result.addAttribute('team', team);

    // if all competition read and written: output resulting xml file
    if (counterSch2 === counterSch1) {
      // console.log(xml.toStr())
      const fn = path.join(archiveDir19, 'kidsschedules.xml')

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

    // title
    const tit = mapKids[key][IDXSCH_TIT] + title19;

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
