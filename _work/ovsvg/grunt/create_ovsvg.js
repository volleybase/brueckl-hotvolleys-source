/* eslint-disable strict, one-var, no-sync, func-names, no-invalid-this */
/* eslint-env node */
const fs = require('fs')
const path = require('path')

'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('createovsvg', 'Create the overview of the svg image viewers.', function() {

    // console.log('-- create ov svg -----------------------------------------')
    // console.log(this)
    // console.log('----------------------------------------------------------')

    // id generator
    const ids = {
      _cur: 0,

      'reset': () => {
        this._cur = 0
      },
      'next': (prefix) => {
        return prefix + '_' + ++this._cur
      },
      'handle': (tpl) => {
        if (tpl.indexOf('{{id}}') >= 0) {
          const re = new RegExp('{{id}}', 'g')
          tpl = tpl.replace(re, ids.next('h'))
        }
        return tpl
      }
    }
    ids.reset()

    // load templates
    const tplDir = this.data.options.templatePath;
    const tpls = {}
    this.data.options.templates.forEach((tpl) => {
      const ext = path.extname(tpl),
            nam = tpl.substr(0, tpl.length - ext.length)
      tpls[nam] = fs.readFileSync(tplDir + tpl, 'utf8')
    })
    grunt.verbose.writeln('templates:' + Object.keys(tpls))

    if (this.data && this.data.content && this.data.content.template
      && tpls[this.data.content.template]) {

      const handler = function(include, variables, tpl, data, keys) {
        // console.log('handler:\n' + content + '\n--------------------------------')
        // console.log(JSON.stringify(data, null, 2)
        //   + '\n------------------------\n'
        //   + keys
        //   + '\n------------------------')

        grunt.verbose.writeln('template: ' + tpl)

        // ids
        tpl = ids.handle(tpl)

        let cont = process(grunt, tpl, include, null, variables)
        const keys2 = keys !== undefined ? keys : Object.keys(data)
        grunt.verbose.writeln('handle: ' + keys2)

        keys2.forEach((key) => {
          let res = ''

          // if (key === 'table2') {
          //   res = ''
          // }

          if (tpls[key] !== undefined && data[key]) {
            if (Array.isArray(data[key])) {
              data[key].forEach((dat) => {
                res += handler(include, variables, tpls[key], dat)
              })
            } else {
              res = handler(include, variables, tpls[key], data[key])
            }
          } else {
            res = data[key]
            if (key == 'target') {
              res = res.replace('.svg', '.html')
            }
          }

          // replace key
          cont = cont.replace(new RegExp('{{' + key + '}}', 'g'), res)

          // check for key with function
          let funcs = ['alt']
          funcs.forEach((f) => {
            let xkey = '{{' + f + ':' + key + '}}'
            if (cont.indexOf(xkey) >= 0) {
              // replace key and apply function
              cont = cont.replace(new RegExp(xkey, 'g'), eval(f + "('" + res + "')")) // NOSONAR
            }
          })
        })

        return cont
      }

      // get main keys from property content
      let keys = Object.keys(this.data.content)
      // console.log('######################')
      // console.log(keys)
      const pos = keys.indexOf('template')
      if (pos > -1) {
        keys.splice(pos, 1)
      }
      // console.log(keys)

      // create content
      // console.log('start: ' + this.data.content.template)
      let content = handler(this.data.options.include, this.data.options.vars,
        tpls[this.data.content.template], this.data.content, keys)

      // remove unused keys
      content = content
          .replace(new RegExp('{{block2}}', 'g'), '')
          .replace(new RegExp('{{table}}', 'g'), '')
          .replace(new RegExp('{{table2}}', 'g'), '');

      // write resulting file
      grunt.verbose.writeln('Create: ' + this.data.target)
      fs.writeFileSync(this.data.target, content)
    }

    grunt.log.ok()
  })
}

const alt = (txt) => {
  return txt
    .replace('<div>', ', ')
    .replace('</div>', '')
    .replace(/"/, "'")
}

const process = (grunt, content, include, options, variables) => {

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
  if (variables) {
    const keys = Object.keys(variables)
    keys.forEach((key) => {
      grunt.verbose.writeln('replace: ' + key + ' with ' + variables[key])
      const re = new RegExp('{{' + key + '}}', 'g')
      c = c.replace(re, variables[key])
    })
  }

  // return the result
  return c
}
