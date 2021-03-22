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
    grunt.verbose.writeln('-- create svg --------------------------------------------')
    grunt.verbose.writeln(JSON.stringify(this.data.options, null, 2))

    // load template
    const tpl0 = fs.readFileSync(this.data.options.container, 'utf8')

    // handle all definitions of files
    this.files.forEach((file) => {

      // handle each file of current definition
      file.src.forEach((file2) => {

        // process template
        const fn = path.basename(file2),
              ext = path.extname(fn),
              nam = fn.substr(0, fn.length - ext.length)

        let container = null,
            footer = '',
            title = '??? title ???'
        if (this.data.options && this.data.options.infoMap
          && this.data.options.infoMap[file.dest]) {

          // old: string for footer
          // new: object with infos (system1)
          let inf = this.data.options.infoMap[file.dest]
          if (typeof inf === 'string') {
            footer = inf;
          } else {
            // check for special container file
            if (inf['container']) {
              container = fs.readFileSync(inf['container'], 'utf8')
            }
            // infos from file -> use them, else: use old title
            if (inf['infos']) {
              inf = inf['infos']
            }
            if (inf['title']) {
              title = inf['title']
            }
            if (inf['subtitle']) {
              footer = inf['subtitle']
            }
          }
        }

        const tpl = process(grunt,
          container != null ? container : tpl0,
          this.data.options.include,
          {
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

            '\{\{title\}\}': title,
            '\{\{footer\}\}': footer
          },
          this.data.options)

        // read data file
        const svg = fs.readFileSync(file2, 'utf8');

        // write resulting file
        grunt.verbose.writeln('Create: ' + file.dest)
        let dirnam = path.dirname(file.dest)
        grunt.file.mkdir(dirnam, 511) // 0777
        fs.writeFileSync(file.dest, tpl.replace('{{svg}}', svg));
      })
    })
    grunt.log.ok()
  })
}

const process = (grunt, content, include, options, options2) => {

  // handle include
  const regExp = /\{include\{([^}]+)\}\}/g
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
