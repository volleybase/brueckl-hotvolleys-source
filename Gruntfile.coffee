create_manifest = require('./_work/create.manifest.js')

files = [
  "*.html",
  "*.css",
  "README.md",
  "styles.css",
  "elements/**",
  "favicons/**",
  "gesucht/**",
  "image/**",
  "info/**",
  "lld/**",
  "script/**",
  "u10/**",
  "u11/**",
  "u12/**",
  "u13/**",
  "u15/**",
  "uld/**"
]

files_copy = files.concat(["cache.manifest"])

files_batch = files.concat([
  "!cache.manifest"
])

fnManifest = 'd:/workdir/brueckl-hotvolleys-source/cache.manifest'

config = (grunt) ->

  clean:
    deploy:
      options:
        "force": true
      expand: true
      cwd: "/workdir/brueckl-hotvolleys"
      src: ["**/*", "!.git"]

  realFavicon:
    favicons:
      src: '_work/favicons/bhv.svg'
      dest: 'favicons'
      options:
        iconsPath: '/brueckl-hotvolleys/favicons'
        html: [ '_work/favicons/index.html' ]
        design:
          ios:
            pictureAspect: 'backgroundAndMargin'
            backgroundColor: '#ffffff'
            margin: '14%'
            assets:
              ios6AndPriorIcons: false
              ios7AndLaterIcons: true
              precomposedIcons: true
              declareOnlyDefaultIcon: true
          desktopBrowser: {}
          windows:
            pictureAspect: 'whiteSilhouette'
            backgroundColor: '#b91d47'
            onConflict: 'override'
            assets:
              windows80Ie10Tile: false
              windows10Ie11EdgeTiles:
                small: false
                medium: true
                big: false
                rectangle: false
          androidChrome:
            pictureAspect: 'noChange'
            themeColor: '#ffffff'
            manifest:
              name: 'Brückl hotvolleys'
              display: 'standalone'
              orientation: 'notSet'
              onConflict: 'override'
              declared: true
            assets:
              legacyIcon: false
              lowResolutionIcons: false
          safariPinnedTab:
            pictureAspect: 'blackAndWhite'
            threshold: 50
            themeColor: '#5bbad5'
        settings:
          scalingAlgorithm: 'Mitchell'
          errorOnImageTooSmall: false
          readmeFile: false
          htmlCodeFile: false
          usePathAsIs: false

  copy:
    deploy:
      options:
        "force": true
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy
        dest: "/workdir/brueckl-hotvolleys/"
      ]

  # batch:
  #   manifest:
  #     options:
  #
  #       cmd: (files) ->
  #         console.log(files.src[0] + ' -> ' + fnManifest)
  #         return 'node d:/workdir/brueckl-hotvolleys-source/_work/manifest.js ' + fnManifest + ' ' + files.src[0]
  #
  #         # console.log(files.cwd);
  #         # return 'd:\\workdir\\brueckl-hotvolleys-source\\_work\\create_manifest.cmd silent'
  #
  #       setup: (done) ->
  #         # grunt.file.delete fn
  #         manifest = 'CACHE MANIFEST\n'
  #         # echo # %date% %time%>> ../cache.manifest
  #         ts = Date.now()
  #         manifest += '# ' + fmtDate(new Date()) + '\n\n'
  #         grunt.file.write fnManifest, manifest
  #         done()

#      files:
#	      src: files
#      files: [
#        expand: true
#        cwd: "/workdir/brueckl-hotvolleys-source/"
#        src: files_batch
#        dest: ''
#      ]

#    manifest2:
#      options:
#        setup: (done) ->
#          console.log('setup2')
#          manifest = grunt.file.read fnManifest
#          manifest += 'setup2...\n'
#          grunt.file.write fnManifest, manifest
#          console.log('setup2')
#          done()

  createmanifest:
    manifest:
      options:
        dest: 'cache.manifest'
      files: [
        # expand: true
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_batch
        dest: 'cache.manifest'
      ]

  watch:
    copy:
      files: files,
      tasks: ['newer:copy:deploy']


module.exports = (grunt) ->

  grunt.initConfig(config(grunt))

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-batch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-real-favicon')
  create_manifest(grunt)

  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', [
    # 'batch:manifest',
    'createmanifest:manifest',
    'clean:deploy',
    'copy:deploy'
  ])
