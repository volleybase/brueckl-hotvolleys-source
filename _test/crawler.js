"use strict"
// crawler uses https.request - allow unautorized request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// lighthouse works because of adding my certificate to Authorities/Vertrauenswürdige Stammzertifizierungsstellen
// (Manage certificates from chrome settings(Advanced))

const Crawler = require('simplecrawler')
const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const options = {
  // "url": "http://localhost:5002",
  // "url": "https://localhost:5003",
  "url": "https://localhost",
  "output": "_test/result"
}

class MyQueue {

  constructor(handler) {
    this.handler = handler
    this.urls = []
    this.running = false
    this.handlerDone = undefined
    this.stopped = false
  }

  add(url) {
    this.urls.push(url)
  }

  next() {
    if (this.stopped) {
      return false
    }

    if (this.running) {
      return true
    }

    if (this.urls.length > 0) {
      this.running = true
      handler(this.urls.shift(), this.nextStep.bind(this))
      return true
    } else {
      this.running = false

      if (this.handlerDone) {
        this.handlerDone()
      }

      return false
    }
  }

  nextStep() {
    this.running = false
    this.next()
  }

  onDone(handlerDone) {
    this.handlerDone = handlerDone
  }
}

const handler = (url, next) => {
  console.log('Start test of ' + url);
  launchChromeAndRunLighthouse(url, opts, config).then(results => {
    const fn = path.resolve(options.output, encodeURIComponent(url)) + '.html'

    console.log('Write results of ' + url + ' to ' + fn);
    fs.writeFile(fn, results, (err) => {
      if (err) throw err;
      next()
    });
  });
}
const queue = new MyQueue(handler)
queue.onDone(() => {
  console.log('Done.')
})

const crawler = (options) => {

  const crawler = new Crawler(options.url)
  crawler.respectRobotsTxt = false
  crawler.parseHTMLComments = false
  crawler.parseScriptTags = false
  crawler.maxDepth = config.settings.crawler.maxDepth || 1

  // console.log('InvSSL ' + crawler.ignoreInvalidSSL)
  // crawler.ignoreInvalidSSL = true
  // console.log('InvSSL ' + crawler.ignoreInvalidSSL)
  //
  // console.log('Mime ' + crawler.supportedMimeTypes)
  // console.log('Protocols ' + crawler.allowedProtocols)

  crawler.discoverResources = (buffer, item) => {

    // load the html source into the parser
    const page = cheerio.load(buffer.toString('utf8'))

    // extract all link targets <a href="target" ...
    const links = page('a[href]').map(function () {
      return page(this).attr('href')
    }).get()

    return links
  }

  crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
    queue.add(queueItem.url)
    queue.next()
  })

  crawler.once('complete', () => {
    console.log('Crawling completed.')
  })

  crawler.start()
}

function launchChromeAndRunLighthouse(url, opts, config) {
  return chromeLauncher
    .launch({chromeFlags: opts.chromeFlags})
    .then(chrome => {
      opts.port = chrome.port;
      // console.log('Start lh for ' + url + ' with debugport ' + opts.port);
      return lighthouse(url, opts, config).then(results => {
        // console.log('End lh for ' + url);

        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)

        // return chrome.kill().then(() => results.lhr)
        return chrome.kill().then(() => results.report)
      });
    });
}

const opts = {
  //     '--chrome-flags=--headless --disable-gpu',
  // ? '--show-paint-rects',
  "chromeFlags": ['--headless', '--disable-gpu'],
  //     // '--output=json',
  //     // '--output-path=stdout',
  //     '--output=html',
  //     '--output-path=_test/result',

  "output": ["html"],

  //     '--disable-device-emulation',
  "disable-device-emulation": true

  // ???
  //     '--disable-cpu-throttling',
  //     '--disable-network-throttling',

  // not possible
  //     `--config-path=${configPath}`
}

const config = {
  "extends": "lighthouse:full",
  "settings": {
    "crawler": {
      "maxDepth": 22
    }
  }
}

module.exports = crawler;

// start
console.log('Start testing...');
crawler(options);
