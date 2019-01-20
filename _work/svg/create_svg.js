/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */
const fs = require('fs')

'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('createsvg', 'Create the svg image viewers.', function() {

    // console.log('-- create svg --------------------------------------------')
    // console.log(this)
    // console.log('----------------------------------------------------------')

    const tpl = process(
      fs.readFileSync(this.data.options.container, 'utf8'),
      this.data.options.include
    );

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

const process = (content, include) => {

  const regExp = /\{include\{([^}]+)\}\}/g

  let c = content, match
  while ((match = regExp.exec(content))) {
    if (match[1]) {
      // console.log(match[1])
      const tpl = fs.readFileSync(include + match[1] + '.html')
      c = c.replace(new RegExp(match[0], 'g'), tpl)
    }
  }

  return c
}
