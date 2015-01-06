# double-metaphone [![Build Status](https://img.shields.io/travis/wooorm/double-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/double-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/double-metaphone?branch=master)

[Double metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm in JavaScript. Includes few fixes and dead-code removal. 100% coverage (which hasn’t been done before). No cruft. Real fast.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install double-metaphone
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/double-metaphone
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install double-metaphone
```


[Duo](http://duojs.org/#getting-started):

```javascript
var doubleMetaphone = require('wooorm/double-metaphone');
```

## Usage

```javascript
var doubleMetaphone = require('double-metaphone');

doubleMetaphone("michael"); // [ 'MKL', 'MXL' ]
doubleMetaphone("crevalle"); // [ 'KRFL', 'KRF' ]
doubleMetaphone("Filipowitz"); // [ 'FLPTS', 'FLPFX' ]
doubleMetaphone("Xavier"); // [ 'SF', 'SFR' ]
doubleMetaphone("delicious"); // [ 'TLSS', 'TLXS' ]
doubleMetaphone("acceptingness"); // ['AKSPTNNS', 'AKSPTNKNS]
doubleMetaphone("allegrettos"); // ['ALKRTS', 'AKRTS']
```

With [stemmer](https://github.com/wooorm/stemmer):

```javascript
var doubleMetaphone = require('double-metaphone');
var stemmer = require('stemmer');

doubleMetaphone(stemmer("acceptingness")); // [ 'AKSPTNK', 'AKSPTNK' ]
doubleMetaphone(stemmer("allegrettos")); // [ 'ALKRT', 'AKRT' ]
```

## CLI

Install:

```bash
$ npm install --global double-metaphone
```

Use:

```text
Usage: double-metaphone [options] <word>

Double Metaphone algorithm

Options:

  -h, --help           output usage information
  -v, --version        output version number

Usage:

# output phonetics (the values are tab seperated)
$ double-metaphone michael
# MKL	MXL

# output phonetics from stdin
$ echo "Xavier" | double-metaphone
# SF	SFR
```


## Benchmark

On a MacBook Air, it runs about 390,000 op/s.

```text
  390 op/s » op/s * 1,000

           doublemetaphone
  295 op/s » op/s * 1,000

           natural
  140 op/s » op/s * 1,000
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
