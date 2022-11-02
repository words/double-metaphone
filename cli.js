#!/usr/bin/env node
import {URL} from 'node:url'
import fs from 'node:fs'
import process from 'node:process'
import {doubleMetaphone} from './index.js'

/** @type {Record<string, unknown>} */
const pack = JSON.parse(
  String(fs.readFileSync(new URL('package.json', import.meta.url)))
)

const argv = process.argv.slice(2)

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(help())
} else if (argv.includes('--version') || argv.includes('-v')) {
  console.log(pack.version)
} else if (argv.length === 0) {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', function (data) {
    console.log(phonetics(String(data)))
  })
} else {
  console.log(phonetics(argv.join(' ')))
}

/** @param {string} values  */
function phonetics(values) {
  return values
    .split(/\s+/g)
    .map(function (value) {
      return doubleMetaphone(value).join('\t')
    })
    .join(' ')
}

function help() {
  return (
    [
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
      "$ echo 'Xavier' | " + pack.name,
      '# ' + phonetics('Xavier'),
      '',
      '# with stemmer',
      "$ echo 'acceptingness' | stemmer | " + pack.name,
      '# ' + phonetics('accepting')
    ].join('\n  ') + '\n'
  )
}
