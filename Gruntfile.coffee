fs = require('fs')

#string utils
String::startsWith ?= (s) -> @[...s.length] is s
String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s

# create_manifest = require('./_work/create.manifest.js')
xcopy = require('./_work/_grunt/xcopy.js')
create_svg = require('./_work/svg/create_svg.js')
create_ovsvg = require('./_work/ovsvg/grunt/create_ovsvg.js')
init_worker = require('./_work/serviceworker/initWorker.js')
encoder = require('./_work/code/encode.js')

files = [
  "*.html",
  "*.css",
  "README.md",
  "favicon.ico",
  "manifest.webmanifest",
  "styles.css",

  "archive/**/*.gz",
  "calendar/**",
  "elements/**",
  "image/**",
  "script/**",
  # "testvideo/**",

  # "u10/**",
  # "u11/**",
  # "u12/**",
  "u12/certificate.jpeg",
  # "u13/**",
  "u13/certificate.jpeg",
  # "u15/**",
  # "u17/**",
  # "uld/**",
  # "lld/**",

  "training/**",

  # ignore the old files
  "!**/*_old.*"
]
files_test = files.concat(['!manifest.webmanifest'])
files_system1 = [
  "system1/**"
]
files_system4 = [
  "system4/**"
]
files_system6 = [
  "system6/**",
  "!**/*_old.*"
]
# data
files_data = [
  "data/**",
  "!**/*_old.*"
]
files_favicons = [
  "favicons/**",
  "!favicons/site.webmanifest",
  "!**/*_old.*"
]
files_info = [
  "info/**",
  "!**/*_old.*"
]
files_statistics_19 = [
  "statistics/19/**",
  "!**/*_old.*"
]
files_statistics_21 = [
  "statistics/21/**",
  "!**/*_old.*"
]

files_teambuilding_19 = [
  "teambuilding/br3_19/**",
  "!**/*_old.*"
]
files_teambuilding_21_source1 = [
  "_work/herzhirn/herzhirn.html"
]
files_teambuilding_21_source1_watch = [
  "_work/herzhirn/data.json",
  "_work/herzhirn/herzhirn.html"
]
files_teambuilding_21_source2 = [
  "**/*.*",
  "!*.json",
  "!*.docx",
  "!herzhirn.html",
  "!**/*_old.*"
]
files_teambuilding_21_source2_watch = [
  "_work/herzhirn/**/*.*",
  "!_work/herzhirn/data.json",
  "!_work/herzhirn/herzhirn.html",
  "!**/*_old.*"
]
files_teambuilding_21 = [
  "teambuilding/herzhirn_21/**"
  "!**/*_old.*"
  "!**/uz/**"
]

# the service worker
file_service_worker = ["bhv-service-worker.js"]

# watch svg files
files_svg = [
  "_work/svg/source/**/*.html",
  "_work/svg/container.html"
];

# the files to copy
files_copy = files
  .concat(files_data)
  .concat(files_system1)
  .concat(files_system4)
  .concat(files_system6)
  .concat(files_favicons)
  .concat(files_info)
  .concat(files_statistics_19)
  .concat(files_statistics_21)
  .concat(files_teambuilding_19)
  .concat(files_teambuilding_21)
  .concat(file_service_worker)
files_copy_test = files_test
  .concat(files_data)
  .concat(files_system1)
  .concat(files_system4)
  .concat(files_system6)
  .concat(files_favicons)
  .concat(files_info)
  .concat(files_statistics_19)
  .concat(files_statistics_21)
  .concat(files_teambuilding_19)
  .concat(files_teambuilding_21)
  .concat(files_video_feedback)

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
  sys4:
    ann:
      title: 'Läufer 1'
      anchor: 'annahme'
      image: 'annahme.png'
      imagepath: 'system4'
      info: 'Die Annahme des gegnerischen Service.'
      back: '/system4'
    an2:
      title: 'Läufer 2'
      anchor: 'annahme2'
      image: 'annahme2.png'
      imagepath: 'system4'
      info: 'Die Annahme des gegnerischen Service.'
      back: '/system4'
    auf:
      title: 'Läufer 1'
      anchor: 'aufspiel'
      image: 'aufspiel.png'
      imagepath: 'system4'
      info: 'Das Aufspiel und die Vorbereitung auf den eigenen Angriff.'
      back: '/system4'
    auf2:
      title: 'Läufer 2'
      anchor: 'aufspiel2'
      image: 'aufspiel2.png'
      imagepath: 'system4'
      info: 'Das Aufspiel und die Vorbereitung auf den eigenen Angriff.'
      back: '/system4'
    ang4:
      title: 'Links: Pos 4'
      anchor: 'angriff4'
      image: 'angriff4.png'
      imagepath: 'system4'
      info: 'Der Angriff über die Position 4 mit Sicherung.'
      back: '/system4'
    ang3:
      title: 'Mitte: Pos 3'
      anchor: 'angriff3'
      image: 'angriff3.png'
      imagepath: 'system4'
      info: 'Der Angriff durch die Mitte mit Sicherung.'
      back: '/system4'
    ang2:
      title: 'Rechts: Pos 2'
      anchor: 'angriff2'
      image: 'angriff2.png'
      imagepath: 'system4'
      info: 'Der Angriff über die Position 2 mit Sicherung.'
      back: '/system4'
    bas:
      title: 'Vorbereitung'
      anchor: 'basis'
      image: 'basis.png'
      imagepath: 'system4'
      info: 'Wir gehen in die Basis, sobald der Ball beim Gegner ist.'
      back: '/system4'
    bas2:
      title: 'Vorbereitung'
      anchor: 'basis2'
      image: 'basis2.png'
      imagepath: 'system4'
      info: 'Die Basis, sofern auf Position 2 ein Doppelblock nötig ist.'
      back: '/system4'
    blo4:
      title: 'Links: Pos 4'
      anchor: 'block4'
      image: 'block4.png'
      imagepath: 'system4'
      info: 'Der Block auf der Position 4 gegen einen gegnerischen Angriff.'
      back: '/system4'
    blo3l:
      title: 'Mitte: Pos 3L'
      anchor: 'block3l'
      image: 'block3l.png'
      imagepath: 'system4'
      info: 'Der Block auf der Position 3 gegen einen gegnerischen Angriff.'
      back: '/system4'
    blo3r:
      title: 'Mitte: Pos 3R'
      anchor: 'block3r'
      image: 'block3r.png'
      imagepath: 'system4'
      info: 'Der Block auf der Position 3 gegen einen gegnerischen Angriff.'
      back: '/system4'
    blo2:
      title: 'Einzelblock'
      anchor: 'block2'
      image: 'block2.png'
      imagepath: 'system4'
      info: 'Der Block auf der Position 2 gegen einen gegnerischen Angriff.'
      back: '/system4'
    blo22:
      title: 'Doppelblock'
      anchor: 'block22'
      image: 'block22.png'
      imagepath: 'system4'
      info: 'Der Doppelblock auf der Position 2 gegen einen (starken) gegnerischen Angriff.'
      back: '/system4'
    ohn4:
      title: 'Links: Pos 4'
      anchor: 'ohne4'
      image: 'ohne4.png'
      imagepath: 'system4'
      info: 'Geschenkter Ball bei Position 4.'
      back: '/system4'
    ohn3:
      title: 'Mitte: Pos 3'
      anchor: 'ohne3'
      image: 'ohne3.png'
      imagepath: 'system4'
      info: 'Geschenkter Ball bei Position 3.'
      back: '/system4'
    ohn2:
      title: 'Rechts: Pos 2'
      anchor: 'ohne2'
      image: 'ohne2.png'
      imagepath: 'system4'
      info: 'Geschenkter Ball bei Position 2.'
      back: '/system4'
    aufv:
      title: 'Aufspiel'
      anchor: 'aufspielv'
      image: 'aufspiel_v.png'
      imagepath: 'system4'
      info: 'Das Aufspiel und die Vorbereitung auf den eigenen Angriff nach einer Verteidigung.'
      back: '/system4'
    weg:
      title: 'Ohne - Weg!'
      anchor: 'weg'
      image: 'ohne.png'
      imagepath: 'system4'
      info: 'Geschenkter Ball nach früher Entscheidung.'
      back: '/system4'
    auf3:
      title: 'Aufspiel'
      anchor: 'aufspiel3'
      image: 'aufspiel.png'
      imagepath: 'system4'
      info: 'Das Aufspiel und die Vorbereitung auf den eigenen Angriff nach einer Verteidigung. Wir haben es früh erkannt und darauf reagiert!'
      back: '/system4'
  br3:
    ann:
      title: '3er Riegel'
      anchor: '3er_riegel'
      image: '/system6/annahme/zudritt.png'
      target: '/system6/annahme/zudritt.html'
    auf1:
      title: 'Wann 1'
      anchor: 'wann_1'
      image: '/system6/aufspiel/wann1.png'
      target: '/system6/aufspiel/wann_1.html'
    auf2:
      title: 'Wann 2'
      anchor: 'wann_2'
      image: '/system6/aufspiel/wann2.png'
      target: '/system6/aufspiel/wann_2.html'
    auf3:
      title: 'Wo'
      anchor: 'wo'
      image: '/system6/aufspiel/wo.png'
      target: '/system6/aufspiel/wo.html'
    vor2:
      title: 'Vorbereitung 2'
      anchor: 'vorbereitung_2'
      image: '/system6/aufspiel/vorbereitung2.png'
      target: '/system6/aufspiel/vorbereitung_2.html'
    vor1:
      title: 'Vorbereitung 1'
      anchor: 'vorbereitung_1'
      image: '/system6/aufspiel/vorbereitung1.png'
      target: '/system6/aufspiel/vorbereitung_1.html'
    code:
      title: 'Die Codes'
      anchor: 'aufspiel'
      image: 'aufspiel/plan.png'
      target: '/system6/aufspiel/'
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
    feld:
      title: 'Spielfeld'
      anchor: 'spielfeld'
      image: 'spielfeld/spielfeld.png'
      imagepath: 'system6'
      info: 'Das Spielfeld.'
      back: '/system6'
    pos:
      title: 'Positionen'
      anchor: 'positionen'
      image: 'spielfeld/positionen.png'
      imagepath: 'system6'
      info: 'Die Positionen der Spielerinnen.'
      back: '/system6'
  br4:
    feld:
      title: 'Spielfeld'
      anchor: 'spielfeld'
      image: 'spielfeld.png'
      imagepath: 'system6/spielfeld'
      info: 'Das Spielfeld.'
      back: '/system6/spielfeld'
    pos:
      title: 'Positionen'
      anchor: 'positionen'
      image: 'positionen.png'
      imagepath: 'system6/spielfeld'
      info: 'Die Positionen der Spielerinnen.'
      back: '/system6/spielfeld'
  sys1:
    r:
      ann:
        #title: '3er Riegel'
        anchor: '3er_riegel'
        image: 'annahme/3er_riegel.png'
        target: 'annahme/3er_riegel.svg'
        #info: '3 Spielerinnen nehmen an'
        infos: 'annahme/3er_riegel.json'
      l1:
        #title: 'Läufer 1'
        anchor: 'l1'
        image: 'annahme/l1.png'
        target: 'annahme/l1.svg'
        #info: 'Aufspielerin Pos 1'
        infos: 'annahme/l1.json'
      l1E:
        anchor: 'l1_angetaeuschtes_doppelquick_mit_diagonalspielerin'
        image: 'annahme_einbeiner/l1_angetaeuschtes_doppelquick_mit_diagonalspielerin.png'
        target: 'annahme_einbeiner/l1_angetaeuschtes_doppelquick_mit_diagonalspielerin.svg'
        infos: 'annahme_einbeiner/l1_angetaeuschtes_doppelquick_mit_diagonalspielerin.json'
      l6:
        #title: 'Läufer 6'
        anchor: 'l6'
        image: 'annahme/l6.png'
        target: 'annahme/l6.svg'
        #info: 'Aufspielerin Pos 6'
        infos: 'annahme/l6.json'
      l5:
        #title: 'Läufer 5'
        anchor: 'l5'
        image: 'annahme/l5.png'
        target: 'annahme/l5.svg'
        #info: 'Aufspielerin Pos 5'
        infos: 'annahme/l5.json'
      l4:
        #title: 'Läufer 4'
        anchor: 'l4'
        image: 'annahme/l4.png'
        target: 'annahme/l4.svg'
        #info: 'Aufspielerin Pos 4'
        infos: 'annahme/l4.json'
      l4EA:
        anchor: 'l4_aussenangreiferin_kreuzt'
        image: 'annahme_einbeiner/l4_aussenangreiferin_kreuzt.png'
        target: 'annahme_einbeiner/l4_aussenangreiferin_kreuzt.svg'
        infos: 'annahme_einbeiner/l4_aussenangreiferin_kreuzt.json'
      l4EM:
        anchor: 'l4_mb'
        image: 'annahme_einbeiner/l4_mb.png'
        target: 'annahme_einbeiner/l4_mb.svg'
        infos: 'annahme_einbeiner/l4_mb.json'
      l4T:
        anchor: 'l4_angetaeuschte_l5'
        image: 'annahme_tricks/l4_angetaeuschte_l5.png'
        target: 'annahme_tricks/l4_angetaeuschte_l5.svg'
        infos: 'annahme_tricks/l4_angetaeuschte_l5.json'
      l3:
        #title: 'Läufer 3'
        anchor: 'l3'
        image: 'annahme/l3.png'
        target: 'annahme/l3.svg'
        #info: 'Aufspielerin Pos 3'
        infos: 'annahme/l3.json'
      l3EA:
        anchor: 'l3_aussenangreiferin_kreuzt'
        image: 'annahme_einbeiner/l3_aussenangreiferin_kreuzt.png'
        target: 'annahme_einbeiner/l3_aussenangreiferin_kreuzt.svg'
        infos: 'annahme_einbeiner/l3_aussenangreiferin_kreuzt.json'
      l3EM:
        anchor: 'l3_mb'
        image: 'annahme_einbeiner/l3_mb.png'
        target: 'annahme_einbeiner/l3_mb.svg'
        infos: 'annahme_einbeiner/l3_mb.json'
      l3T:
        anchor: 'l3_angetaeuschte_l6'
        image: 'annahme_tricks/l3_angetaeuschte_l6.png'
        target: 'annahme_tricks/l3_angetaeuschte_l6.svg'
        infos: 'annahme_tricks/l3_angetaeuschte_l6.json'
      l2:
        #title: 'Läufer 2'
        anchor: 'l2'
        image: 'annahme/l2.png'
        target: 'annahme/l2.svg'
        #info: 'Aufspielerin Pos 2'
        infos: 'annahme/l2.json'
      l2EA:
        anchor: 'l2_aussenangreiferin_kreuzt'
        image: 'annahme_einbeiner/l2_aussenangreiferin_kreuzt.png'
        target: 'annahme_einbeiner/l2_aussenangreiferin_kreuzt.svg'
        infos: 'annahme_einbeiner/l2_aussenangreiferin_kreuzt.json'
      l2EM:
        anchor: 'l2_mb'
        image: 'annahme_einbeiner/l2_mb.png'
        target: 'annahme_einbeiner/l2_mb.svg'
        infos: 'annahme_einbeiner/l2_mb.json'
      l2T:
        anchor: 'l2_angetaeuschte_l1'
        image: 'annahme_tricks/l2_angetaeuschte_l1.png'
        target: 'annahme_tricks/l2_angetaeuschte_l1.svg'
        infos: 'annahme_tricks/l2_angetaeuschte_l1.json'
    s:
      aufw1:
        #title: 'Wann 1'
        anchor: 'wann_1'
        image: 'angriff/wann_1.png'
        target: 'angriff/wann_1.svg'
        #info: 'Wann soll ich loslaufen?'
        infos: 'angriff/wann_1.json'
      aufw2:
        #title: 'Wann 2'
        anchor: 'wann_2'
        image: 'angriff/wann_2.png'
        target: 'angriff/wann_2.svg'
        #info: 'Wann soll ich loslaufen?'
        infos: 'angriff/wann_2.json'
      aufwo:
        #title: 'Wo'
        anchor: 'wo'
        image: 'angriff/wo.png'
        target: 'angriff/wo.svg'
        #info: 'Wo soll ich laufen?'
        infos: 'angriff/wo.json'
      vor2:
        #title: 'Vorbereitung 2'
        anchor: 'vorbereitung_2'
        image: 'angriff/vorbereitung_2.png'
        target: 'angriff/vorbereitung_2.svg'
        #info: 'Aufspielerin vorne<br>Wo bereite ich mich auf den Angriff vor?'
        infos: 'angriff/vorbereitung_2.json'
      vor1:
        #title: 'Vorbereitung 1'
        anchor: 'vorbereitung_1'
        image: 'angriff/vorbereitung_1.png'
        target: 'angriff/vorbereitung_1.svg'
        #info: 'Aufspielerin hinten<br>Wo bereite ich mich auf den Angriff vor?'
        infos: 'angriff/vorbereitung_1.json'
      code:
        title: 'Die Codes'
        anchor: 'aufspiel'
        image: 'angriff/aufspiel.png'
        target: 'angriff/aufspiel.svg'
        info: 'Die Nummerncodes und ihre Zeichen.'
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container_aufspiel.html"
    a:
      ang0:
        #title: 'Angriff 0/6'
        anchor: 'angriff_0_6'
        image: 'angriff/angriff_0_6.png'
        target: 'angriff/angriff_0_6.svg'
        #info: 'Angriff und Sicherung Pos 4'
        infos: 'angriff/angriff_0_6.json'
      ang2:
        #title: 'Angriff 2'
        anchor: 'angriff_2'
        image: 'angriff/angriff_2.png'
        target: 'angriff/angriff_2.svg'
        #info: 'Angriff und Sicherung Pos 2'
        infos: 'angriff/angriff_2.json'
      ang5:
        #title: 'Angriff 5v'
        anchor: 'angriff_5v'
        image: 'angriff/angriff_5v.png'
        target: 'angriff/angriff_5v.svg'
        #info: 'Angriff und Sicherung Pos 3'
        infos: 'angriff/angriff_5v.json'
      ang1:
        #title: 'Schnellangriff'
        anchor: 'schnellangriff'
        image: 'angriff/schnellangriff.png'
        target: 'angriff/schnellangriff.svg'
        #info: 'Angriff und Sicherung bei Schnellangriff'
        infos: 'angriff/schnellangriff.json'
    b:
      bas1:
        #title: 'Basis 1'
        anchor: 'basis_1'
        image: 'verteidigung/basis_1.png'
        target: 'verteidigung/basis_1.svg'
        #info: 'Aufspielerin hinten'
        infos: 'verteidigung/basis_1.json'
      bas2:
        #title: 'Basis 2'
        anchor: 'basis_2'
        image: 'verteidigung/basis_2.png'
        target: 'verteidigung/basis_2.svg'
        #info: 'Aufspielerin vorne'
        infos: 'verteidigung/basis_2.json'
    v:
      bloinf:
        title: 'Block'
        anchor: 'block'
        image: 'blockinfo/block2.gif'
        target: 'blockinfo/block.svg'
        info: 'Infos zum Block'
      blo24:
        #title: 'Doppelblock 4'
        anchor: 'block_4'
        image: 'verteidigung/block_4.png'
        target: 'verteidigung/block_4.svg'
        #info: 'Doppelblock<br>(links, Pos. 4)'
        infos: 'verteidigung/block_4.json'
      blo23:
        #title: 'Doppelblock 3'
        anchor: 'block_3'
        image: 'verteidigung/block_3.png'
        target: 'verteidigung/block_3.svg'
        #info: 'Doppelblock<br>(Mitte, Pos. 3)'
        infos: 'verteidigung/block_3.json'
      blo22:
        #title: 'Doppelblock 2'
        anchor: 'block_2'
        image: 'verteidigung/block_2.png'
        target: 'verteidigung/block_2.svg'
        #info: 'Doppelblock<br>(rechts, Pos. 2)'
        infos: 'verteidigung/block_2.json'
      blo3:
        #title: 'Block 3'
        anchor: 'block_3_schnellangriff'
        image: 'verteidigung/block_3_schnellangriff.png'
        target: 'verteidigung/block_3_schnellangriff.svg'
        #info: 'Block auf Pos. 3<br>(Schnellangriff)'
        infos: 'verteidigung/block_3_schnellangriff.json'
      blo31:
        #title: 'Block 3<sub>(1)</sub>'
        anchor: 'block_3_1_schnellangriff'
        image: 'verteidigung/block_3_1_schnellangriff.png'
        target: 'verteidigung/block_3_1_schnellangriff.svg'
        #info: 'Variante 1'
        infos: 'verteidigung/block_3_1_schnellangriff.json'
      blo35:
        #title: 'Block 3<sub>(5)</sub>'
        anchor: 'block_3_5_schnellangriff'
        image: 'verteidigung/block_3_5_schnellangriff.png'
        target: 'verteidigung/block_3_5_schnellangriff.svg'
        #info: 'Variante 5'
        infos: 'verteidigung/block_3_5_schnellangriff.json'
      ohn1:
        #title: 'Ohne 1'
        anchor: 'ohne_1'
        image: 'verteidigung/ohne_1.png'
        target: 'verteidigung/ohne_1.svg'
        #info: '"Ohne" Block<br>(Aufspielerin hinten)'
        infos: 'verteidigung/ohne_1.json'
      ohn2:
        #title: 'Ohne 2'
        anchor: 'ohne_2'
        image: 'verteidigung/ohne_2.png'
        target: 'verteidigung/ohne_2.svg'
        #info: '"Ohne" Block<br>(Aufspielerin vorne)'
        infos: 'verteidigung/ohne_2.json'

setTargetLinks = (def) ->
  # helper function to split title after first comma
  prepareTitle = (tit) ->
    if tit.indexOf(',') > -1
      parts = tit.split(',', 2)
      if parts.length == 2
        tit = parts[0] + '<div>' + parts[1].trim() + '</div>'
    return tit

  map = {}
  keyMap = {
    br3: 'system6'
    sys1: 'system1'
  }

  keys1 = Object.keys(def)
  keys1.forEach((key1) ->
    block = def[key1]
    keys2 = Object.keys(block)
    keys2.forEach((key2) ->
      tab = block[key2]
      if tab.target == undefined
        img = 'i=' + encodeURIComponent((tab.imagepath ? key1) + '/' + tab.image)
        tit = '&t=' + encodeURIComponent(tab.title)
        inf = '&x=' + encodeURIComponent(tab.info)
        back = '&b=' + encodeURIComponent((tab.back ? '/' + key1) + '#' + tab.anchor)

        tab.target = '/imageview.html?' + img + tit + inf + back

      if tab.target != undefined and tab.info != undefined
        map[(keyMap[key1] ? key1) + '/' + tab.target] = tab.info
          .replace('<br>', ', ')
          .replace('<br />', ', ')

      # system 1 is one level deeper
      keys3 = Object.keys(tab)
      keys3.forEach((key3) ->
        tab3 = tab[key3]
        # todo imageviewer (if necessary)
        #if tab3.target != undefined and tab3.info != undefined
        #  tgt = tab3.target.replace('.svg', '.html')
        #  map[(keyMap[key1] ? key1) + '/' + tgt] = tab3.info
        #    .replace('<br>', ', ')
        #    .replace('<br />', ', ')

        if tab3.target != undefined
          infos = JSON.parse(JSON.stringify(tab3))
          if tab3.infos != undefined
            fn = './_work/svg/source/' + (keyMap[key1] ? key1) + '/' + tab3.infos
            json = fs.readFileSync(fn, 'utf8')
            infos.infos = JSON.parse(json)
            #copy data for overview
            if infos.infos.title != undefined
              tab3.title = prepareTitle(infos.infos.title)
            if infos.infos.subtitle != undefined
              tab3.info = infos.infos.subtitle
          tgt = tab3.target.replace('.svg', '.html')
          map[(keyMap[key1] ? key1) + '/' + tgt] = infos
      )
    )
  )
  return map
infoMap = setTargetLinks(def)
#console.log(infoMap)


config = (grunt) ->

  clean:
    deploy1_do_not_change:
      options:
        "force": true
      expand: true
      cwd: "/workdir/brueckl-hotvolleys"
      src: ["**/*", "!.git"]
    herzhirn:
      options:
        "force": true
      expand: true
      cwd: "/workdir/brueckl-hotvolleys-source/teambuilding/herzhirn_21/"
      src: ["*"]
    deploy2:
      options:
        "force": true
      expand: true
      cwd: "/workdir/BruecklHotvolleys.github.io"
      src: ["**/*", "!.git"]
    test:
      options:
        force: true
      expand: true
      cwd: "/workdir/bhv-test"
      src: ["**/*"]


  realFavicon:
    favicons:
      src: '_work/favicons/bhv.svg'
      dest: 'favicons'
      options:
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

  initWorker:
    sw:
      options:
        source: "D:/workdir/brueckl-hotvolleys-source/"
        template: "_work/serviceworker/serviceworker.js"
        target: "bhv-service-worker.js"
      files:
        main: files
        data: files_data
        system1: files_system1
        system4: files_system4
        system6: files_system6
        favicons: files_favicons
        info: files_info
        statistics_19: files_statistics_19
        statistics_21: files_statistics_21
        teambuilding_19: files_teambuilding_19
        teambuilding_21: files_teambuilding_21

  copy:
    herzhirn2:
      nonull: true
      options:
        "force": true
      files: [
        expand: true
        cwd: "/workdir/brueckl-hotvolleys-source/_work/herzhirn/"
        src: files_teambuilding_21_source2
        dest: "/workdir/brueckl-hotvolleys-source/teambuilding/herzhirn_21"
      ]
    deploy1_do_not_change:
      # nonull -> error if source does not exist
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
    # svgviewer:
    #   nonull: true
    #   options:
    #     "force": true
    #   files: [
    #     expand: true
    #     # get files from app
    #     cwd: "/workdir/vb-statsone/www/sysmodules/controls/graphics/template/js"
    #     src: [ "animator.js", "svgviewer.js" ]
    #     dest: "/workdir/brueckl-hotvolleys-source/script"
    #   ]
    test:
      nonull: true
      options:
        force: true
        noProcess: [ '**/*.{png,gif,jpg,jpeg,ico,psd,pdf,js,json,md,css,mp4,mp3,xml,svg,gz}' ]
        process: (content, filename) ->

          # do not include manifest
          if filename is "index.html"
            #console.log "copy " + filename
            content = content.replace("<link rel=\"manifest\" href=\"/manifest.webmanifest\">", "")

          # remove init of service worker
          if filename.endsWith(".html")
            content = content
              .replace("window.bhv.utils.registerSW();", "")
              .replace("window.bhv.utils.connectSW();", "")

          #return result
          content

      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_copy_test
        dest: "/workdir/bhv-test/"
      ]

  xcopy:
    herzhirn1:
      files: [
        cwd: "/workdir/brueckl-hotvolleys-source/"
        src: files_teambuilding_21_source1
        dest: "/workdir/brueckl-hotvolleys-source/teambuilding/herzhirn_21/index.html"
      ]

  createsvg:
    uld_auf:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/system6/'
          pw_key: 3
      files: [
        expand: true
        cwd: "D:/workdir/brueckl-hotvolleys-source/_work/svg/source"
        src: [ "aufspiel/*.html", "annahme/*.html", "verteidigung/*.html" ]
        dest: 'system6'
      ]
    u10:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/u10/'
          pw_key: 3
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
          pw_key: 3
      files: [
        expand: true
        cwd: 'D:/workdir/brueckl-hotvolleys-source/_work/svg/source'
        src: [ "u11/*.html" ]
        dest: '.'
      ]
    system1:
      options:
        container: "D:/workdir/brueckl-hotvolleys-source/_work/svg/container.html"
        include: "D:/workdir/brueckl-hotvolleys-source/_work/include/"
        infoMap: infoMap
        variables:
          back: '/system1/'
          pw_key: 1
      files: [
        expand: true
        cwd: "D:/workdir/brueckl-hotvolleys-source/_work/svg/source/system1"
        src: [ "**/*.svg" ]
        dest: 'system1'
        ext: '.html'
      ]

  createovsvg:
    u10:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u10'
          pw_key: 3
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
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u11'
          pw_key: 3
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
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'grundlagen_u12'
          pw_key: 3
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
    system4:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'system4'
          pw_key: 3
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Annahme'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.ann, def.sys4.an2 ]
                tableimage: [ def.sys4.ann, def.sys4.an2 ]
                tableinfo: [ def.sys4.ann, def.sys4.an2 ]
              }
            ]
          }
          {
            title: 'Aufspiel'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.auf, def.sys4.auf2 ]
                tableimage: [ def.sys4.auf, def.sys4.auf2 ]
                tableinfo: [ def.sys4.auf, def.sys4.auf2 ]
              }
            ]
          }
          {
            title: 'Angriff'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.ang4, def.sys4.ang3, def.sys4.ang2 ]
                tableimage: [ def.sys4.ang4, def.sys4.ang3, def.sys4.ang2 ]
                tableinfo: [ def.sys4.ang4, def.sys4.ang3, def.sys4.ang2 ]
              }
            ]
          }
          {
            title: 'Basis'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.bas, def.sys4.bas2 ]
                tableimage: [ def.sys4.bas, def.sys4.bas2 ]
                tableinfo: [ def.sys4.bas, def.sys4.bas2 ]
              }
            ]
          }
          {
            title: 'Verteidigung (mit Block)'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.blo4,  def.sys4.blo3l, def.sys4.blo3r ]
                tableimage: [ def.sys4.blo4,  def.sys4.blo3l, def.sys4.blo3r ]
                tableinfo: [ def.sys4.blo4,  def.sys4.blo3l, def.sys4.blo3r ]
              }
            ]
          }
          {
            title: 'Verteidigung (mit Block) - Position 2'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.blo2, def.sys4.blo22 ]
                tableimage: [ def.sys4.blo2, def.sys4.blo22 ]
                tableinfo: [ def.sys4.blo2, def.sys4.blo22 ]
              }
            ]
          }
          {
            title: 'Verteidigung (ohne Block)'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.ohn4,  def.sys4.ohn3, def.sys4.ohn2 ]
                tableimage: [ def.sys4.ohn4,  def.sys4.ohn3, def.sys4.ohn2 ]
                tableinfo: [ def.sys4.ohn4,  def.sys4.ohn3, def.sys4.ohn2 ]
              }
            ]
          }
          {
            title: 'Aufspiel (nach Verteidigung)'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.aufv ]
                tableimage: [ def.sys4.aufv ]
                tableinfo: [ def.sys4.aufv ]
              }
            ]
          }
          {
            title: 'ohne Block, frühes Erkennen'
            table: ''
            table2: [
              {
                tableheader: [ def.sys4.weg, def.sys4.auf3 ]
                tableimage: [ def.sys4.weg, def.sys4.auf3 ]
                tableinfo: [ def.sys4.weg, def.sys4.auf3 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/system4/index.html'
    br3:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'system6'
          pw_key: 3
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
          {
            title: 'Spielfeld'
            table: ''
            table2: [
              {
                tableheader: [ def.br3.feld, def.br3.pos ]
                tableimage: [ def.br3.feld, def.br3.pos ]
                tableinfo: [ def.br3.feld, def.br3.pos ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/system6/index.html'
    br4:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html', 'block.html', 'table.html', 'table2.html', 'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'spielfeld6'
          pw_key: 3
      content:
        template: 'main'
        title: 'Grundlagen'
        block: [
          {
            title: 'Spielfeld'
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
      target: 'D:/workdir/brueckl-hotvolleys-source/system6/spielfeld/index.html'
    system1:
      options:
        include: 'D:/workdir/brueckl-hotvolleys-source/_work/include/'
        templatePath: 'D:/workdir/brueckl-hotvolleys-source/_work/ovsvg/templates/'
        templates: ['main.html',
                    'block.html', 'block2.html', 'block2b.html',
                    'table.html', 'table2.html',
                    'tableheader.html', 'tableimage.html', 'tableinfo.html']
        vars:
          back: '/ov.html'
          name: 'system1'
          pw_key: 1
      content:
        template: 'main'
        title: 'Spielsystem'

        block2: [
          {
            title: 'Annahme'
            block2b: [
              {
                title: 'Grundlagen'
                table2: [
                  {
                    tableheader: [ def.sys1.r.ann ]
                    tableimage: [ def.sys1.r.ann ]
                    tableinfo: [ def.sys1.r.ann ]
                  }
                ]
              }
              {
                title: 'Standard'
                table2: [
                  {
                    tableheader: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
                    tableimage: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
                    tableinfo: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
                  }
                  {
                    tableheader: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
                    tableimage: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
                    tableinfo: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
                  }
                ]
              }
              {
                title: 'Einbeiner'
                table2: [
                  {
                    tableheader: [ def.sys1.r.l1E ]
                    tableimage: [ def.sys1.r.l1E ]
                    tableinfo: [ def.sys1.r.l1E ]
                  }
                  {
                    tableheader: [ def.sys1.r.l2EM, def.sys1.r.l2EA ]
                    tableimage: [ def.sys1.r.l2EM, def.sys1.r.l2EA ]
                    tableinfo: [ def.sys1.r.l2EM, def.sys1.r.l2EA ]
                  }
                  {
                    tableheader: [ def.sys1.r.l3EM, def.sys1.r.l3EA ]
                    tableimage: [ def.sys1.r.l3EM, def.sys1.r.l3EA ]
                    tableinfo: [ def.sys1.r.l3EM, def.sys1.r.l3EA ]
                  }
                  {
                    tableheader: [ def.sys1.r.l4EM, def.sys1.r.l4EA ]
                    tableimage: [ def.sys1.r.l4EM, def.sys1.r.l4EA ]
                    tableinfo: [ def.sys1.r.l4EM, def.sys1.r.l4EA ]
                  }
                ]
              }
              {
                title: 'Tricks'
                table2: [
                  {
                    tableheader: [ def.sys1.r.l2T, def.sys1.r.l3T, def.sys1.r.l4T ]
                    tableimage: [ def.sys1.r.l2T, def.sys1.r.l3T, def.sys1.r.l4T ]
                    tableinfo: [ def.sys1.r.l2T, def.sys1.r.l3T, def.sys1.r.l4T ]
                  }
                ]
              }
            ]
          }
        ]

        block: [
          # {
          #   title: 'Annahme old'
          #   table: ''
          #   table2: [
          #     {
          #       tableheader: [ def.sys1.r.ann ]
          #       tableimage: [ def.sys1.r.ann ]
          #       tableinfo: [ def.sys1.r.ann ]
          #     }
          #     {
          #       tableheader: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
          #       tableimage: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
          #       tableinfo: [ def.sys1.r.l1, def.sys1.r.l6, def.sys1.r.l5 ]
          #     }
          #     {
          #       tableheader: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
          #       tableimage: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
          #       tableinfo: [ def.sys1.r.l2, def.sys1.r.l3, def.sys1.r.l4 ]
          #     }
          #   ]
          # }
          {
            title: 'Aufspiel + Angriff'
            table: ''
            table2: [
              {
                tableheader: [ def.sys1.s.aufw1, def.sys1.s.aufw2, def.sys1.s.aufwo ]
                tableimage: [ def.sys1.s.aufw1, def.sys1.s.aufw2, def.sys1.s.aufwo ]
                tableinfo: [ def.sys1.s.aufw1, def.sys1.s.aufw2, def.sys1.s.aufwo ]
              }
              {
                tableheader: [ def.sys1.s.vor2, def.sys1.s.vor1 ]
                tableimage: [ def.sys1.s.vor2, def.sys1.s.vor1 ]
                tableinfo: [ def.sys1.s.vor2, def.sys1.s.vor1 ]
              }
              {
                tableheader: [ def.sys1.s.code ]
                tableimage: [ def.sys1.s.code ]
                tableinfo: [ def.sys1.s.code ]
              }
            ]
          }
          {
            title: 'Angriff + Sicherung'
            table: ''
            table2: [
              {
                tableheader: [ def.sys1.a.ang0, def.sys1.a.ang2 ]
                tableimage: [ def.sys1.a.ang0, def.sys1.a.ang2 ]
                tableinfo: [ def.sys1.a.ang0, def.sys1.a.ang2 ]
              }
              {
                tableheader: [ def.sys1.a.ang5, def.sys1.a.ang1 ]
                tableimage: [ def.sys1.a.ang5, def.sys1.a.ang1 ]
                tableinfo: [ def.sys1.a.ang5, def.sys1.a.ang1 ]
              }
            ]
          }
          {
            title: 'Basis'
            table: ''
            table2: [
              {
                tableheader: [ def.sys1.b.bas1, def.sys1.b.bas2 ]
                tableimage: [ def.sys1.b.bas1, def.sys1.b.bas2 ]
                tableinfo: [ def.sys1.b.bas1, def.sys1.b.bas2 ]
              }
            ]
          }
          {
            title: 'Block + Feldverteidigung'
            table: ''
            table2: [
              {
                tableheader: [ def.sys1.v.bloinf ]
                tableimage: [ def.sys1.v.bloinf ]
                tableinfo: [ def.sys1.v.bloinf ]
              }
              {
                tableheader: [ def.sys1.v.blo24, def.sys1.v.blo23, def.sys1.v.blo22 ]
                tableimage: [ def.sys1.v.blo24, def.sys1.v.blo23, def.sys1.v.blo22 ]
                tableinfo: [ def.sys1.v.blo24, def.sys1.v.blo23, def.sys1.v.blo22 ]
              }
              {
                tableheader: [ def.sys1.v.blo3, def.sys1.v.blo31, def.sys1.v.blo35 ]
                tableimage: [ def.sys1.v.blo3, def.sys1.v.blo31, def.sys1.v.blo35 ]
                tableinfo: [ def.sys1.v.blo3, def.sys1.v.blo31, def.sys1.v.blo35 ]
              }
              {
                tableheader: [ def.sys1.v.ohn1, def.sys1.v.ohn2 ]
                tableimage: [ def.sys1.v.ohn1, def.sys1.v.ohn2 ]
                tableinfo: [ def.sys1.v.ohn1, def.sys1.v.ohn2 ]
              }
            ]
          }
        ]
      target: 'D:/workdir/brueckl-hotvolleys-source/system1/index.html'

  watch:
    initWorker:
      files: ['_work/serviceworker/serviceworker.js']
      tasks: ['initWorker', 'newer:copy:deploy2']
    svg:
      files: files_svg
      tasks: ['createsvg', 'initWorker', 'newer:copy:deploy2']
    main:
      files: files
      tasks: ['initWorker', 'newer:copy:deploy2']
    system1:
      files: files_system1
      tasks: ['initWorker', 'newer:copy:deploy2']
    system4:
      files: files_system4
      tasks: ['initWorker', 'newer:copy:deploy2']
    system6:
      files: files_system6
      tasks: ['initWorker', 'newer:copy:deploy2']
    data:
      files: files_data
      tasks: ['initWorker', 'newer:copy:deploy2']
    favicons:
      files: files_favicons
      tasks: ['realFavicon:favicons', 'initWorker', 'newer:copy:deploy2']
    info:
      files: files_info
      tasks: ['initWorker', 'newer:copy:deploy2']
    statistics_19:
      files: files_statistics_19
      tasks: ['initWorker', 'newer:copy:deploy2']
    statistics_21:
      files: files_statistics_21
      tasks: ['initWorker', 'newer:copy:deploy2']
    teambuilding_19:
      files: files_teambuilding_19
      tasks: ['initWorker', 'newer:copy:deploy2']
    teambuilding_21_source1:
      files: files_teambuilding_21_source1,
      tasks: ['xcopy:herzhirn1']
    teambuilding_21_source2:
      files: files_teambuilding_21_source1_watch,
      tasks: ['copy:herzhirn1']
    teambuilding_21:
      files: files_teambuilding_21,
      tasks: ['initWorker', 'newer:copy:deploy2']
    test:
      files: files_copy_test
      tasks: ['newer:copy:test']

  encode:
    admin:
      pw: 'obmib'
      values: ['bhv.bhv']
    bhv1:
      pw: 'bhv1'
      values: ['bhv.bhv']
    bhv2:
      pw: '2@bhv'
      values: ['bhv.bhv']
    bhv3:
      pw: '3@bhv'
      values: ['bhv.bhv']
    bhv4:
      pw: 'b4'
      values: ['bhv.bhv']

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
  xcopy(grunt)
  create_ovsvg(grunt)
  init_worker(grunt)
  encoder(grunt)

  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', [
    # # # 'batch:manifest',
    # 'createmanifest:manifest',
    # keep as is 'clean:deploy1',
    'clean:deploy2',

    'clean:herzhirn',
    'xcopy:herzhirn1',
    'copy:herzhirn2',
    #'copy:svgviewer',

    'createovsvg',
    'createsvg',

    'initWorker',

    # keep as is 'copy:deploy1',
    'copy:deploy2'
  ])

  grunt.registerTask('build_test', [
    'clean:test',

    'clean:herzhirn',
    'xcopy:herzhirn1',
    'copy:herzhirn2',
    #'copy:svgviewer',

    'createovsvg',
    'createsvg',

    'copy:test'
  ])

  grunt.registerTask('info', () ->
    i = (txt) ->
      grunt.log.writeln(txt)

    i('Usage')
    i('')
    i('  clean:deploy2')
    i('    Ergebnis säubern')
    i('')
    i('  realFavicon (favicons)')
    i('    die wichtigsten Icons erstellen')
    i('')
    i('')
    i('  initWorker')
    i('    den Serviceworker erstellen')
    i('')
    i('  copy')
    i('    deploy2')
    i('      Ergebnis erstellen')
    # i('    svgviewer')
    # i('      Sourcen für svgviewer holen')
    i('')
    i('  createsvg')
    i('    u10, u11, u12, system4, system6, system1')
    i('      Views mit svg-viewer erstellen')
    i('')
    i('  createovsvg')
    i('    u10, u11, u12, br3, br4')
    i('      Überblicksseiten erstellen')
    i('')
    i('  build')
    i('    Alles erstellen')
    i('')
    i('-- test --')
    i('')
    i('  clean:test')
    i('    Test säubern')
    i('')
    i('  build_test')
    i('    Test erstellen')
    i('')
  );
