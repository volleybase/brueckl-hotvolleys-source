# create_manifest = require('./_work/create.manifest.js')
create_svg = require('./_work/svg/create_svg.js')
create_ovsvg = require('./_work/ovsvg/grunt/create_ovsvg.js')

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
  "_work/svg/source/**/*.html",
  "_work/svg/container.html"
]);

# files_batch = files.concat([
#   "!cache.manifest"
# ])

# fnManifest = 'd:/workdir/brueckl-hotvolleys-source/cache.manifest'

# grundlagen
def =
  u10:
    ann1:
      title: '2x Spielen'
      anchor: '2x_spielen'
      target: '2x_spielen.html'
      image:  '2x_spielen.png'
      info: 'Zusammenspiel - zusammen spielen'
    ann2:
      title: 'Außenfuß'
      anchor: 'aussenfuss'
      target: 'aussenfuss.html'
      image:  'aussenfuss.png'
      info: 'Der Außenfuß stoppt die Bewegung zum Ball und erleichtert das Zielen zur Zielposition (Mitspieler).'
    ann3:
      title: 'Ich!  Zu mir!'
      anchor: 'ich_zu_mir'
      target: 'ich_zu_mir.html'
      image:  'ich_zu_mir.png'
      info: 'Das Mitsprechen unterstützt die Entscheidung zur besseren Verteilung der Aufgaben zwischen den Spielerinnen.'
    ann4:
      title: '3x Spielen'
      anchor: '3x_spielen'
      target: '3x_spielen.html'
      image:  '3x_spielen.png'
      info: '3x Spielen - Annahme/Verteidigung - Aufspiel - Angriff'
    ang1:
      title: 'Tom + Jerry'
      anchor: 'tomjerry'
      image: 'tomjerry.png'
      info: 'Kurze Angriffe vor die Füße der Gegnerin.'
    ang2:
      title: 'Micky Maus'
      anchor: 'mickymaus'
      image: 'mickymaus.png'
      info: 'Angriffe zwischen die gegnerischen Spielerinnen.'
  u11:
    ann1:
      title: '2x Spielen'
      anchor: '2x_spielen'
      target: '2x_spielen.html'
      image:  '2x_spielen.png'
      info: 'Zusammenspiel - zusammen spielen'
    ann2:
      title: 'Außenfuß'
      anchor: 'aussenfuss'
      target: 'aussenfuss.html'
      image:  'aussenfuss.png'
      info: 'Der Außenfuß stoppt die Bewegung zum Ball und erleichtert das Zielen zur Zielposition (Mitspieler).'
    ann3:
      title: 'Ich!  Zu mir!'
      anchor: 'ich_zu_mir'
      target: 'ich_zu_mir.html'
      image:  'ich_zu_mir.png'
      info: 'Das Mitsprechen unterstützt die Entscheidung zur besseren Verteilung der Aufgaben zwischen den Spielerinnen.'
    ann4:
      title: '3x Spielen'
      anchor: '3x_spielen'
      target: '3x_spielen.html'
      image:  '3x_spielen.png'
      info: '3x Spielen - Annahme/Verteidigung - Aufspiel - Angriff'
    ann5:
      title: '3x Spielen +'
      anchor: '3x_spielen_x'
      target: '3x_spielen_x.html'
      image:  '3x_spielen_x.png'
      info: '3x Spielen mit Angriff von außen'
    ann6:
      title: '3x Spielen ++'
      anchor: '3x_spielen_xx'
      target: '3x_spielen_xx.html'
      image:  '3x_spielen_xx.png'
      info: '3x Spielen, Angriff von außen mit Sicherung'
    ang1:
      title: 'Tom + Jerry'
      anchor: 'tomjerry'
      image: 'tomjerry.png'
      info: 'Kurze Angriffe vor die Füße der Gegnerin.'
    ang2:
      title: 'Micky Maus'
      anchor: 'mickymaus'
      image: 'mickymaus.png'
      info: 'Angriffe zwischen die gegnerischen Spielerinnen.'
  u12:
    ann:
      title: '2er Riegel'
      anchor: '2er_riegel'
      image: '2er_riegel.png'
      info: 'Die Annahme des gegnerischen Service.'
    auf:
      title: 'Aufspiel'
      anchor: 'aufspiel'
      image: 'aufspiel.png'
      info: 'Das Aufspiel und die Vorbereitung auf den eigenen Angriff.'
    ang4:
      title: 'Links: Position 4'
      anchor: 'angriff4'
      image: 'angriff4.png'
      info: 'Der Angriff über die Position 4 mit Sicherung.'
    ang2:
      title: 'Rechts: Position 2'
      anchor: 'angriff2'
      image: 'angriff2.png'
      info: 'Der Angriff über die Position 2 mit Sicherung.'
    bas:
      title: 'Basis'
      anchor: 'basis'
      image: 'basis.png'
      info: 'Wir gehen in die Basis, sobald der Ball beim Gegner ist.'
    blo4:
      title: 'Links: Position 4'
      anchor: 'block4'
      image: 'block4.png'
      info: 'Der Block auf der Position 4 gegen einen gegnerischen Angriff.'
    blo3:
      title: 'Mitte: Position 3'
      anchor: 'block3'
      image: 'block3.png'
      info: 'Der Block auf der Position 3 gegen einen gegnerischen Angriff.'
    blo2:
      title: 'Rechts: Position 2'
      anchor: 'block2'
      image: 'block2.png'
      info: 'Der Block auf der Position 2 gegen einen gegnerischen Angriff.'
    ohn4:
      title: 'Links: Position 4'
      anchor: 'ohne4'
      image: 'ohne4.png'
      info: 'Geschenkter Ball bei Position 4.'
    ohn3:
      title: 'Mitte: Position 3'
      anchor: 'ohne3'
      image: 'ohne3.png'
      info: 'Geschenkter Ball bei Position 3.'
    ohn2:
      title: 'Rechts: Position 2'
      anchor: 'ohne2'
      image: 'ohne2.png'
      info: 'Geschenkter Ball bei Position 2.'
  br3:
    ann:
      title: '3er Riegel'
      anchor: '3er_riegel'
      image: '/uld/grundlagen3/annahme/zudritt.png'
      target: '/uld/grundlagen3/annahme/zudritt.html'
    auf1:
      title: 'Wann 1'
      anchor: 'wann_1'
      image: '/uld/grundlagen3/aufspiel/wann1.png'
      target: '/uld/grundlagen3/aufspiel/wann_1.html'
    auf2:
      title: 'Wann 2'
      anchor: 'wann_2'
      image: '/uld/grundlagen3/aufspiel/wann2.png'
      target: '/uld/grundlagen3/aufspiel/wann_2.html'
    auf3:
      title: 'Wo'
      anchor: 'wo'
      image: '/uld/grundlagen3/aufspiel/wo.png'
      target: '/uld/grundlagen3/aufspiel/wo.html'
    vor2:
      title: 'Vorbereitung 2'
      anchor: 'vorbereitung_2'
      image: '/uld/grundlagen3/aufspiel/vorbereitung2.png'
      target: '/uld/grundlagen3/aufspiel/vorbereitung_2.html'
    vor1:
      title: 'Vorbereitung 1'
      anchor: 'vorbereitung_1'
      image: '/uld/grundlagen3/aufspiel/vorbereitung1.png'
      target: '/uld/grundlagen3/aufspiel/vorbereitung_1.html'
    code:
      title: 'Die Codes'
      anchor: 'aufspiel'
      image: 'aufspiel/plan.png'
      target: '/uld/grundlagen3/aufspiel/'
    ang1:
      title: 'Angriff 0/6'
      anchor: 'angriff_06'
      image: 'aufspiel/angriff06.png'
      target: 'aufspiel/angriff_06.html'
    ang2:
      title: 'Angriff 5v'
      anchor: 'angriff_5v'
      image: 'aufspiel/angriff5v.png'
      target: 'aufspiel/angriff_5v.html'
    ang3:
      title: 'Angriff 2'
      anchor: 'angriff_2'
      image: 'aufspiel/angriff2.png'
      target: 'aufspiel/angriff_2.html'
    bas1:
      title: 'Basis 1'
      anchor: 'basis_1'
      image: 'verteidigung/basis1.png'
      target: 'verteidigung/basis_1.html'
      info: 'Aufspielerin hinten'
    bas2:
      title: 'Basis 2'
      anchor: 'basis_2'
      image: 'verteidigung/basis2.png'
      target: 'verteidigung/basis_2.html'
      info: 'Aufspielerin vorne'
    bas1b:
      title: 'Basis 1b'
      anchor: 'basis_1b'
      image: 'verteidigung/basis1b.png'
      target: 'verteidigung/basis_1b.html'
      info: 'gegnerische Aufspielerin vorne'
    bloinf:
      title: 'Infos zum Block'
      anchor: 'block'
      image: 'blockinfo/block2.gif'
      target: 'blockinfo/block.html'
    blo24:
      title: 'Doppelblock 4'
      anchor: 'block_4'
      image: 'verteidigung/block4.png'
      target: 'verteidigung/block_4.html'
      info: 'Doppelblock<br>(links, Pos. 4)'
    blo23:
      title: 'Doppelblock 3'
      anchor: 'block_33'
      image: 'verteidigung/block33.png'
      target: 'verteidigung/block_33.html'
      info: 'Doppelblock<br>(Mitte, Pos. 3)'
    blo22:
      title: 'Doppelblock 2'
      anchor: 'block_2'
      image: 'verteidigung/block2.png'
      target: 'verteidigung/block_2.html'
      info: 'Doppelblock<br>(rechts, Pos. 2)'
    blo3:
      title: 'Block 3'
      anchor: 'block_3'
      image: 'verteidigung/block3.png'
      target: 'verteidigung/block_3.html'
      info: 'Block auf Pos. 3<br>(Schnellangriff)'
    blo31:
      title: 'Block 3<sub>(1)</sub>'
      anchor: 'block_31'
      image: 'verteidigung/block31.png'
      target: 'verteidigung/block_31.html'
      info: 'Variante 1'
    blo35:
      title: 'Block 3<sub>(5)</sub>'
      anchor: 'block_35'
      image: 'verteidigung/block35.png'
      target: 'verteidigung/block_35.html'
      info: 'Variante 5'
    ohn1:
      title: 'Ohne (1)'
      anchor: 'ohne_1'
      image: 'verteidigung/ohne1.png'
      target: 'verteidigung/ohne_1.html'
      info: '"Ohne" Block<br>(Aufspielerin hinten)'
    ohn2:
      title: 'Ohne (2)'
      anchor: 'ohne_2'
      image: 'verteidigung/ohne2.png'
      target: 'verteidigung/ohne_2.html'
      info: '"Ohne" Block<br>(Aufspielerin vorne)'
  br4:
    feld:
      title: 'Spielfeld'
      anchor: 'spielfeld'
      image: 'spielfeld.png'
      imagepath: 'uld/grundlagen'
      info: 'Das Spielfeld.'
      back: '/uld/grundlagen'
    pos:
      title: 'Positionen'
      anchor: 'positionen'
      image: 'positionen.png'
      imagepath: 'uld/grundlagen'
      info: 'Die Positionen der Spielerinnen.'
      back: '/uld/grundlagen'

setTargetLinks = (def) ->
  map = {}
  keyMap = {
    br3: 'uld/grundlagen3'
  }

  keys1 = Object.keys(def)
  keys1.forEach((key1) ->
    block = def[key1]
    keys2 = Object.keys(block)
    keys2.forEach((key2) ->
      tab = block[key2]
      if tab.target == undefined
        img = 'i=' + encodeURIComponent((tab.imagepath ? key1) + '/' + tab.anchor + '.png')
        tit = '&t=' + encodeURIComponent(tab.title)
        inf = '&x=' + encodeURIComponent(tab.info)
        back = '&b=' + encodeURIComponent((tab.back ? '/' + key1) + '#' + tab.anchor)

        tab.target = '/imageview.html?' + img + tit + inf + back

      if tab.target != undefined and tab.info != undefined
        map[(keyMap[key1] ? key1) + '/' + tab.target] = tab.info
          .replace('<br>', ', ')
          .replace('<br />', ', ')
    )
  )
  return map
infoMap = setTargetLinks(def)


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
      # nonull -> error if sorce does not exist
      nonull: true
      options:
        "force": true
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy
        dest: "/workdir/brueckl-hotvolleys/"
      ]
    deploy2:
      nonull: true
      options:
        "force": true
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy
        dest: "/workdir/BruecklHotvolleys.github.io/"
      ]
    svgviewer:
      nonull: true
      options:
        "force": true
      files: [
        expand: true
        # get files from app
        cwd: "/workdir/vb-statsone/www/sysmodules/controls/graphics/template/js"
        src: [ "animator.js", "svgviewer.js" ]
        dest: "/workdir/brueckl-hotvolleys-source/script"
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
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/uld/grundlagen3/'
      files: [
        expand: true
        cwd: "D:/workdir/brueckl-hotvolleys-source/_work/svg/source"
        src: [ "aufspiel/*.html", "annahme/*.html", "verteidigung/*.html" ]
        dest: 'uld/grundlagen3'
      ]
    u10:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/u10/'
      files: [
        expand: true
        cwd: 'D:/workdir/brueckl-hotvolleys-source/_work/svg/source'
        src: [ "u10/*.html" ]
        dest: '.'
      ]
    u11:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/u11/'
      files: [
        expand: true
        cwd: 'D:/workdir/brueckl-hotvolleys-source/_work/svg/source'
        src: [ "u11/*.html" ]
        dest: '.'
      ]

  createovsvg:
    u10:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'blockX.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u10'
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Annahme und Verteidigung'
            table: ''
            table2: [
              {
                tableheader: [ def.u10.ann1 ]
                tableimage: [ def.u10.ann1 ]
                tableinfo: [ def.u10.ann1 ]
              }
              {
                tableheader: [ def.u10.ann2, def.u10.ann3 ]
                tableimage: [ def.u10.ann2, def.u10.ann3 ]
                tableinfo: [ def.u10.ann2, def.u10.ann3 ]
              }
              {
                tableheader: [ def.u10.ann4 ]
                tableimage: [ def.u10.ann4 ]
                tableinfo: [ def.u10.ann4 ]
              }
            ]
          }
          {
            title: 'Angriff'
            table: ''
            table2: [
              {
                tableheader: [ def.u10.ang1, def.u10.ang2 ]
                tableimage: [ def.u10.ang1, def.u10.ang2 ]
                tableinfo: [ def.u10.ang1, def.u10.ang2 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/u10/index.html'
    u11:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'blockX.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u11'
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Annahme und Verteidigung'
            table: ''
            table2: [
              {
                tableheader: [ def.u11.ann1 ]
                tableimage: [ def.u11.ann1 ]
                tableinfo: [ def.u11.ann1 ]
              }
              {
                tableheader: [ def.u11.ann2, def.u11.ann3 ]
                tableimage: [ def.u11.ann2, def.u11.ann3 ]
                tableinfo: [ def.u11.ann2, def.u11.ann3 ]
              }
              {
                tableheader: [ def.u11.ann4, def.u11.ann5, def.u11.ann6 ]
                tableimage: [ def.u11.ann4, def.u11.ann5, def.u11.ann6 ]
                tableinfo: [ def.u11.ann4, def.u11.ann5, def.u11.ann6 ]
              }
            ]
          }
          {
            title: 'Angriff'
            table: ''
            table2: [
              {
                tableheader: [ def.u11.ang1, def.u11.ang2 ]
                tableimage: [ def.u11.ang1, def.u11.ang2 ]
                tableinfo: [ def.u11.ang1, def.u11.ang2 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/u11/index.html'
    u12:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'blockX.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u12'
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Annahme'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.ann ]
                tableimage: [ def.u12.ann ]
                tableinfo: [ def.u12.ann ]
              }
            ]
          }
          {
            title: 'Aufspiel + Angriffsvorbereitung'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.auf ]
                tableimage: [ def.u12.auf ]
                tableinfo: [ def.u12.auf ]
              }
            ]
          }
          {
            title: 'Angriff + Sicherung'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.ang4, def.u12.ang2 ]
                tableimage: [ def.u12.ang4, def.u12.ang2 ]
                tableinfo: [ def.u12.ang4, def.u12.ang2 ]
              }
            ]
          }
          {
            title: 'Basis'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.bas ]
                tableimage: [ def.u12.bas ]
                tableinfo: [ def.u12.bas ]
              }
            ]
          }
          {
            title: 'Verteidigung (mit Block)'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.blo4, def.u12.blo3, def.u12.blo2  ]
                tableimage: [ def.u12.blo4, def.u12.blo3, def.u12.blo2 ]
                tableinfo: [ def.u12.blo4, def.u12.blo3, def.u12.blo2 ]
              }
            ]
          }
          {
            title: 'Verteidigung (ohne Block)'
            table: ''
            table2: [
              {
                tableheader: [ def.u12.ohn4, def.u12.ohn3, def.u12.ohn2 ]
                tableimage: [ def.u12.ohn4, def.u12.ohn3, def.u12.ohn2 ]
                tableinfo: [ def.u12.ohn4, def.u12.ohn3, def.u12.ohn2 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/u12/index.html'
    br3:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'blockX.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_br3'
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Annahme'
            table: [
              {
                tableheader: [ def.br3.ann ]
                tableimage: [ def.br3.ann ]
                tableinfo: [ def.br3.ann ]
              }
            ]
            table2: ''
          }
          {
            title: 'Aufspiel + Angriff'
            table: [
              {
                tableheader: [ def.br3.auf1, def.br3.auf2, def.br3.auf3 ]
                tableimage: [ def.br3.auf1, def.br3.auf2, def.br3.auf3 ]
                tableinfo: [ def.br3.auf1, def.br3.auf2, def.br3.auf3 ]
              }
              {
                tableheader: [ def.br3.vor2, def.br3.vor1 ]
                tableimage: [ def.br3.vor2, def.br3.vor1 ]
                tableinfo: [ def.br3.vor2, def.br3.vor1 ]
              }
              {
                tableheader: [ def.br3.code ]
                tableimage: [ def.br3.code ]
                tableinfo: [ def.br3.code ]
              }
            ]
            table2: ''
          }
          {
            title: 'Angriff + Sicherung'
            table: [
              {
                tableheader: [ def.br3.ang1, def.br3.ang2, def.br3.ang3 ]
                tableimage: [ def.br3.ang1, def.br3.ang2, def.br3.ang3 ]
                tableinfo: [ def.br3.ang1, def.br3.ang2, def.br3.ang3 ]
              }
            ]
            table2: ''
          }
          {
            title: 'Basis'
            table: ''
            table2: [
              {
                tableheader: [ def.br3.bas1, def.br3.bas2, def.br3.bas1b ]
                tableimage: [ def.br3.bas1, def.br3.bas2, def.br3.bas1b ]
                tableinfo: [ def.br3.bas1, def.br3.bas2, def.br3.bas1b ]
              }
            ]
          }
          {
            title: 'Block + Feldverteidigung'
            table: [
              {
                tableheader: [ def.br3.bloinf ]
                tableimage: [ def.br3.bloinf ]
                tableinfo: [ def.br3.bloinf ]
              }
            ]
            table2: [
              {
                tableheader: [ def.br3.blo24, def.br3.blo23, def.br3.blo22 ]
                tableimage: [ def.br3.blo24, def.br3.blo23, def.br3.blo22 ]
                tableinfo: [ def.br3.blo24, def.br3.blo23, def.br3.blo22 ]
              }
              {
                tableheader: [ def.br3.blo3, def.br3.blo31, def.br3.blo35 ]
                tableimage: [ def.br3.blo3, def.br3.blo31, def.br3.blo35 ]
                tableinfo: [ def.br3.blo3, def.br3.blo31, def.br3.blo35 ]
              }
              {
                tableheader: [ def.br3.ohn1, def.br3.ohn2 ]
                tableimage: [ def.br3.ohn1, def.br3.ohn2 ]
                tableinfo: [ def.br3.ohn1, def.br3.ohn2 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/uld/grundlagen3/index.html'
    br4:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'blockX.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_br4'
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Grundlagen'
            table: ''
            table2: [
              {
                tableheader: [ def.br4.feld, def.br4.pos ]
                tableimage: [ def.br4.feld, def.br4.pos ]
                tableinfo: [ def.br4.feld, def.br4.pos ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/uld/grundlagen/index.html'


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
  create_ovsvg(grunt)

  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', [
    # # # 'batch:manifest',
    # 'createmanifest:manifest',
    # keep as is 'clean:deploy1',
    'clean:deploy2',

    'createovsvg',
    'createsvg',

    # keep as is 'copy:deploy1',
    'copy:deploy2'
  ])
