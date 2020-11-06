// var express = require('d:/workdir/brueckl-hotvolleys-source/node_modules/express')
var express = require('express')
var PORT_BHV_INFOAPP = 443;

// #region -- BHV-Info - 5001 (currently not working) -------------------------

var app = express()
var cors = require('cors')

// logging
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.use(cors())

// server
app.use(express.static('D:/workdir/'))

// error info
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
  console.log('%s %s %s %s', req.method, res.statusCode, req.url, req.path);
})

// start
app.listen(5001, function () {
  console.log('BHV-Info (5001)!')
})

// #endregion

// #region -- volleybase ------------------------------------------------------

var volleybase = express()

// logging
volleybase.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// server
volleybase.use(express.static('D:/workdir/volleybase.github.io'))

// error info
volleybase.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
  console.log('%s %s %s %s', req.method, res.statusCode, req.url, req.path);
})

// start
volleybase.listen(88, function () {
  console.log('Volleybase(88)!')
})

// #endregion

// #region -- bhv - redirect :80 ----------------------------------------------

var bhv80 = express()

// logging
const logger80 = function(req, res, next) {
  console.log('%s %s %s %s', '80->-' + PORT_BHV_INFOAPP, req.method, req.url, req.path);
  next();
}
bhv80.use(logger80)

bhv80.use (function (req, res, next) {
	// request was via http, so redirect to https
  const target = 'https://' + req.headers.host + ':' + PORT_BHV_INFOAPP + req.url;
  console.log('redirect to %s', target);
	res.redirect(target);
});

// start
bhv80.listen(80, function () {
  console.log('80 redirect!')
})

// #endregion



// #region -- bhv - new info pages --------------------------------------------

var bhv = express()
var bhv2 = express()

// https://github.com/aerwin/https-redirect-demo/blob/master/server.js

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
// bhv2.enable('trust proxy');

// logging
const logger = function(req, res, next) {
  console.log(
    '%s %s %s %s', req.method, req.protocol,
    (req.headers && req.headers['host'] ? req.headers['host'] : req.hostname),
    req.url
  );
  next();
}
bhv.use(logger)
bhv2.use(logger)

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
// bhv2.use (function (req, res, next) {
// 	if (req.secure) {
// 		// request was via https, so do no special handling
// 		next();
// 	} else {
// 		// request was via http, so redirect to https
// 		res.redirect('https://' + req.headers.host + req.url);
// 	}
// });

// static files
bhv.use(express.static('D:/workdir/BruecklHotvolleys.github.io'))
bhv2.use(express.static('D:/workdir/BruecklHotvolleys.github.io'))

// error info
const onerror = function (req, res, next) {
  res.status(404).sendFile('D:/workdir/BruecklHotvolleys.github.io/404.html');
  console.log('BHV: %s %s %s %s', req.method, res.statusCode, req.url, req.path);
}
bhv.use(onerror)
bhv2.use(onerror)

// start
bhv.listen(5002, function () {
  console.log('BHV Info pages(5002)!')
})

// #endregion

// #region -- https server (BHV-Info-App) -------------------------------------

// https-server (http 1.1) or spdy-server (http 2)
var useHttp2 = true
var https = useHttp2 ? require('spdy') : require('https')
var bhvServer = undefined

var fs = require('fs');
var options = {
  pfx: fs.readFileSync('D:/workdir/brueckl-hotvolleys-source/_server/certificate9.pfx'),
  passphrase: 'bhv.bhv.bhv'
};
if (useHttp2) {
  // ??? options.allowHTTP1 = true
}

if (useHttp2) {
  bhvServer = https
    .createServer(options, bhv2)
    .listen(PORT_BHV_INFOAPP, (error) => {
      if (error) {
        console.error(error)
        return process.exit(1)
      } else {
        console.log('BHV Info pages with http2(' + PORT_BHV_INFOAPP + ')!')
      }
    })
} else {
  bhvServer = https.createServer(options, bhv2);
  bhvServer.listen(PORT_BHV_INFOAPP, 'localhost');
  console.log('BHV Info pages with https(' + PORT_BHV_INFOAPP + ')!')
}

// #endregion


// #region -- bhv - new info pages --------------------------------------------

var bhvTest = express()

// logging
const loggerTest = function(req, res, next) {
  console.log(
    '(T) %s %s %s %s', req.method, req.protocol,
    (req.headers && req.headers['host'] ? req.headers['host'] : req.hostname),
    req.url
  );
  next();
}
bhvTest.use(loggerTest)

// static files
bhvTest.use(express.static('D:/workdir/bhv-test'))

// error info
const onerrorTest = function (req, res, next) {
  res.status(404).sendFile('D:/workdir/bhv-test/404.html');
  console.log('BHV(Test): %s %s %s %s', req.method, res.statusCode, req.url, req.path);
}
bhvTest.use(onerror)

// start
bhvTest.listen(5050, function () {
  console.log('BHV Info pages - test(5050)!')
})

// #endregion
