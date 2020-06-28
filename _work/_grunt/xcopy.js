const fs = require('fs')
const path = require('path')

'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('xcopy', 'Create the file copy with template handling({{key}}).', function() {

    const regExpKey = /\{\{([^}]+)\}\}/g

    // handle all definitions of files
    this.files.forEach((file) => {

      // handle each file of current definition
      file.src.forEach((file2) => {
        grunt.verbose.writeln('xcopy:' + file2 + ' -> ' + file.dest)

        // read data file
        let content = fs.readFileSync(file2, 'utf8'),
            match,
            dirnam = path.dirname(file2),
            limit = 50

        // update
        while ((match = regExpKey.exec(content))) {
          if (match[1]) {
            let incl = path.join(dirnam, match[1]),
                content2 = fs.readFileSync(incl, 'utf8')

            if (!content2) {
              content2 = ''
            }
            content = content.replace(regExpKey, content2)
          }
          if (--limit <= 0) {
            grunt.error.writeln('xcopy: break endless loop on replacing!')
          }
        }

        // write
        dirnam = path.dirname(file.dest)
        grunt.file.mkdir(dirnam, 511) // 0777
        fs.writeFileSync(file.dest, content);
      })
    })

    grunt.log.ok()
  })
}
