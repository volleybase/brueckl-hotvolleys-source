/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */
const fs = require('fs')
const path = require('path')

'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('createsvg', 'Create the svg image viewers.', function() {

    // console.log('-- create svg --------------------------------------------')
    // console.log(this)
    // console.log('----------------------------------------------------------')
    // console.log('----------------------------------------------------------')
    // console.log(JSON.stringify(this.data.options.infoMap, null, 2))
    // console.log('----------------------------------------------------------')

    // load template
    const tpl0 = fs.readFileSync(this.data.options.container, 'utf8')

    // handle all definitions of files
    this.files.forEach((file) => {
      // console.log(file)
      const dest = file.dest;
      // console.log(dest)

      // handle each file of current definition
      file.src.forEach((file2) => {

        // process template
        const fn = path.basename(file2),
              ext = path.extname(fn),
              nam = fn.substr(0, fn.length - ext.length)

        let footer = '';
        if (this.data.options && this.data.options.infoMap
          && this.data.options.infoMap[dest]) {
          footer = this.data.options.infoMap[dest];
        }

        const tpl = process(grunt, tpl0, this.data.options.include, {
          '\{\{FullFileName\}\}': file2,
          '\{\{FileName\}\}': fn,
          '\{\{Name\}\}': nam,
          '\{\{Path\}\}': path.dirname(file2),
          '\{\{Extension\}\}': ext ? ext.substr(1) : '',

          '\{\{fullfilename\}\}': file2.toLowerCase(),
          '\{\{filename\}\}': fn.toLowerCase(),
          '\{\{name\}\}': nam.toLowerCase(),
          '\{\{path\}\}': path.dirname(file2).toLowerCase(),
          '\{\{extension\}\}': ext ? ext.substr(1).toLowerCase() : '',

          '\{\{FULLFILENAME\}\}': file2.toUpperCase(),
          '\{\{FILENAME\}\}': fn.toUpperCase(),
          '\{\{NAME\}\}': nam.toUpperCase(),
          '\{\{PATH\}\}': path.dirname(file2).toUpperCase(),
          '\{\{EXTENSION\}\}': ext ? ext.substr(1).toUpperCase() : '',

          '\{\{footer\}\}': footer
        }, this.data.options)

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

const process = (grunt, content, include, options, options2) => {

  const regExp = /\{include\{([^}]+)\}\}/g

  // handle include
  let c = content, match
  while ((match = regExp.exec(content))) {
    if (match[1]) {
      // console.log(match[1])
      const tpl = fs.readFileSync(include + match[1] + '.html')
      c = c.replace(new RegExp(match[0], 'g'), tpl)
    }
  }

  // file name options
  if (options) {
    const keys = Object.keys(options)
    keys.forEach((key) => {
      grunt.verbose.writeln('replace: ' + key + ' with ' + options[key])
      const re = new RegExp(key, 'g')
      c = c.replace(re, options[key])
    })
  }

  // vars
  if (options2 && options2.variables) {
    const keys = Object.keys(options2.variables)
    keys.forEach((key) => {
      grunt.verbose.writeln('replace: ' + key + ' with ' + options2.variables[key])
      const re = new RegExp('{{' + key + '}}', 'g')
      c = c.replace(re, options2.variables[key])
    })
  }

  // return result
  return c
}
