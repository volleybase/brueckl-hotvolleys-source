/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */

'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('createsvg', 'Create the svg image viewers.', function() {

    // console.log('-- create svg --------------------------------------------')
    // console.log(this)
    // console.log('----------------------------------------------------------')

    const fs = require('fs')
    const tpl = fs.readFileSync(this.data.options.container, 'utf8');

    // handle all definitions of files
    this.files.forEach((file) => {
      // console.log(file)

      // handle each file of current definition
      file.src.forEach((file2) => {

        // read data file
        const svg = fs.readFileSync(file2, 'utf8');

        // write resulting file
        grunt.verbose.writeln('Create: ' + file.dest)
        fs.writeFileSync(file.dest, tpl.replace('{{svg}}', svg));
      })
    })
    grunt.log.ok()
  })
}
