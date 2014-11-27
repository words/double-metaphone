# double-metaphone [![Build Status](https://img.shields.io/travis/wooorm/double-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/double-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/double-metaphone?branch=master)

[Double metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm in JavaScript. Includes few fixes and dead-code removal. 100% coverage (which hasn’t been done before). No cruft. Real fast.

## Installation

npm:
```sh
$ npm install double-metaphone
```

Component:
```sh
$ component install wooorm/double-metaphone
```

Bower:
```sh
$ bower install double-metaphone
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
var doubleMetaphone = require('double-metaphone');
var stemmer = require('stemmer');

doubleMetaphone(stemmer("acceptingness")); // [ 'AKSPTNK', 'AKSPTNK' ]
doubleMetaphone(stemmer("allegrettos")); // [ 'ALKRT', 'AKRT' ]
```

## Benchmark
On a MacBook Air, it runs about 390,000 op/s.

```
  390 op/s » op/s * 1,000

           doublemetaphone
  295 op/s » op/s * 1,000

           natural
  140 op/s » op/s * 1,000
```

## License

MIT © Titus Wormer
