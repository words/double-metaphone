# double-metaphone [![Build Status](https://travis-ci.org/wooorm/double-metaphone.svg?branch=master)](https://travis-ci.org/wooorm/double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/double-metaphone.svg)](https://coveralls.io/r/wooorm/double-metaphone?branch=master)

[![browser support](https://ci.testling.com/wooorm/double-metaphone.png) ](https://ci.testling.com/wooorm/double-metaphone)

---

The [double metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm in JavaScript, with some fixes and unreachable code removed. The code is 100% covered by more than 230 assertions(!).

The major difference from the [original metaphone](https://github.com/wooorm/metaphone) algorithm is that the double metaphone is not limited to English only, thus also working on words from Germanic, Slavic, Spanish, Celtic, Greek, French, Italian, Chinese, or other origin.

Another difference is that the double metaphone algorithm returns two (hence “double”) possible phonetics: "Smith" yields "SM0" and "XMT", and "Schmidt" yields "XMT" and "SMT", thus making it possible to detect that they could be pronounced the same.

For even better results, combine it with a stemmer (e.g., my own porter stemmer [implementation](https://github.com/wooorm/stemmer)).

## Installation

NPM:
```sh
$ npm install double-metaphone
```

Component.js:
```sh
$ component install wooorm/double-metaphone
```

## Usage

```js
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
```js
var doubleMetaphone = require('double-metaphone'),
    stemmer = require('stemmer');

doubleMetaphone(stemmer("acceptingness")); // [ 'AKSPTNK', 'AKSPTNK' ]
doubleMetaphone(stemmer("allegrettos")); // [ 'ALKRT', 'AKRT' ]
```

## License

  MIT
