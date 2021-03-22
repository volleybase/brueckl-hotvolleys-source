'use strict';

module.exports = function init(grunt) {

  grunt.registerMultiTask('encode', 'Encode data.', function() {
    grunt.log.writeln('Encode data')
    grunt.verbose.writeln(JSON.stringify(this.data, null, 2))

    if (typeof this.data.pw === 'string' && Array.isArray(this.data.values)) {
      this.data.values.forEach((val) => {
        const enc = doEncode(val, this.data.pw)
        grunt.log.writeln(val + ' => ' + enc + ' => '
            + doDecode(enc, this.data.pw))
      })
    }

    grunt.log.ok()
  })
}

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const doEncode = (str, pw) => {
  if (typeof pw !== 'string' || pw == '') {
    return null
  }

  if (typeof str !== 'string') {
    return null
  }

  // create key
  let key = 'b'.codePointAt(0);
  for (let i = 0; i < pw.length; ++i) {
    key = key ^ pw.codePointAt(i)
  }

  let result = ''
  for (let i = 0; i < str.length; ++i) {
    let pos = str.codePointAt(i) ^ key
    //result += '/' + create62(pos)
    result += create62(pos)
  }

  return result
}

const create62 = (intValue) => {
  let res = ''
  let cur = intValue
  for (let i = 0; i < 3; ++i) {
    let pos = cur % 62
    cur = Math.floor(cur / 62)
    res = chars.substr(pos, 1) + res
  }
  return res
}

const doDecode = (str, pw) => {
  if (typeof pw !== 'string' || pw == '') {
    return null
  }

  if (typeof str !== 'string' || str.length % 3 !== 0) {
    return null
  }

  // create key
  let key = 'b'.codePointAt(0);
  for (let i = 0; i < pw.length; ++i) {
    key = key ^ pw.codePointAt(i)
  }

  let result = ''
  for (let i = 0; i < str.length; i += 3) {
    let part = str.substr(i, 3)
    let pos = from62(part) ^ key
    result += String.fromCodePoint(pos)
  }
  return result;
}

const from62 = (str) => {
  let result = 0
  for (let i = 0; i < str.length; ++i) {
    result = result * 62 + chars.indexOf(str.substr(i, 1))
  }
  return result
}
