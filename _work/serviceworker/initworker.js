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
    return this._list.join(',\n    ');
  };

  this.count = () => {
    return this._list.length;
  }
}

module.exports = function init(grunt) {

  grunt.registerMultiTask('initWorker', 'Create the service worker from template and files.', function() {
    grunt.log.debug('initWorker started...')

    let msg = '';

    const source = this.data.options.source,
          target = source + this.data.options.target,
          ignoreTarget = path.basename(target)
    grunt.log.debug('target: ' + target)

    // load template
    let template = fs.readFileSync(this.data.options.template, 'utf8')
    grunt.log.debug('template ' + this.data.options.template + ' loaded.')

    // all keys and names
    let cache_keys = ''
    // files
    const tplFiles = "'{{region}}': [\n    {{files}}\n  ]"
    let cache_files = ''

    // handle all definitions of files
    this.files.forEach((file) => {
      grunt.log.debug('')

      // region
      const region = file.dest;
      grunt.log.debug('Region: ' + region)
      let regionDate = new Date(0)

      // the files
      const filelist = new FileList()
      file.src.forEach((filename) => {
        grunt.log.debug('--> ' + filename)

        // get max file time
        grunt.log.debug('--> ' + source + filename)
        const fd = fs.openSync(source + filename),
              fstat = fs.fstatSync(fd),
              stat = fs.statSync(source + filename)
        fs.closeSync(fd)
        if (regionDate < fstat.mtime) {
          regionDate = fstat.mtime
        }

        // create file list
        if ((stat.isFile() || stat.isSymbolicLink()) && filename !== ignoreTarget) {
          filelist.add('/' + filename)
        } else {
          grunt.log.debug('Ignore ' + filename);
        }
        grunt.log.debug('--> ' + filename)
      })
      grunt.log.debug(filelist.count() + ' entries collected for ' + region + ':\n  ' + filelist.result());

      // create key of data cache for region
      const key = region + '-' + regionDate.getTime().toString(36),
            keyInfo = regionDate.toString()
      grunt.log.debug('key(' + keyInfo + '): ' + key)
      // let re = new RegExp('{{key_' + region + '}}', 'g')
      // template = template.replace(re, key)

      if (cache_keys != '') {
        cache_keys += ',\n  '
      }
      cache_keys += "'" + region + "': 'bhv-infoapp-" + key + "'"

      grunt.log.debug('set ' + filelist.count() + ' entries')
      // re = new RegExp('{{FILES_TO_CACHE_' + region + '}}', 'g')
      // template = template.replace(re, filelist.result())
      if (cache_files != '') {
        cache_files += ',\n  '
      }
      cache_files += tplFiles
        .replace('{{region}}', region)
        .replace('{{files}}', filelist.result())
    })

    // add all keys
    let re = new RegExp('{{keys}}', 'g')
    template = template.replace(re, cache_keys)

    // add all files
    re = new RegExp('{{files}}', 'g')
    template = template.replace(re, cache_files)


    // write resulting file
    //msg += '\n' + target + ' with ' + filelist.count() + ' entries'
    msg += target
    grunt.log.debug('Create: ' + target)
    fs.writeFileSync(target, template)
    grunt.log.ok('Service worker created: ' + (msg ? msg : 'none?!'))
  })
}
