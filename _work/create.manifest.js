/* eslint-disable strict, one-var, no-sync, no-console, global-require,
                  func-names, no-invalid-this */
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

    // const INDENT = 2,
    //       options = this.data.options || {},
    //       result = {},
    //       { cwd } = this.data;

    // create file name of destination
    // if (cwd) {
    //   dest += cwd;
    //   if (!dest.endsWith('/')) {
    //     dest += path.sep;
    //   }
    // }
    // dest += this.data.dest;
    // console.log(dest)

    // console.log('-- xjs ---------------------------------------------------')
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

        // let fn = '';
        // // create file name
        // if (cwd) {
        //   fn += cwd;
        //   if (!fn.endsWith('/')) {
        //     fn += path.sep;
        //   }
        // }
        // fn += file2;
        //
        // // read file
        // const content = fs.readFileSync(fn, { 'encoding': 'utf-8' });
        //
        // // convert to json
        // const data = JSON.parse(content),
        //       keys = Object.keys(data),
        //       keysCnt = keys.length;
        //
        // // add to result
        // for (let i = 0; i < keysCnt; ++i) {
        //   const k = keys[i];
        //
        //   result[k] = data[k];
        // }
        //
        // console.log(`File "${fn}" added.`);
        const stat = fs.statSync(file2);
        if (stat.isFile()) {
          manifest += '/brueckl-hotvolleys/' + file2 + '\n'
        }
      });

      manifest += '\n'
        + 'NETWORK:\n'
        + '*\n\n'
        + 'FALLBACK:\n'
        + '/brueckl-hotvolleys/infos/tabelle.html /brueckl-hotvolleys/infos/tabelleoffline.html\n'
        + '/brueckl-hotvolleys/infos/imageview.html /brueckl-hotvolleys/infos/imageview.html\n'

      // write the resulting file
      fs.writeFileSync(dest, manifest)
    });
  });
};
