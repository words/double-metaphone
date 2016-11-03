#!/usr/bin/env node
'use strict';

/* Dependencies. */
var pack = require('./package.json');
var doubleMetaphone = require('./');

/* Arguments. */
var argv = process.argv.slice(2);

/* Program. */
if (
  argv.indexOf('--help') !== -1 ||
  argv.indexOf('-h') !== -1
) {
  console.log(help());
} else if (
  argv.indexOf('--version') !== -1 ||
  argv.indexOf('-v') !== -1
) {
  console.log(pack.version);
} else if (argv.length === 0) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (data) {
    console.log(phonetics(data));
  });
} else {
  console.log(phonetics(argv.join(' ')));
}

/* Core. */
function phonetics(values) {
  return values.split(/\s+/g).map(function (val) {
    return doubleMetaphone(val).join('\t');
  }).join(' ');
}

/* Help. */
function help() {
  return [
    '',
    'Usage: ' + pack.name + ' [options] <words...>',
    '',
    pack.description,
    '',
    'Options:',
    '',
    '  -h, --help           output usage information',
    '  -v, --version        output version number',
    '',
    'Usage:',
    '',
    '# output phonetics',
    '$ ' + pack.name + ' michael',
    '# ' + phonetics('michael'),
    '',
    '# output phonetics from stdin',
    '$ echo \'Xavier\' | ' + pack.name,
    '# ' + phonetics('Xavier'),
    '',
    '# with stemmer',
    '$ echo \'acceptingness\' | stemmer | ' + pack.name,
    '# ' + phonetics('accepting')
  ].join('\n  ') + '\n';
}
