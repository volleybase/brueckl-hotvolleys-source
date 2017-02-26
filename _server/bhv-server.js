//var connect = require('../mro1/node_modules/connect');
//var serveStatic = require('../mro1/node_modules/serve-static');

//var express = require('express')
var express = require('d:/github/brueckl-hotvolleys-source/node_modules/express')
//var fs = require('fs')

var app = express()

// logging
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// server
app.use(express.static('D:/github/'))

// error info
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
  console.log('%s %s %s %s', req.method, res.statusCode, req.url, req.path);
})

// start
app.listen(5005, function () {
  console.log('BHV-Info (5005)!')
})


var volleybase = express()

// logging
volleybase.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// server
volleybase.use(express.static('D:/github/volleybase.github.io'))

// error info
volleybase.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
  console.log('%s %s %s %s', req.method, res.statusCode, req.url, req.path);
})

// start
volleybase.listen(88, function () {
  console.log('Volleybase(88)!')
})
