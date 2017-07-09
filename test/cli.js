'use strict';

var PassThrough = require('stream').PassThrough;
var test = require('tape');
var execa = require('execa');
var version = require('../package').version;

test('cli', function (t) {
  var input = new PassThrough();

  t.plan(7);

  execa.stdout('./cli.js', ['michael']).then(function (result) {
    t.equal(result, 'MKL	MXL', 'argument');
  });

  execa.stdout('./cli.js', ['detestable', 'vileness']).then(function (result) {
    t.equal(result, 'TTSTPL\tTTSTPL FLNS\tFLNS', 'arguments');
  });

  execa.stdout('./cli.js', {input: input}).then(function (result) {
    t.equal(result, 'TTSTPL\tTTSTPL FLNS\tFLNS', 'stdin');
  });

  input.write('detestable');

  setImmediate(function () {
    input.end(' vileness');
  });

  ['-h', '--help'].forEach(function (flag) {
    execa.stdout('./cli.js', [flag]).then(function (result) {
      t.ok(/\s+Usage: double-metaphone/.test(result), flag);
    });
  });

  ['-v', '--version'].forEach(function (flag) {
    execa.stdout('./cli.js', [flag]).then(function (result) {
      t.equal(result, version, flag);
    });
  });
});
