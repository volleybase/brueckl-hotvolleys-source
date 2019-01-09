# create_manifest = require('./_work/create.manifest.js')
create_svg = require('./_work/svg/create_svg.js');

files = [
  "*.html",
  "*.css",
  "README.md",
  "styles.css",

  "calendar/**",
  "elements/**",
  "favicons/**",
  "image/**",
  "info/**",
  "script/**",

  "u10/**",
  "u11/**",
  "u12/**",
  "u13/**",
  "u15/**",
  "uld/**"
]

# files_copy = files.concat(["cache.manifest"])
# do not copy 'old' files!
files_copy = files.concat([
  "!**/*-old.*"
])
# add svg work files for watching
files_watch = files_copy.concat([
  "_work/svg/source/*.html",
  "_work/svg/container.html"
]);

# files_batch = files.concat([
#   "!cache.manifest"
# ])

# fnManifest = 'd:/workdir/brueckl-hotvolleys-source/cache.manifest'

config = (grunt) ->

  clean:
    deploy1_do_not_change:
      options:
        "force": true
      expand: true
      cwd: "/workdir/brueckl-hotvolleys"
      src: ["**/*", "!.git"]
    deploy2:
      options:
        "force": true
      expand: true
      cwd: "/workdir/BruecklHotvolleys.github.io"
      src: ["**/*", "!.git"]

  realFavicon:
    favicons:
      src: '_work/favicons/bhv.svg'
      dest: 'favicons'
      options:
        # old iconsPath: '/brueckl-hotvolleys/favicons'
        iconsPath: '/favicons'
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
    deploy1_do_not_change:
      options:
        "force": true
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy
        dest: "/workdir/brueckl-hotvolleys/"
      ]
    deploy2:
      options:
        "force": true
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy
        dest: "/workdir/BruecklHotvolleys.github.io/"
      ]

#  # batch:
#  #   manifest:
#  #     options:
#  #
#  #       cmd: (files) ->
#  #         console.log(files.src[0] + ' -> ' + fnManifest)
#  #         return 'node d:/workdir/brueckl-hotvolleys-source/_work/manifest.js ' + fnManifest + ' ' + files.src[0]
#  #
#  #         # console.log(files.cwd);
#  #         # return 'd:\\workdir\\brueckl-hotvolleys-source\\_work\\create_manifest.cmd silent'
#  #
#  #       setup: (done) ->
#  #         # grunt.file.delete fn
#  #         manifest = 'CACHE MANIFEST\n'
#  #         # echo # %date% %time%>> ../cache.manifest
#  #         ts = Date.now()
#  #         manifest += '# ' + fmtDate(new Date()) + '\n\n'
#  #         grunt.file.write fnManifest, manifest
#  #         done()
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
  # createmanifest:
  #   manifest:
  #     options:
  #       dest: 'cache.manifest'
  #     files: [
  #       # expand: true
  #       cwd: "/workdir/brueckl-hotvolleys-source/"
  #       src: files_batch
  #       dest: 'cache.manifest'
  #     ]

  createsvg:
    uld_auf:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
      files: [
        expand: true
        cwd: "D:/workdir/brueckl-hotvolleys-source/_work/svg/source"
        src: [ "*.html" ]
        dest: 'uld/grundlagen3/aufspiel'
      ]

  watch:
    copy:
      files: files_watch,
      # tasks: ['newer:copy:deploy1', 'newer:copy:deploy2']
      tasks: ['createsvg', 'newer:copy:deploy2']


module.exports = (grunt) ->

  grunt.initConfig(config(grunt))

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-batch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-real-favicon')
  # create_manifest(grunt)
  create_svg(grunt)

  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', [
    # # # 'batch:manifest',
    # 'createmanifest:manifest',
    # keep as is 'clean:deploy1',
    'clean:deploy2',
    # keep as is 'copy:deploy1',
    'copy:deploy2'
  ])
