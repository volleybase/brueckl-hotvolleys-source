// var express = require('d:/workdir/brueckl-hotvolleys-source/node_modules/express')
var express = require('express')


// -- BHV-Info - 5001 (currently not working) ---------------------------------

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


// -- volleybase --------------------------------------------------------------

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


// -- bhv - new info pages ----------------------------------------------------

var bhv = express()
var bhv2 = express()

// logging
const logger = function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
}
bhv.use(logger)
bhv2.use(logger)

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

// -- https server (BHV-Info-App) ---------------------------------------------

// https-server (http 1.1) or spdy-server (http 2)
var useHttp2 = true
var https = useHttp2 ? require('spdy') : require('https')

var fs = require('fs');
var options = {
  pfx: fs.readFileSync('D:/workdir/brueckl-hotvolleys-source/_server/certificate9.pfx'),
  passphrase: 'bhv.bhv.bhv'
};
if (useHttp2) {
  // ??? options.allowHTTP1 = true
}

if (useHttp2) {
  https
    .createServer(options, bhv2)
    .listen(5003, (error) => {
      if (error) {
        console.error(error)
        return process.exit(1)
      } else {
        console.log('BHV Info pages with http2(5003)!')
      }
    })

} else {
  var httpsServer = https.createServer(options, bhv2);
  httpsServer.listen(5003, 'localhost');
  console.log('BHV Info pages with https(5003)!')
}
