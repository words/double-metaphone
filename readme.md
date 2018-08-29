# double-metaphone [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[Double metaphone algorithm][source].

## API

Install:

```bash
npm install double-metaphone
```

Use:

```js
var doubleMetaphone = require('double-metaphone')

doubleMetaphone('michael') // => ['MKL', 'MXL']
doubleMetaphone('crevalle') // => ['KRFL', 'KRF']
doubleMetaphone('Filipowitz') // => ['FLPTS', 'FLPFX']
doubleMetaphone('Xavier') // => ['SF', 'SFR']
doubleMetaphone('delicious') // => ['TLSS', 'TLXS']
doubleMetaphone('acceptingness') // => ['AKSPTNNS', 'AKSPTNKNS']
doubleMetaphone('allegrettos') // => ['ALKRTS', 'AKRTS']
```

With [stemmer][]:

```js
var doubleMetaphone = require('double-metaphone')
var stemmer = require('stemmer')

doubleMetaphone(stemmer('acceptingness')) // => [ 'AKSPTNK', 'AKSPTNK' ]
doubleMetaphone(stemmer('allegrettos')) // => [ 'ALKRT', 'AKRT' ]
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

## Related

*   [`metaphone`](https://github.com/words/metaphone)
    — Fast Metaphone implementation
*   [`soundex-code`](https://github.com/words/soundex-code)
    — Fast Soundex implementation
*   [`stemmer`](https://github.com/words/stemmer)
    — Porter Stemmer algorithm
*   [`dice-coefficient`](https://github.com/words/dice-coefficient)
    — Sørensen–Dice coefficient
*   [`levenshtein-edit-distance`](https://github.com/words/levenshtein-edit-distance)
    — Levenshtein edit distance
*   [`syllable`](https://github.com/words/syllable)
    — Syllable count in an English word

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/words/double-metaphone.svg

[travis]: https://travis-ci.org/words/double-metaphone

[codecov-badge]: https://img.shields.io/codecov/c/github/words/double-metaphone.svg

[codecov]: https://codecov.io/github/words/double-metaphone

[license]: license

[author]: http://wooorm.com

[source]: http://en.wikipedia.org/wiki/metaphone

[stemmer]: https://github.com/words/stemmer
