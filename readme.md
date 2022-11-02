# double-metaphone

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

[Double metaphone algorithm][source].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`doubleMetaphone(value)`](#doublemetaphonevalue)
*   [CLI](#cli)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [Security](#security)
*   [License](#license)

## What is this?

This package exposes a phonetic algorithm.
That means it gets a certain string (typically an English word), and turns it
into codes, which can then be compared to other codes (of other words), to
check if they are (likely) pronounced the same.

## When should I use this?

You’re probably dealing with natural language, and know you need this, if
you’re here!

Depending on your goals, you likely want to additionally use a stemmer (such as
[`stemmer`][stemmer]).

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+, 16.0+), install with [npm][]:

```sh
npm install double-metaphone
```

In Deno with [`esm.sh`][esmsh]:

```js
import {doubleMetaphone} from 'https://esm.sh/double-metaphone@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {doubleMetaphone} from 'https://esm.sh/double-metaphone@2?bundle'
</script>
```

## Use

```js
import {doubleMetaphone} from 'double-metaphone'

doubleMetaphone('michael') // => ['MKL', 'MXL']
doubleMetaphone('crevalle') // => ['KRFL', 'KRF']
doubleMetaphone('Filipowitz') // => ['FLPTS', 'FLPFX']
doubleMetaphone('Xavier') // => ['SF', 'SFR']
doubleMetaphone('delicious') // => ['TLSS', 'TLXS']
doubleMetaphone('acceptingness') // => ['AKSPTNNS', 'AKSPTNKNS']
doubleMetaphone('allegrettos') // => ['ALKRTS', 'AKRTS']
```

With [`stemmer`][stemmer]:

```js
import {doubleMetaphone} from 'double-metaphone'
import {stemmer} from 'stemmer'

doubleMetaphone(stemmer('acceptingness')) // => ['AKSPTNK', 'AKSPTNK']
doubleMetaphone(stemmer('allegrettos')) // => ['ALKRT', 'AKRT']
```

## API

This package exports the identifier `doubleMetaphone`.
There is no default export.

### `doubleMetaphone(value)`

Get the double metaphone codes from a given value.

###### `value`

Value to use (`string`, required).

##### Returns

Double metaphone codes for `value` (`[string, string]`).

## CLI

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

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Related

*   [`metaphone`](https://github.com/words/metaphone)
    — metaphone algorithm
*   [`soundex-code`](https://github.com/words/soundex-code)
    — soundex algorithm
*   [`stemmer`](https://github.com/words/stemmer)
    — porter stemmer algorithm
*   [`dice-coefficient`](https://github.com/words/dice-coefficient)
    — sørensen–dice coefficient
*   [`levenshtein-edit-distance`](https://github.com/words/levenshtein-edit-distance)
    — levenshtein edit distance
*   [`syllable`](https://github.com/words/syllable)
    — syllable count of English words

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

## Security

This package is safe.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/words/double-metaphone/workflows/main/badge.svg

[build]: https://github.com/words/double-metaphone/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/words/double-metaphone.svg

[coverage]: https://codecov.io/github/words/double-metaphone

[downloads-badge]: https://img.shields.io/npm/dm/double-metaphone.svg

[downloads]: https://www.npmjs.com/package/double-metaphone

[size-badge]: https://img.shields.io/bundlephobia/minzip/double-metaphone.svg

[size]: https://bundlephobia.com/result?p=double-metaphone

[npm]: https://www.npmjs.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[license]: license

[author]: https://wooorm.com

[source]: https://en.wikipedia.org/wiki/metaphone

[stemmer]: https://github.com/words/stemmer
