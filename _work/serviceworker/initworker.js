/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
'use strict';

function FileList() {
  this._list = [];

  this.add = (file) => {

    // add page without default 'index.html', too
    if (file.endsWith('/index.html')) {
      this._list.push("'" + file.substr(0, file.length - 10) + "'");
      this._list.push("'" + file.substr(0, file.length - 11) + "'");
    }

    this._list.push("'" + file + "'");
  };

  this.result = () => {
    return this._list.join(',\n    ');
  };

  this.count = () => {
    return this._list.length
  };
}

module.exports = function init(grunt) {

  grunt.registerMultiTask('initWorker', 'Create the service worker from template and files.', function() {
    grunt.log.debug('initWorker started...');

    let msg = '';
    const source = this.data.options.source,
          target = source + this.data.options.target,
          ignoreTarget = path.basename(target);
    grunt.log.debug('target: ' + target);

    // load template
    let template = fs.readFileSync(this.data.options.template, 'utf8');
    grunt.log.debug('template ' + this.data.options.template + ' loaded.');

    // all keys and names
    let cache_keys = '';
    // files
    const tplFiles = "'{{region}}': [\n    {{files}}\n  ]";
    let cache_files = '';

    // handle all definitions of files
    this.files.forEach((file) => {
      grunt.log.debug('');

      // region
      const region = file.dest;
      grunt.log.debug('Region: ' + region);
      let sums = '';

      // the files
      const filelist = new FileList();
      file.src.forEach((filename) => {
        grunt.log.debug('--> ' + filename);

        // -- get max file time
        // get file info
        grunt.log.debug('--> ' + source + filename);
        const fd = fs.openSync(source + filename),
              stat = fs.statSync(source + filename);
        fs.closeSync(fd);

        // create file list
        if ((stat.isFile() || stat.isSymbolicLink()) && filename !== ignoreTarget) {
          filelist.add('/' + filename);
          // read file content
          const buffer = fs.readFileSync(source + filename);
          sums += crypto
            .createHash('md5')
            .update(buffer)
            .digest('hex');
        } else {
          grunt.log.debug('Ignore ' + filename);
        }
        grunt.log.debug('--> ' + filename);
      });
      grunt.log.debug(filelist.count() + ' entries collected for ' + region + ':\n  ' + filelist.result());

      // create key of data cache for region
      const key = crypto
        .createHash('md5')
        .update(sums, 'ascii')
        .digest('hex');
      grunt.log.debug('key(' + region + '): ' + key);

      if (cache_keys != '') {
        cache_keys += ',\n  ';
      }
      cache_keys += "'" + region + "': 'bhv-infoapp-" + region +  '-' + key + "'";

      grunt.log.debug('set ' + filelist.count() + ' entries');
      if (cache_files != '') {
        cache_files += ',\n  ';
      }
      cache_files += tplFiles
        .replace('{{region}}', region)
        .replace('{{files}}', filelist.result());
    });

    // add all keys
    let re = new RegExp('{{keys}}', 'g');
    template = template.replace(re, cache_keys);

    // add all files
    re = new RegExp('{{files}}', 'g');
    template = template.replace(re, cache_files);


    // write resulting file
    msg += target;
    grunt.log.debug('Create: ' + target);
    fs.writeFileSync(target, template);
    grunt.log.ok('Service worker created: ' + (msg ? msg : 'none?!'));
  });
}
