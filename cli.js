#!/usr/bin/env node
'use strict';

/**
 * Dependencies.
 */

var doubleMetaphone,
    pack;

pack = require('./package.json');
doubleMetaphone = require('./');

/**
 * Arguments.
 */

var argv;

argv = process.argv.slice(2);

/**
 * Help.
 */

function help() {
    console.log([
        '',
        'Usage: double-metaphone [options] string',
        '',
        'Options:',
        '',
        '  -h, --help           output usage information',
        '  -v, --version        output version number',
        '',
        'Usage:',
        '',
        '  Note! The two results are tab seperated!',
        '',
        '# output phonetics of given value',
        '$ double-metaphone michael',
        '# MKL	MXL',
        '',
        '# output phonetics of stdin',
        '$ echo "Xavier" | double-metaphone',
        '# SF	SFR'
    ].join('\n  ') + '\n');
}

/**
 * Program.
 */

if (
    argv.indexOf('--help') === 0 ||
    argv.indexOf('-h') === 0
) {
    help();
} else if (
    argv.indexOf('--version') === 0 ||
    argv.indexOf('-v') === 0
) {
    console.log(pack.version);
} else if (argv.length === 1) {
    console.log(doubleMetaphone(argv[0]).join('\t'));
} else if (argv.length) {
    help();
} else {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (data) {
        console.log(doubleMetaphone(data.trim()).join('\t'));
    });
}
