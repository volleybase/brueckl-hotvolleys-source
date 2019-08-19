/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */
const fs = require('fs')
const path = require('path')

'use strict';

function FileList() {
  this._list = [];

  this.add = (file) => {

    // add page without default 'index.html', too
    if (file.endsWith('/index.html')) {
      this._list.push("'" + file.substr(0, file.length - 10) + "'");
    }

    this._list.push("'" + file + "'");
  };

  this.result = () => {
    return this._list.join(',\n  ');
  };

  this.count = () => {
    return this._list.length;
  }
}

module.exports = function init(grunt) {

  grunt.registerMultiTask('initWorker', 'Create the service worker from template and files.', function() {

    let msg = '';

    // load template
    let template = fs.readFileSync(this.data.options.template, 'utf8')
    grunt.log.debug('template ' + this.data.options.template + ' loaded.')

    // handle all definitions of files
    this.files.forEach((file) => {
      // grunt.log.debug('Fileinfo: ' + JSON.stringify(file))
      const dest = file.dest;
      grunt.log.debug('Target: ' + dest)
      const ignoreDest = path.basename(dest)

      // handle each file of current definition
      let filelist = new FileList()
      file.src.forEach((file2) => {
        // grunt.log.debug('--> ' + (++index) + ' ' + file2)

        const stats = fs.statSync(file2)

        if ((stats.isFile() || stats.isSymbolicLink()) && file2 !== ignoreDest) {
          filelist.add('/' + file2)
        } else {
          grunt.log.debug('Ignore ' + file2);
        }
      })
      grunt.log.debug(filelist.count() + ' entries collected:\n  ' + filelist.result());

      const key = Date.now().toString(36);
      grunt.log.debug('set key: ' + key)
      let re = new RegExp('{{key}}', 'g')
      template = template.replace(re, key)

      grunt.log.debug('set ' + filelist.count() + ' entries')
      re = new RegExp('{{FILES_TO_CACHE}}', 'g')
      template = template.replace(re, filelist.result())

      // write resulting file
      msg += '\n' + ignoreDest + ' with ' + filelist.count() + ' entries';
      grunt.log.debug('Create: ' + file.dest)
      fs.writeFileSync(file.dest, template);
    })

    grunt.log.ok('Service worker created:' + (msg ? msg : ' none?!'))
  })
}
