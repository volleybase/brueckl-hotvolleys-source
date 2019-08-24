const fs = require('fs')
const pako = require('pako')

const fn = './_work/archive/results.xml';
const fn2 = './_work/archive/standings.xml';
const fn3 = './_work/archive/kidsschedules.xml';

// compress(fn);
// compress(fn2);
compress(fn3);

function compress(fn) {
  fs.readFile(fn, (err, data) => {
    if (err) throw err;

    const compressed = pako.deflate(data);

    fs.writeFile(fn + '.gz', compressed, (err) => {
      if (err) throw err;

      console.log('The file ' + fn + ' has been saved!');
    });
  });
}
