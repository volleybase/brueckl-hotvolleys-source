config = (grunt) ->

  clean:
    deploy:
      options:
        "force": true
      expand: true
      cwd: "/github/brueckl-hotvolleys"
      src: ["**/*", "!.git"]

  copy:
    deploy:
      options:
        "force": true
      files: [
        cwd: "/github/brueckl-hotvolleys-source/"
        src: [
          "*.html",
          "cache.manifest",
          "favicon.ico",
          "README.md",
          "image/**",
          "infos/**",
          "x/**"
        ],
        dest: "/github/brueckl-hotvolleys/"
      ]

  batch:
    manifest:
      options:
        cmd: (files) ->
          return 'd:\\github\\brueckl-hotvolleys-source\\_work\\create_manifest.cmd silent'
      files:
        src: [ "/github/brueckl-hotvolleys-source/infos/**" ]


  watch:
    copy:
      files: [
        "*.html",
        "cache.manifest",
        "favicon.ico",
        "README.md",
        "image/**",
        "infos/**",
        "x/**"
      ],
      tasks: ['newer:copy:deploy']


module.exports = (grunt) ->

  grunt.initConfig(config(grunt))

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-batch');

  grunt.loadNpmTasks('grunt-contrib-less')

  grunt.loadNpmTasks('grunt-newer')


  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', [
    'batch:manifest',
    'clean:deploy',
    'copy:deploy'
  ])
