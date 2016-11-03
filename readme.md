# double-metaphone [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[Double metaphone algorithm][source].

## API

Install:

```bash
npm install double-metaphone
```

Use:

```js
var doubleMetaphone = require('double-metaphone');

doubleMetaphone('michael'); // ['MKL', 'MXL']
doubleMetaphone('crevalle'); // ['KRFL', 'KRF']
doubleMetaphone('Filipowitz'); // ['FLPTS', 'FLPFX']
doubleMetaphone('Xavier'); // ['SF', 'SFR']
doubleMetaphone('delicious'); // ['TLSS', 'TLXS']
doubleMetaphone('acceptingness'); // ['AKSPTNNS', 'AKSPTNKNS']
doubleMetaphone('allegrettos'); // ['ALKRTS', 'AKRTS']
```

With [stemmer][]:

```js
var doubleMetaphone = require('double-metaphone');
var stemmer = require('stemmer');

doubleMetaphone(stemmer('acceptingness')); // [ 'AKSPTNK', 'AKSPTNK' ]
doubleMetaphone(stemmer('allegrettos')); // [ 'ALKRT', 'AKRT' ]
```

## CLI

Install:

```sh
npm install -g double-metaphone
```

Use:

```txt
Usage: double-metaphone [options] <words...>

Double Metaphone algorithm

Options:

  -h, --help           output usage information
  -v, --version        output version number

Usage:

# output phonetics
$ double-metaphone michael
# MKL MXL

# output phonetics from stdin
$ echo 'Xavier' | double-metaphone
# SF  SFR

# with stemmer
$ echo 'acceptingness' | stemmer | double-metaphone
# AKSPTNK AKSPTNK
```

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/double-metaphone.svg

[travis]: https://travis-ci.org/wooorm/double-metaphone

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/double-metaphone.svg

[codecov]: https://codecov.io/github/wooorm/double-metaphone

[license]: LICENSE

[author]: http://wooorm.com

[source]: http://en.wikipedia.org/wiki/metaphone

[stemmer]: https://github.com/wooorm/stemmer
