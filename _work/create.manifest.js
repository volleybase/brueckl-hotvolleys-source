/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */

'use strict';

module.exports = function init(grunt) {

  const pad2 = (nr) => {
    if (nr < 10)
      return '0' + nr
    return nr
  }

  const fmtDate = (dat) =>
    pad2(dat.getDate()) + '.' +
      pad2(dat.getMonth() + 1) + '.' +
      dat.getFullYear() + ' ' +
      pad2(dat.getHours()) + ':' +
      pad2(dat.getMinutes()) + ':' +
      pad2(dat.getSeconds())

  grunt.registerMultiTask('createmanifest', 'Create the manifest.', function() {

    const fs = require('fs'),
          path = require('path');

    // console.log('-- create manifest ---------------------------------------')
    // console.log(this)
    // console.log('----------------------------------------------------------')

    // handle all definitions of files
    this.files.forEach((file) => {
      // console.log(file)
      // console.log('----------')

      const { cwd } = file;
      let dest = '';
      if (cwd) {
        dest += cwd;
        if (!dest.endsWith('/')) {
          dest += path.sep;
        }
      }
      dest += file.dest;
      console.log(dest)

      let manifest = 'CACHE MANIFEST\n'
        + '# ' + fmtDate(new Date()) + '\n\n'
        + 'CACHE:\n'

      // handle each file of current definition
      file.src.forEach((file2) => {
        // console.log(file2)
        // console.log('-----')

        const stat = fs.statSync(file2);
        if (stat.isFile()) {
          if (file2.endsWith('index.html')) {
            file2 = file2.substr(0, file2.length - 10)
          }
          manifest += '/brueckl-hotvolleys/' + file2 + '\n'
        }
      });

      manifest += '\n'
        + 'NETWORK:\n'
        + '*\n\n'
        + 'FALLBACK:\n'
        + '/brueckl-hotvolleys/schedule.html /brueckl-hotvolleys/scheduleoffline.html\n'
        + '/brueckl-hotvolleys/tabelle.html /brueckl-hotvolleys/tabelleoffline.html\n'
        + '/brueckl-hotvolleys/imageview.html /brueckl-hotvolleys/imageview.html\n'

      // write the resulting file
      fs.writeFileSync(dest, manifest)
    });
  });
};
