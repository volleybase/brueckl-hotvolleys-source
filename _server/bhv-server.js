// var express = require('d:/workdir/brueckl-hotvolleys-source/node_modules/express')
var express = require('express')
var cors = require('cors')
var app = express()

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


// bhv - new info pages
var bhv = express()

// logging
bhv.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
})

// server
bhv.use(express.static('D:/workdir/BruecklHotvolleys.github.io'))

// error info
bhv.use(function (req, res, next) {
  // res.status(404).send("BHV: Can't find that!")
  res.status(404).sendFile('D:/workdir/BruecklHotvolleys.github.io/404.html');
  console.log('BHV: %s %s %s %s', req.method, res.statusCode, req.url, req.path);
})

// start
bhv.listen(5002, function () {
  console.log('BHV Info pages(5002)!')
})
