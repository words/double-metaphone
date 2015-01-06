'use strict';

var VOWELS,
    SLAVO_GERMANIC,
    GERMANIC,
    INITIAL_EXCEPTIONS,
    GREEK_INITIAL_CH,
    GREEK_CH,
    CH_FOR_KH,
    G_FOR_F,
    INITIAL_G_FOR_KJ,
    INITIAL_ANGER_EXCEPTION,
    G_FOR_KJ,
    J_FOR_J_EXCEPTION,
    ALLE,
    H_FOR_S,
    DUTCH_SCH;

/*
 * Match vowels (including `Y`).
 */

VOWELS = /[AEIOUY]/;

/*
 * Match few Slavo-Germanic values.
 */

SLAVO_GERMANIC = /W|K|CZ|WITZ/;

/*
 * Match few Germanic values.
 */

GERMANIC = /^(VAN |VON |SCH)/;

/*
 * Match initial values of which the first character
 * should be skipped.
 */

INITIAL_EXCEPTIONS = /^(GN|KN|PN|WR|PS)/;

/*
 * Match initial Greek-like values of which the `CH`
 * sounds like `K`.
 */

GREEK_INITIAL_CH = /^CH(IA|EM|OR([^E])|YM|ARAC|ARIS)/;

/*
 * Match Greek-like values of which the `CH` sounds
 * like `K`.
 */

GREEK_CH = /ORCHES|ARCHIT|ORCHID/;

/*
 * Match values which when following `CH`, transform `CH`
 * to sound like `K`.
 */

CH_FOR_KH = /[ BFHLMNRVW]/;

/*
 * Match values which when preceding a vowel and `UGH`,
 * sound like `F`.
 */

G_FOR_F = /[CGLRT]/;

/*
 * Match initial values which sound like either `K` or `J`.
 */

INITIAL_G_FOR_KJ = /Y[\s\S]|E[BILPRSY]|I[BELN]/;

/*
 * Match initial values which sound like either `K` or `J`.
 */

INITIAL_ANGER_EXCEPTION = /^[DMR]ANGER/;

/*
 * Match values which when following `GY`, do not sound
 * like `K` or `J`.
 */

G_FOR_KJ = /[EGIR]/;

/*
 * Match values which when following `J`, do not sound `J`.
 */

J_FOR_J_EXCEPTION = /[LTKSNMBZ]/;

/*
 * Match values which might sound like `L`.
 */

ALLE = /AS|OS/;

/*
 * Match Germanic values preceding `SH` which sound
 * like `S`.
 */

H_FOR_S = /EIM|OEK|OLM|OLZ/;

/*
 * Match Dutch values following `SCH` which sound like
 * either `X` and `SK`, or `SK`.
 */

DUTCH_SCH = /E[DMNR]|UY|OO/;

/**
 * Get the phonetics according to the Double Metaphone
 * algorithm from a value.
 *
 * @param {string} value - value to detect phonetics for.
 * @return {Array.<string>} - Two phonetics.
 */
function doubleMetaphone(value) {
    var primary = '',
        secondary = '',
        index = 0,
        length = value.length,
        last = length - 1,
        isSlavoGermanic, isGermanic, subvalue, next, prev, nextnext,
        characters;

    value = String(value).toUpperCase() + '     ';
    isSlavoGermanic = SLAVO_GERMANIC.test(value);
    isGermanic = GERMANIC.test(value);
    characters = value.split('');

    /*
     * skip this at beginning of word.
     */

    if (INITIAL_EXCEPTIONS.test(value)) {
        index++;
    }

    /*
     * Initial X is pronounced Z, which maps to S. Such as `Xavier`
     */

    if (characters[0] === 'X') {
        primary += 'S';
        secondary += 'S';

        index++;
    }

    while (index < length) {
        prev = characters[index - 1];
        next = characters[index + 1];
        nextnext = characters[index + 2];

        switch (characters[index]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
            case 'Y':
            case 'À':
            case 'Ê':
            case 'É':
            case 'É':
                if (index === 0) {
                    /*
                     * All initial vowels now map to `A`.
                     */

                    primary += 'A';
                    secondary += 'A';
                }

                index++;

                break;
            case 'B':
                primary += 'P';
                secondary += 'P';

                if (next === 'B') {
                    index++;
                }

                index++;

                break;
            case 'Ç':
                primary += 'S';
                secondary += 'S';
                index++;

                break;
            case 'C':
                /*
                 * Various Germanic:
                 */

                if (prev === 'A' && next === 'H' && nextnext !== 'I' &&
                    !VOWELS.test(characters[index - 2]) &&
                    (
                        nextnext !== 'E' || (
                            subvalue = value.slice(index - 2, index + 4) &&
                            (subvalue === 'BACHER' || subvalue === 'MACHER')
                        )
                    )
                ) {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                /*
                 * Special case for `Caesar`.
                 */

                if (
                    index === 0 &&
                    value.slice(index + 1, index + 6) === 'AESAR'
                ) {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }

                /*
                 * Italian `Chianti`.
                 */

                if (value.slice(index + 1, index + 4) === 'HIA') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                if (next === 'H') {
                    /*
                     * Find `Michael`.
                     */

                    if (
                        index > 0 && nextnext === 'A' &&
                        characters[index + 3] === 'E'
                    ) {
                        primary += 'K';
                        secondary += 'X';
                        index += 2;

                        break;
                    }

                    /*
                     * Greek roots such as `chemistry`, `chorus`.
                     */

                    if (index === 0 && GREEK_INITIAL_CH.test(value)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }

                    /*
                     * Germanic, Greek, or otherwise `CH` for `KH` sound.
                     */

                    if (
                        isGermanic ||
                        /*
                         * Such as 'architect' but not 'arch', orchestra',
                         * 'orchid'.
                         */
                        GREEK_CH.test(value.slice(index - 2, index + 4)) ||
                        (nextnext === 'T' || nextnext === 'S') ||
                        (
                            (
                                index === 0 ||
                                prev === 'A' || prev === 'E' ||
                                prev === 'O' || prev === 'U'
                            ) &&
                            /*
                             * Such as `wachtler`, `weschsler`, but not
                             * `tichner`.
                             */
                            CH_FOR_KH.test(nextnext)
                        )
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else if (index === 0) {
                        primary += 'X';
                        secondary += 'X';
                    /*
                     * Such as 'McHugh'.
                     */
                    } else if (value.slice(0, 2) === 'MC') {
                        /*
                         * Bug? Why matching absolute? what about McHiccup?
                         */

                        primary += 'K';
                        secondary += 'K';
                    } else {
                        primary += 'X';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                /*
                 * Such as `Czerny`.
                 */

                if (
                    next === 'Z' &&
                    value.slice(index - 2, index) !== 'WI'
                ) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }

                /*
                 * Such as `Focaccia`.
                 */

                if (value.slice(index + 1, index + 4) === 'CIA') {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                /*
                 * Double `C`, but not `McClellan`.
                 */

                if (
                    next === 'C' &&
                    !(index === 1 && characters[0] === 'M')
                ) {
                    /*
                     * Such as `Bellocchio`, but not `Bacchus`.
                     */

                    if (
                        (
                            nextnext === 'I' ||
                            nextnext === 'E' ||
                            nextnext === 'H'
                        ) &&
                        value.slice(index + 2, index + 4) !== 'HU'
                    ) {
                        subvalue = value.slice(index - 1, index + 4);

                        /*
                         * Such as `Accident`, `Accede`, `Succeed`.
                         */

                        if (
                            (index === 1 && prev === 'A') ||
                            subvalue === 'UCCEE' || subvalue === 'UCCES'
                        ) {
                            primary += 'KS';
                            secondary += 'KS';

                        /*
                         * Such as `Bacci`, `Bertucci`, other Italian.
                         */
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    } else {
                        /*
                         * Pierce's rule.
                         */

                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }
                }

                if (next === 'G' || next === 'K' || next === 'Q') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                /*
                 * Italian.
                 */

                if (
                    next === 'I' &&
                    /*
                     * Bug: The original algorithm also calls for A (as
                     * in CIA), which is already taken care of above.
                     */
                    (nextnext === 'E' || nextnext === 'O')
                ) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }

                if (next === 'I' || next === 'E' || next === 'Y') {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }

                primary += 'K';
                secondary += 'K';

                /*
                 * Skip two extra characters ahead in `Mac Caffrey`,
                 * `Mac Gregor`.
                 */

                if (
                    next === ' ' &&
                    (
                        nextnext === 'C' ||
                        nextnext === 'G' ||
                        nextnext === 'Q'
                    )
                ) {
                    index += 3;
                    break;
                }

                /*
                 * Bug: Already covered above.
                 *
                 * if (
                 *     next === 'K' ||
                 *     next === 'Q' ||
                 *     (
                 *         next === 'C' &&
                 *         nextnext !== 'E' &&
                 *         nextnext !== 'I'
                 *     )
                 * ) {
                 *     index++;
                 * }
                 */

                index++;

                break;
            case 'D':
                if (next === 'G') {
                    /*
                     * Such as `edge`.
                     */

                    if (
                        nextnext === 'E' ||
                        nextnext === 'I' ||
                        nextnext === 'Y'
                    ) {
                        primary += 'J';
                        secondary += 'J';
                        index += 3;
                    /*
                     * Such as `Edgar`.
                     */
                    } else {
                        primary += 'TK';
                        secondary += 'TK';
                        index += 2;
                    }

                    break;
                }

                if (next === 'T' || next === 'D') {
                    primary += 'T';
                    secondary += 'T';
                    index += 2;

                    break;
                }

                primary += 'T';
                secondary += 'T';
                index++;

                break;
            case 'F':
                if (next === 'F') {
                    index++;
                }

                index++;
                primary += 'F';
                secondary += 'F';

                break;
            case 'G':
                if (next === 'H') {
                    if (index > 0 && !VOWELS.test(prev)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }

                    /*
                     * Such as `Ghislane`, `Ghiradelli`.
                     */

                    if (index === 0) {
                        if (nextnext === 'I') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'K';
                            secondary += 'K';
                        }
                        index += 2;
                        break;
                    }

                    /*
                     * Parker's rule (with some further refinements).
                     */

                    if (
                        (
                            /*
                             * Such as `Hugh`
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 2],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        (
                            /*
                             * Such as `bough`.
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 3],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        (
                            /*
                             * Such as `Broughton`.
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 4],
                            subvalue === 'B' ||
                            subvalue === 'H'
                        )
                    ) {
                        index += 2;

                        break;
                    }

                    /*
                     * Such as `laugh`, `McLaughlin`, `cough`, `gough`,
                     * `rough`, `tough`.
                     */

                    if (
                        index > 2 && prev === 'U' &&
                        G_FOR_F.test(characters[index - 3])
                    ) {
                        primary += 'F';
                        secondary += 'F';
                    } else if (index > 0 && prev !== 'I') {
                        primary += 'K';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                if (next === 'N') {
                    if (
                        index === 1 &&
                        VOWELS.test(characters[0]) &&
                        !isSlavoGermanic
                    ) {
                        primary += 'KN';
                        secondary += 'N';
                    /*
                     * Not like `Cagney`.
                     */
                    } else if (
                        value.slice(index + 2, index + 4) !== 'EY' &&
                        value.slice(index + 1) !== 'Y' &&
                        !isSlavoGermanic
                    ) {
                        primary += 'N';
                        secondary += 'KN';
                    } else {
                        primary += 'KN';
                        secondary += 'KN';
                    }

                    index += 2;

                    break;
                }

                /*
                 * Such as `Tagliaro`.
                 */

                if (
                    value.slice(index + 1, index + 3) === 'LI' &&
                    !isSlavoGermanic
                ) {
                    primary += 'KL';
                    secondary += 'L';
                    index += 2;

                    break;
                }

                /*
                 * -ges-, -gep-, -gel- at beginning.
                 */

                if (
                    index === 0 &&
                    INITIAL_G_FOR_KJ.test(value.slice(1, 3))
                ) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }

                /*
                 * -ger-, -gy-.
                 */

                if (
                    (
                        value.slice(index + 1, index + 3) === 'ER' &&
                        prev !== 'I' && prev !== 'E' &&
                        !INITIAL_ANGER_EXCEPTION.test(value.slice(0, 6))
                    ) ||
                    (next === 'Y' && !G_FOR_KJ.test(prev))
                ) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }

                /*
                 * Italian such as `biaggi`.
                 */

                if (
                    next === 'E' || next === 'I' || next === 'Y' ||
                    (
                        (prev === 'A' || prev === 'O') &&
                        next === 'G' && nextnext === 'I'
                    )
                ) {
                    /*
                     * Obvious Germanic.
                     */

                    if (
                        value.slice(index + 1, index + 3) === 'ET' ||
                        isGermanic
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else {
                        /*
                         * Always soft if French ending.
                         */

                        if (value.slice(index + 1, index + 5) === 'IER ') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'J';
                            secondary += 'K';
                        }
                    }

                    index += 2;

                    break;
                }

                if (next === 'G') {
                    index++;
                }

                index++;

                primary += 'K';
                secondary += 'K';

                break;
            case 'H':
                /*
                 * Only keep if first & before vowel or btw. 2 vowels.
                 */

                if (VOWELS.test(next) && (index === 0 || VOWELS.test(prev))) {
                    primary += 'H';
                    secondary += 'H';

                    index++;
                }

                index++;

                break;
            case 'J':
                /*
                 * Obvious Spanish, `jose`, `San Jacinto`.
                 */
                if (
                    value.slice(index, index + 4) === 'JOSE' ||
                    value.slice(0, 4) === 'SAN '
                ) {
                    if (
                        value.slice(0, 4) === 'SAN ' ||
                        (
                            index === 0 &&
                            characters[index + 4] === ' '
                        )
                    ) {
                        primary += 'H';
                        secondary += 'H';
                    } else {
                        primary += 'J';
                        secondary += 'H';
                    }

                    index++;

                    break;
                }

                if (
                    index === 0
                    /*
                     * Bug: unreachable (see previous statement).
                     * && value.slice(index, index + 4) !== 'JOSE'.
                     */
                ) {
                    primary += 'J';

                    /*
                     * Such as `Yankelovich` or `Jankelowicz`.
                     */

                    secondary += 'A';
                /*
                 * Spanish pron. of such as `bajador`.
                 */
                } else if (
                    !isSlavoGermanic &&
                    (next === 'A' || next === 'O') &&
                    VOWELS.test(prev)
                ) {
                    primary += 'J';
                    secondary += 'H';
                } else if (index === last) {
                    primary += 'J';
                } else if (
                    prev !== 'S' && prev !== 'K' && prev !== 'L' &&
                    !J_FOR_J_EXCEPTION.test(next)
                ) {
                    primary += 'J';
                    secondary += 'J';
                /*
                 * It could happen.
                 */
                } else if (next === 'J') {
                    index++;
                }

                index++;

                break;
            case 'K':
                if (next === 'K') {
                    index++;
                }

                primary += 'K';
                secondary += 'K';
                index++;

                break;
            case 'L':
                if (next === 'L') {
                    /*
                     * Spanish such as `cabrillo`, `gallegos`.
                     */

                    if (
                        (
                            index === length - 3 &&
                            (
                                (
                                    prev === 'I' &&
                                    (nextnext === 'O' || nextnext === 'A')
                                ) ||
                                (
                                    prev === 'A' &&
                                    nextnext === 'E'
                                )
                            )
                        ) || (
                            prev === 'A' && nextnext === 'E' &&
                            (
                                (
                                    characters[last] === 'A' ||
                                    characters[last] === 'O'
                                ) ||
                                ALLE.test(value.slice(last - 1, length))
                            )
                        )
                    ) {
                        primary += 'L';
                        index += 2;

                        break;
                    }

                    index++;
                }

                primary += 'L';
                secondary += 'L';
                index++;

                break;
            case 'M':
                if (
                    next === 'M' ||

                    /*
                     * Such as `dumb`, `thumb`.
                     */

                    (
                        prev === 'U' && next === 'B' &&
                        (
                            index + 1 === last ||
                            value.slice(index + 2, index + 4) === 'ER'
                        )
                    )
                ) {
                    index++;
                }

                index++;
                primary += 'M';
                secondary += 'M';

                break;
            case 'N':
                if (next === 'N') {
                    index++;
                }

                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case 'Ñ':
                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case 'P':
                if (next === 'H') {
                    primary += 'F';
                    secondary += 'F';
                    index += 2;

                    break;
                }

                /*
                 * Also account for `campbell` and `raspberry`.
                 */

                subvalue = next;

                if (subvalue === 'P' || subvalue === 'B') {
                    index++;
                }

                index++;

                primary += 'P';
                secondary += 'P';

                break;
            case 'Q':
                if (next === 'Q') {
                    index++;
                }

                index++;
                primary += 'K';
                secondary += 'K';

                break;
            case 'R':
                /*
                 * French such as `Rogier`, but exclude `Hochmeier`.
                 */

                if (
                    index === last &&
                    !isSlavoGermanic &&
                    prev === 'E' &&
                    characters[index - 2] === 'I' &&
                    characters[index - 4] !== 'M' &&
                    (
                        characters[index - 3] !== 'E' &&
                        characters[index - 3] !== 'A'
                    )
                ) {
                    secondary += 'R';
                } else {
                    primary += 'R';
                    secondary += 'R';
                }

                if (next === 'R') {
                    index++;
                }

                index++;

                break;
            case 'S':
                /*
                 * Special cases `island`, `isle`, `carlisle`, `carlysle`.
                 */

                if (next === 'L' && (prev === 'I' || prev === 'Y')) {
                    index++;

                    break;
                }

                /*
                 * Special case `sugar-`.
                 */

                if (index === 0 && value.slice(1, 5) === 'UGAR') {
                    primary += 'X';
                    secondary += 'S';
                    index++;

                    break;
                }

                if (next === 'H') {
                    /*
                     * Germanic.
                     */

                    if (H_FOR_S.test(value.slice(index + 1, index + 5))) {
                        primary += 'S';
                        secondary += 'S';
                    } else {
                        primary += 'X';
                        secondary += 'X';
                    }

                    index += 2;
                    break;
                }

                if (
                    next === 'I' && (nextnext === 'O' || nextnext === 'A')
                    /*
                     * Bug: Already covered by previous branch
                     * || value.slice(index, index + 4) === 'SIAN'
                     */
                ) {
                    if (!isSlavoGermanic) {
                        primary += 'S';
                        secondary += 'X';
                    } else {
                        primary += 'S';
                        secondary += 'S';
                    }

                    index += 3;

                    break;
                }

                /*
                 * German & Anglicization's, such as `Smith` match `Schmidt`,
                 * `snider` match `Schneider`. Also, -sz- in slavic language
                 * although in hungarian it is pronounced `s`.
                 */

                if (
                    next === 'Z' ||
                    (
                        index === 0 && (
                            next === 'L' || next === 'M' ||
                            next === 'N' || next === 'W'
                        )
                    )
                ) {
                    primary += 'S';
                    secondary += 'X';

                    if (next === 'Z') {
                        index++;
                    }

                    index++;

                    break;
                }

                if (next === 'C') {
                    /*
                     * Schlesinger's rule.
                     */

                    if (nextnext === 'H') {
                        subvalue = value.slice(index + 3, index + 5);

                        /*
                         * Dutch origin, such as `school`, `schooner`.
                         */

                        if (DUTCH_SCH.test(subvalue)) {
                            /*
                             * Such as `schermerhorn`, `schenker`.
                             */

                            if (subvalue === 'ER' || subvalue === 'EN') {
                                primary += 'X';
                                secondary += 'SK';
                            } else {
                                primary += 'SK';
                                secondary += 'SK';
                            }

                            index += 3;

                            break;
                        }

                        if (
                            index === 0 &&
                            !VOWELS.test(characters[3]) &&
                            characters[3] !== 'W'
                        ) {
                            primary += 'X';
                            secondary += 'S';
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    }

                    if (
                        nextnext === 'I' ||
                        nextnext === 'E' ||
                        nextnext === 'Y'
                    ) {
                        primary += 'S';
                        secondary += 'S';
                        index += 3;
                        break;
                    }

                    primary += 'SK';
                    secondary += 'SK';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index - 2, index);

                /*
                 * French such as `resnais`, `artois`.
                 */

                if (
                    index === last &&
                    (
                        subvalue === 'AI' ||
                        subvalue === 'OI'
                    )
                ) {
                    secondary += 'S';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (
                    next === 'S'
                    /*
                     * Bug: already taken care of by `German &
                     * Anglicization's` above:
                     *
                     * || next === 'Z'
                     */
                ) {
                    index++;
                }

                index++;

                break;
            case 'T':
                if (
                    next === 'I' &&
                    nextnext === 'O' &&
                    characters[index + 3] === 'N'
                ) {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index + 1, index + 3);

                if (
                    (
                        next === 'I' &&
                        nextnext === 'A'
                    ) || (
                        next === 'C' &&
                        nextnext === 'H'
                    )
                ) {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                if (next === 'H' || (next === 'T' && nextnext === 'H')) {
                    /*
                     * Special case `Thomas`, `Thames` or Germanic.
                     */

                    if (
                        isGermanic ||
                        (
                            (nextnext === 'O' || nextnext === 'A') &&
                            characters[index + 3] === 'M'
                        )
                    ) {
                        primary += 'T';
                        secondary += 'T';
                    } else {
                        primary += '0';
                        secondary += 'T';
                    }

                    index += 2;

                    break;
                }

                if (next === 'T' || next === 'D') {
                    index++;
                }

                index++;
                primary += 'T';
                secondary += 'T';

                break;
            case 'V':
                if (next === 'V') {
                    index++;
                }

                primary += 'F';
                secondary += 'F';
                index++;

                break;
            case 'W':
                /*
                 * Can also be in middle of word (as already taken care of
                 * for initial).
                 */

                if (next === 'R') {
                    primary += 'R';
                    secondary += 'R';
                    index += 2;

                    break;
                }

                if (index === 0) {
                    /*
                     * `Wasserman` should match `Vasserman`.
                     */

                    if (VOWELS.test(next)) {
                        primary += 'A';
                        secondary += 'F';
                    } else if (next === 'H') {
                        /*
                         * Need `Uomo` to match `Womo`.
                         */

                        primary += 'A';
                        secondary += 'A';
                    }
                }

                /*
                 * `Arnow` should match `Arnoff`.
                 */

                if (
                    (
                        (prev === 'E' || prev === 'O') &&
                        next === 'S' && nextnext === 'K' &&
                        (
                            characters[index + 3] === 'I' ||
                            characters[index + 3] === 'Y'
                        )
                    ) ||
                    /*
                     * Maybe a bug? Shouldn't this be general Germanic?
                     */

                    value.slice(0, 3) === 'SCH' ||
                    (index === last && VOWELS.test(prev))
                ) {
                    secondary += 'F';
                    index++;

                    break;
                }

                /*
                 * Polish such as `Filipowicz`.
                 */

                if (
                    next === 'I' &&
                    (nextnext === 'C' || nextnext === 'T') &&
                    characters[index + 3] === 'Z'
                ) {
                    primary += 'TS';
                    secondary += 'FX';
                    index += 4;

                    break;
                }

                index++;

                break;
            case 'X':
                /*
                 * French such as `breaux`.
                 */

                if (
                    index === last ||
                    (
                        /*
                         * Bug: IAU and EAU also match by AU
                         * /IAU|EAU/.test(value.slice(index - 3, index)) ||
                         */
                        prev === 'U' &&
                        (
                            characters[index - 2] === 'A' ||
                            characters[index - 2] === 'O'
                        )
                    )
                ) {
                    primary += 'KS';
                    secondary += 'KS';
                }

                if (next === 'C' || next === 'X') {
                    index++;
                }

                index++;

                break;
            case 'Z':
                /*
                 * Chinese pinyin such as `Zhao`.
                 */

                if (next === 'H') {
                    primary += 'J';
                    secondary += 'J';
                    index += 2;

                    break;
                } else if (
                    (
                        next === 'Z' &&
                        (
                            nextnext === 'A' || nextnext === 'I' ||
                            nextnext === 'O'
                        )
                    ) ||
                    (isSlavoGermanic && index > 0 && prev !== 'T')
                ) {
                    primary += 'S';
                    secondary += 'TS';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (next === 'Z') {
                    index++;
                }

                index++;

                break;
            default:
                index++;

        }
    }

    return [primary, secondary];
}

/*
 * Expose `doubleMetaphone`.
 */

module.exports = doubleMetaphone;
