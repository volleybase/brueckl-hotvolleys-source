var connect = require('../mro1/node_modules/connect');
var serveStatic = require('../mro1/node_modules/serve-static');

var app = connect();
//app.use(serveStatic('../'));
app.use(serveStatic('D:/github/'));
app.listen(81);

var appInfos = connect();
//appInfos.use(serveStatic('./infos'));
appInfos.use(serveStatic('D:/github/brueckl-hotvolleys/infos'));
appInfos.listen(82);

var appDocs = connect();
//appDocs.use(serveStatic('../../_docus/www'));
//appDocs.use(serveStatic('/_docus/www'));
appDocs.use(serveStatic('D:/_docus/www'));
appDocs.listen(83);

console.log('81: BHV root');
console.log('82: BHV infos');
console.log('83: www-docus');
