(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var VOWELS = /[AEIOUY]/,
    SLAVO_GERMANIC = /W|K|CZ|WITZ/,
    GERMANIC = /^(VAN |VON |SCH)/,
    INITIAL_EXCEPTIONS = /^(GN|KN|PN|WR|PS)/,
    GREEK_INITIAL_CH = /^CH(IA|EM|OR([^E])|YM|ARAC|ARIS)/,
    GREEK_CH = /ORCHES|ARCHIT|ORCHID/,
    CH_FOR_KH = /[ BFHLMNRVW]/,
    G_FOR_F = /[CGLRT]/,
    INITIAL_G_FOR_KJ = /Y[\s\S]|E[BILPRSY]|I[BELN]/,
    INITIAL_ANGER_EXCEPTION = /^[DMR]ANGER/,
    G_FOR_KJ = /[EGIR]/,
    J_FOR_J_EXCEPTION = /[LTKSNMBZ]/,
    ALLE = /[AO]S/,
    H_FOR_S = /EIM|OEK|OLM|OLZ/,
    DUTCH_SCH = /E[DMNR]|UY|OO/;

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

    /* skip this at beginning of word */
    if (INITIAL_EXCEPTIONS.test(value)) {
        index++;
    }

    /* Initial X is pronounced Z, which maps to S. (E.g. 'Xavier') */
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
                    // all initial vowels now map to 'A'
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
                /* Various Germanic: */
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

                /* special case for 'caesar' */
                if (
                    index === 0 &&
                    value.slice(index + 1, index + 6) === 'AESAR'
                ) {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }

                // italian 'chianti'
                if (value.slice(index + 1, index + 4) === 'HIA') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                if (next === 'H') {
                    // find 'michael'
                    if (
                        index > 0 && nextnext === 'A' &&
                        characters[index + 3] === 'E'
                    ) {
                        primary += 'K';
                        secondary += 'X';
                        index += 2;

                        break;
                    }

                    // greek roots e.g. 'chemistry', 'chorus'
                    if (index === 0 && GREEK_INITIAL_CH.test(value)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }

                    // Germanic, Greek, or otherwise 'ch' for 'kh' sound
                    if (
                        isGermanic ||
                        // 'architect' but not 'arch', orchestra', 'orchid'
                        GREEK_CH.test(value.slice(index - 2, index + 4)) ||
                        (nextnext === 'T' || nextnext === 'S') ||
                        (
                            (
                                index === 0 ||
                                prev === 'A' || prev === 'E' ||
                                prev === 'O' || prev === 'U'
                            ) &&
                            // e.g. 'wachtler', 'weschsler', but not 'tichner'
                            CH_FOR_KH.test(nextnext)
                        )
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else if (index === 0) {
                        primary += 'X';
                        secondary += 'X';
                    } else if (value.slice(0, 2) === 'MC') {
                        // Bug? Why matching absolute? what about McHiccup?
                        // e.g. 'McHugh'
                        primary += 'K';
                        secondary += 'K';
                    } else {
                        primary += 'X';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                // e.g. 'czerny'
                if (
                    next === 'Z' &&
                    value.slice(index - 2, index) !== 'WI'
                ) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }

                // e.g. 'focaccia'
                if (value.slice(index + 1, index + 4) === 'CIA') {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                // double 'C', but not McClellan'
                if (
                    next === 'C' &&
                    !(index === 1 && characters[0] === 'M')
                ) {
                    // 'bellocchio' but not 'bacchus'
                    if (
                        (
                            nextnext === 'I' ||
                            nextnext === 'E' ||
                            nextnext === 'H'
                        ) &&
                        value.slice(index + 2, index + 4) !== 'HU'
                    ) {
                        subvalue = value.slice(index - 1, index + 4);

                        // 'accident', 'accede', 'succeed'
                        if (
                            (index === 1 && prev === 'A') ||
                            subvalue === 'UCCEE' || subvalue === 'UCCES'
                        ) {
                            primary += 'KS';
                            secondary += 'KS';
                            // 'bacci', 'bertucci', other italian
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    } else {
                        // Pierce's rule
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

                // italian
                if (
                    next === 'I' &&
                    // Bug: The original algorithm also calls for A (as
                    // in CIA), which is already taken care of above.
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

                // else
                primary += 'K';
                secondary += 'K';

                // Skip two extra characters ahead in 'mac caffrey',
                // 'mac gregor'
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

                // Bug: Already covered above.
                // if (
                //     next === 'K' ||
                //     next === 'Q' ||
                //     (
                //         next === 'C' &&
                //         nextnext !== 'E' &&
                //         nextnext !== 'I'
                //     )
                // ) {
                //     index++;
                // }

                index++;

                break;
            case 'D':
                if (next === 'G') {
                    if (
                        nextnext === 'E' ||
                        nextnext === 'I' ||
                        nextnext === 'Y'
                    ) {
                        // e.g. 'edge'
                        primary += 'J';
                        secondary += 'J';
                        index += 3;
                    } else {
                        // e.g. 'edgar'
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

                    // 'ghislane', 'ghiradelli'
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

                    // Parker's rule (with some further refinements)
                    if (
                        // e.g. 'hugh'
                        (
                            // The comma is not a bug.
                            subvalue = characters[index - 2],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        // e.g. 'bough'
                        (
                            // The comma is not a bug.
                            subvalue = characters[index - 3],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        // e.g. 'broughton'
                        (
                            // The comma is not a bug.
                            subvalue = characters[index - 4],
                            subvalue === 'B' ||
                            subvalue === 'H'
                        )
                    ) {
                        index += 2;

                        break;
                    }

                    // e.g. 'laugh', 'McLaughlin', 'cough', 'gough', 'rough',
                    // 'tough'
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
                    // not e.g. 'cagney'
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

                // 'tagliaro'
                if (
                    value.slice(index + 1, index + 3) === 'LI' &&
                    !isSlavoGermanic
                ) {
                    primary += 'KL';
                    secondary += 'L';
                    index += 2;

                    break;
                }

                // -ges-, -gep-, -gel- at beginning
                if (
                    index === 0 &&
                    INITIAL_G_FOR_KJ.test(value.slice(1, 3))
                ) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }

                // -ger-, -gy-
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

                // italian e.g. 'biaggi'
                if (
                    next === 'E' || next === 'I' || next === 'Y' ||
                    (
                        (prev === 'A' || prev === 'O') &&
                        next === 'G' && nextnext === 'I'
                    )
                ) {
                    // obvious germanic
                    if (
                        value.slice(index + 1, index + 3) === 'ET' ||
                        isGermanic
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else {
                        // always soft if french ending
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
                // only keep if first & before vowel or btw. 2 vowels
                if (VOWELS.test(next) && (index === 0 || VOWELS.test(prev))) {
                    primary += 'H';
                    secondary += 'H';

                    index++;
                }

                index++;

                break;
            case 'J':
                // obvious spanish, 'jose', 'san jacinto'
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
                    // Bug: unreachable (see previous statement).
                    // && value.slice(index, index + 4) !== 'JOSE'
                ) {
                    primary += 'J'; // Yankelovich/Jankelowicz
                    secondary += 'A';
                // spanish pron. of e.g. 'bajador'
                } else if (
                    !isSlavoGermanic &&
                    (next === 'A' || next === 'O') &&
                    VOWELS.test(prev)
                ) {
                    primary += 'J';
                    secondary += 'H';
                } else if (index === last) {
                    primary += 'J';
                    // Note: Not a bug, just dropping secondary.
                } else if (
                    prev !== 'S' && prev !== 'K' && prev !== 'L' &&
                    !J_FOR_J_EXCEPTION.test(next)
                ) {
                    primary += 'J';
                    secondary += 'J';
                // it could happen
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
                    // spanish e.g. 'cabrillo', 'gallegos'
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
                                // The comma is not a bug.
                                subvalue = characters[last],
                                (subvalue === 'A' || subvalue === 'O') ||
                                ALLE.test(value.slice(last - 1, length))
                            )
                        )
                    ) {
                        primary += 'L';
                        // secondary += '';
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
                    (
                        // 'dumb', 'thumb'
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

                // also account for "campbell" and "raspberry"
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
                // french e.g. 'rogier', but exclude 'hochmeier'
                if (
                    index === last &&
                    !isSlavoGermanic &&
                    prev === 'E' &&
                    characters[index - 2] === 'I' &&
                    characters[index - 4] !== 'M' &&
                    (
                        // The comma is not a bug.
                        subvalue = characters[index - 3],
                        subvalue !== 'E' && subvalue !== 'A'
                    )
                ) {
                    // primary += '';
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
                // special cases 'island', 'isle', 'carlisle', 'carlysle'
                if (next === 'L' && (prev === 'I' || prev === 'Y')) {
                    index++;

                    break;
                }

                // special case 'sugar-'
                if (index === 0 && value.slice(1, 5) === 'UGAR') {
                    primary += 'X';
                    secondary += 'S';
                    index++;

                    break;
                }

                if (next === 'H') {
                    // germanic
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
                    // Bug: Already covered by previous branch
                    // || value.slice(index, index + 4) === 'SIAN'
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

                // german & anglicisations, e.g. 'smith' match 'schmidt',
                // 'snider' match 'schneider'. Also, -sz- in slavic language
                // altho in hungarian it is pronounced 's'
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
                    // Schlesinger's rule
                    if (nextnext === 'H') {
                        subvalue = value.slice(index + 3, index + 5);

                        // dutch origin, e.g. 'school', 'schooner'
                        if (DUTCH_SCH.test(subvalue)) {
                            // 'schermerhorn', 'schenker'
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

                // french e.g. 'resnais', 'artois'
                if (
                    index === last &&
                    (
                        subvalue === 'AI' ||
                        subvalue === 'OI'
                    )
                ) {
                    // primary += '';
                    secondary += 'S';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (
                    next === 'S'
                    // Bug: already taken care of by "german & anglicisations"
                    // above:
                    // || next === 'Z'
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
                    // special case 'thomas', 'thames' or germanic
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
                // Can also be in middle of word (as already taken care of
                // for initial).
                if (next === 'R') {
                    primary += 'R';
                    secondary += 'R';
                    index += 2;

                    break;
                }

                if (index === 0) {
                    // Wasserman should match Vasserman
                    if (VOWELS.test(next)) {
                        primary += 'A';
                        secondary += 'F';
                    } else if (next === 'H') {
                        // need Uomo to match Womo
                        primary += 'A';
                        secondary += 'A';
                    }
                }

                // Arnow should match Arnoff
                subvalue = characters[index + 3];
                if (
                    (
                        (prev === 'E' || prev === 'O') &&
                        next === 'S' && nextnext === 'K' &&
                        (subvalue === 'I' || subvalue === 'Y')
                    ) ||
                    // Maybe a bug? Shouldnt this be general Germanic?
                    value.slice(0, 3) === 'SCH' ||
                    (index === last && VOWELS.test(prev))
                ) {
                    // primary += '';
                    secondary += 'F';
                    index++;

                    break;
                }

                // polish e.g. 'filipowicz'
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

                // else skip it
                index++;

                break;
            case 'X':
                // french e.g. breaux
                subvalue = characters[index - 2];

                if (
                    index === last ||
                    (
                        // Bug: IAU and EAU also match by AU
                        // /IAU|EAU/.test(value.slice(index - 3, index)) ||
                        prev === 'U' &&
                        (subvalue === 'A' || subvalue === 'O')
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
                // chinese pinyin e.g. 'zhao'
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

module.exports = doubleMetaphone;

},{}],2:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":4}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"FWaASH":6,"inherits":5}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],7:[function(require,module,exports){
'use strict';

var doubleMetaphone, assert;

doubleMetaphone = require('..');
assert = require('assert');

describe('doubleMetaphone()', function () {
    it('should be of type `function`', function () {
        assert(typeof doubleMetaphone === 'function');
    });

    it('should ignore casing', function () {
        var result = doubleMetaphone('hiccups');
        assert(doubleMetaphone('HICCUPS')[0] === result[0]);
        assert(doubleMetaphone('HICCUPS')[1] === result[1]);
        assert(doubleMetaphone('HiCcUpS')[0] === result[0]);
        assert(doubleMetaphone('HiCcUpS')[1] === result[1]);
    });

    it('should drop the initial G when followed by N', function () {
        assert(doubleMetaphone('gnarl')[0].charAt(0) === 'N');
    });

    it('should drop the initial K when followed by N', function () {
        assert(doubleMetaphone('knack')[0].charAt(0) === 'N');
    });

    it('should drop the initial P when followed by N', function () {
        assert(doubleMetaphone('pneumatic')[0].charAt(0) === 'N');
    });

    it('should drop the initial W when followed by R', function () {
        assert(doubleMetaphone('wrack')[0].charAt(0) === 'R');
    });

    it('should drop the initial P when followed by S', function () {
        assert(doubleMetaphone('psycho')[0].charAt(0) === 'S');
    });

    it('should transform the initial X to S', function () {
        assert(doubleMetaphone('Xavier')[0].charAt(0) === 'S');
    });

    it('should transform all initial vowels to A', function () {
        var vowels = 'aeiouy',
            iterator = -1,
            vowel;

        while (vowels[++iterator]) {
            vowel = vowels[iterator];

            assert(doubleMetaphone(vowel)[0] === 'A');
        }
    });

    it('should drop all non-initial vowels', function () {
        var vowels = 'aeiouy',
            iterator = -1,
            vowel;

        while (vowels[++iterator]) {
            vowel = vowels[iterator];

            assert(doubleMetaphone('b' + vowel)[0].length === 1);
        }
    });

    it('should transform B to P', function () {
        assert(doubleMetaphone('b')[0] === 'P');
        assert(doubleMetaphone('bb')[0] === 'P');
    });

    it('should transform Ç to S', function () {
        assert(doubleMetaphone('Ç')[0] === 'S');
    });

    it('should transform C to K, when preceded by A (not preceded by a ' +
        'vowel), followed by H (in turn not followed by I and E, unless ' +
        'the E is in a sequence of BACHER or MACHER)', function () {
            assert(doubleMetaphone('ACH')[0].charAt(1) === 'K');
            assert(doubleMetaphone('AACH')[0].charAt(2) !== 'K');
            assert(doubleMetaphone('ACHI')[0].charAt(1) !== 'K');
            assert(doubleMetaphone('ACHB')[0].charAt(1) === 'K');
            assert(doubleMetaphone('MACHER')[1].charAt(1) === 'K');
            assert(doubleMetaphone('BACHER')[1].charAt(1) === 'K');
        }
    );

    it('should transform the C to S, when in an initial CAESAR', function () {
        assert(doubleMetaphone('CAESAR')[0].charAt(0) === 'S');
    });

    it('should transform the C to K, when in CHIA', function () {
        assert(doubleMetaphone('chianti')[0].charAt(0) === 'K');
    });

    it('should transform the C to K and X, when in CHAE', function () {
        assert(doubleMetaphone('michael')[0].charAt(1) === 'K');
        assert(doubleMetaphone('michael')[1].charAt(1) === 'X');
    });

    it('should transform the C to K, when in an initial CHIA', function () {
        assert(doubleMetaphone('chiastic')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when in an initial CHEM', function () {
        assert(doubleMetaphone('chemical')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when in an initial CHOR', function () {
        assert(doubleMetaphone('choral')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when in an initial CHYM', function () {
        assert(doubleMetaphone('chyme')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when in an initial CHARAC', function () {
        assert(doubleMetaphone('character')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when in an initial CHARIS', function () {
        assert(doubleMetaphone('charisma')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when followed by H, and the given ' +
        'value starts with "van "', function () {
            assert(doubleMetaphone('van ch')[0].charAt(2) === 'K');
        }
    );

    it('should transform the C to K, when followed by H, and the given ' +
        'value starts with "von "', function () {
            assert(doubleMetaphone('von ch')[0].charAt(2) === 'K');
        }
    );

    // This might be a bug, not sure. Now other C's will transform to K in a
    // string sarting with `sch`.
    it('should transform the C to K, when followed by H, and the given ' +
        'value starts with SCH', function () {
            assert(doubleMetaphone('schooner')[0].charAt(1) === 'K');
        }
    );

    it('should transform the C to K, when in ORCHES', function () {
        assert(doubleMetaphone('orchestra')[0].charAt(2) === 'K');
    });

    it('should transform the C to K, when in ARCHIT', function () {
        assert(doubleMetaphone('architect')[0].charAt(2) === 'K');
    });

    it('should NOT transform the C to K, when in ARCH', function () {
        assert(doubleMetaphone('arch')[0].charAt(2) !== 'K');
    });

    it('should transform the C to K, when in ORCHID', function () {
        assert(doubleMetaphone('orchid')[0].charAt(2) === 'K');
    });

    it('should transform the C to K, when followed by HT', function () {
        assert(doubleMetaphone('chthonic')[0].charAt(0) === 'K');
    });

    it('should transform the C to K, when followed by HS', function () {
        assert(doubleMetaphone('fuchsia')[0].charAt(1) === 'K');
    });

    it('should transform the C to K, when an initial, and followed by ' +
        'H and either " ", B, F, H, L, M, N, R, V, or W',
        function () {
            assert(doubleMetaphone('chloride')[0].charAt(0) === 'K');
            assert(doubleMetaphone('chroma')[0].charAt(0) === 'K');
        }
    );

    it('should transform the C to K, when preceded by A, E, O, or U, ' +
        'followed by H and either " ", B, F, H, L, M, N, R, V, or W',
        function () {
            assert(doubleMetaphone('tichner')[1].charAt(1) === 'K');
        }
    );

    it('should transform the C in MCH to K', function () {
        assert(doubleMetaphone('McHugh')[0].charAt(1) === 'K');
    });

    it('should transform the C to X, when in an initial CH', function () {
        assert(doubleMetaphone('chore')[0].charAt(0) === 'X');
    });

    it('should transform the C to X and K, when followed by H', function () {
        var metaphone = doubleMetaphone('achievement');
        assert(metaphone[0].charAt(1) === 'X');
        assert(metaphone[1].charAt(1) === 'K');
    });

    it('should transform the C to S and X, when followed by Z and not ' +
        'preceded by WI', function () {
            var metaphone = doubleMetaphone('czerny');
            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'X');
        }
    );

    it('should transform the C to X, when followed by CIA', function () {
        assert(doubleMetaphone('focaccia')[0].charAt(2) === 'X');
    });

    it('should transform the C to KS, when in an initial ACC, followed by ' +
        'either E, I, or H (but not HU)', function () {
            var metaphone = doubleMetaphone('accident')[0];
            assert(metaphone.charAt(1) === 'K');
            assert(metaphone.charAt(2) === 'S');

            metaphone = doubleMetaphone('accede')[0];
            assert(metaphone.charAt(1) === 'K');
            assert(metaphone.charAt(2) === 'S');
        }
    );

    it('should transform the C to KS, when in UCCEE or UCCES', function () {
        var metaphone = doubleMetaphone('succeed')[0];
        assert(metaphone.charAt(1) === 'K');
        assert(metaphone.charAt(2) === 'S');
    });

    it('should transform the C to X, when followed by C (but not in an ' +
        'initial MCC), either E, I, or H (but not HU)', function () {
            assert(doubleMetaphone('bacci')[0].charAt(1) === 'X');
            assert(doubleMetaphone('bertucci')[0].charAt(3) === 'X');
        }
    );

    it('should transform the C to K, when followed by C (but not in an ' +
        'initial MCC)', function () {
            assert(doubleMetaphone('hiccups')[0].charAt(1) === 'K');
        }
    );

    it('should transform the C to K, when followed by either G, K, or Q',
        function () {
            assert(doubleMetaphone('knack')[0].charAt(1) === 'K');
        }
    );

    it('should transform the C to S and X, when followed by I and either ' +
        'E, or O', function () {
            var metaphone = doubleMetaphone('ancient');
            assert(metaphone[0].charAt(2) === 'S');
            assert(metaphone[1].charAt(2) === 'X');

            metaphone = doubleMetaphone('delicious');
            assert(metaphone[0].charAt(2) === 'S');
            assert(metaphone[1].charAt(2) === 'X');
        }
    );

    it('should transform the C to S, when followed by either I, E, or Y',
        function () {
            assert(doubleMetaphone('acicula')[0].charAt(1) === 'S');

            assert(doubleMetaphone('abduce')[0].charAt(3) === 'S');

            assert(doubleMetaphone('acyl')[0].charAt(1) === 'S');
        }
    );

    it('should transform "C C" to K', function () {
        assert(doubleMetaphone('Mac Caffrey')[0].charAt(1) === 'K');
    });

    it('should transform "C G" to K', function () {
        assert(doubleMetaphone('Mac Gregor')[0].charAt(1) === 'K');
    });

    it('should transform "C G" to K', function () {
        assert(doubleMetaphone('Mac Quillan')[0].charAt(1) === 'K');
    });

    it('should transform CK to K', function () {
        assert(doubleMetaphone('aback')[0].charAt(2) === 'K');
    });

    it('should transform CQ to K', function () {
        assert(doubleMetaphone('acquit')[0].charAt(1) === 'K');
    });

    it('should transform CC to K, when not followed by E or I', function () {
        assert(doubleMetaphone('acclimate')[0].charAt(1) === 'K');
    });

    it('should transform DGE to J', function () {
        assert(doubleMetaphone('edge')[0].charAt(1) === 'J');
    });

    it('should transform DGI to J', function () {
        assert(doubleMetaphone('pidgin')[0].charAt(1) === 'J');
    });

    it('should transform DGY to J', function () {
        assert(doubleMetaphone('edgy')[0].charAt(1) === 'J');
    });

    it('should transform DG to TK', function () {
        assert(doubleMetaphone('Edgar')[0].slice(1, 3) === 'TK');
    });

    it('should transform DG to TK', function () {
        assert(doubleMetaphone('Edgar')[0].slice(1, 3) === 'TK');
    });

    it('should transform DT to T', function () {
        assert(doubleMetaphone('width')[0].charAt(1) === 'T');
    });

    it('should transform DD to T', function () {
        assert(doubleMetaphone('add')[0].charAt(1) === 'T');
    });

    it('should transform D to T', function () {
        assert(doubleMetaphone('Abduce')[0].charAt(2) === 'T');
    });

    it('should transform FF to F', function () {
        assert(doubleMetaphone('affect')[0].charAt(1) === 'F');
    });

    it('should transform F to F', function () {
        assert(doubleMetaphone('abaft')[0].charAt(2) === 'F');
    });

    it('should transform GH to K when preceded by a consonant', function () {
        assert(doubleMetaphone('aargh')[0].charAt(2) === 'K');
    });

    it('should transform initial GHI to J', function () {
        assert(doubleMetaphone('ghislane')[0].charAt(0) === 'J');
    });

    it('should transform initial GH to K', function () {
        assert(doubleMetaphone('ghoul')[0].charAt(0) === 'K');
    });

    it('should drop GH in B.GH, H.GH, or D.GH', function () {
        assert(doubleMetaphone('hugh')[0] === 'H');
    });

    it('should drop GH in B..GH, H..GH, or D..GH', function () {
        assert(doubleMetaphone('bough')[0] === 'P');
    });

    it('should drop GH in B...GH or H...GH', function () {
        assert(doubleMetaphone('broughton')[0] === 'PRTN');
    });

    it('should transform GH to F in C.UGH, G.UGH, L.UGH, R.UGH, T.UGH',
        function () {
            assert(doubleMetaphone('laugh')[0] === 'LF');
        }
    );

    it('should transform GH to K, when preceded by anything other than I',
        function () {
            assert(doubleMetaphone('curagh')[0] === 'KRK');
        }
    );

    it('should drop GH', function () {
        assert(doubleMetaphone('weight')[0] === 'AT');
    });

    it('should transform GN to KN and N, when preceded by a vowel and ^, ' +
        'and not Slavo-Germanic', function () {
            var metaphone = doubleMetaphone('agnize');
            assert(metaphone[0].slice(0, 3) === 'AKN');
            assert(metaphone[1].slice(0, 2) === 'AN');
        }
    );

    it('should transform GN to N and KN, when not followed by EY and Y, ' +
        'and not Slavo-Germanic', function () {
            var metaphone = doubleMetaphone('acceptingness');
            assert(metaphone[0].slice(-3) === 'NNS');
            assert(metaphone[1].slice(-4) === 'NKNS');
        }
    );

    it('should transform GN to KN', function () {
        assert(doubleMetaphone('cagney')[0] === 'KKN');
    });

    it('should transform GLI to KL and L', function () {
        var metaphone = doubleMetaphone('tagliaro');
        assert(metaphone[0] === 'TKLR');
        assert(metaphone[1] === 'TLR');
    });

    it('should transform an initial GY., GES, GEP, GEB, GEL, GEY, GIB, ' +
        'GIL, GIN, GIE, GEI, and GER to K and J', function () {
            var metaphone = doubleMetaphone('Gerben');
            assert(metaphone[0].charAt(0) === 'K');
            assert(metaphone[1].charAt(0) === 'J');
        }
    );

    it('should transform GER to K and J, when not in DANGER, RANGER, and ' +
        'MANGER, and not preceded by E and I', function () {
            var metaphone = doubleMetaphone('auger');
            assert(metaphone[0].charAt(1) === 'K');
            assert(metaphone[1].charAt(1) === 'J');
        }
    );

    it('should transform GY to K and J, when not preceded by E, I, R, ' +
        'and O', function () {
            var metaphone = doubleMetaphone('bulgy');
            assert(metaphone[0].charAt(2) === 'K');
            assert(metaphone[1].charAt(2) === 'J');
        }
    );

    it('should transform the G in GET to K', function () {
        var metaphone = doubleMetaphone('altogether');
        assert(metaphone[0].charAt(3) === 'K');
    });

    it('should transform G to K, when Germanic and followed by E, I, or Y',
        function () {
            var metaphone = doubleMetaphone('Van Agema');
            assert(metaphone[0].charAt(2) === 'K');
        }
    );

    it('should transform G to K, when Germanic, preceded by A or O, and ' +
        'followed by GI',
        function () {
            var metaphone = doubleMetaphone('Von Goggin');
            assert(metaphone[0].charAt(3) === 'K');
        }
    );

    it('should transform G to J, when followed by "IER "', function () {
        var metaphone = doubleMetaphone('tangier');
        assert(metaphone[0].charAt(2) === 'J');
    });

    it('should transform G to J and K, when followed by E, I, or Y, or ' +
        'preceded by A or O and followed by GI',
        function () {
            var metaphone = doubleMetaphone('biaggi');
            assert(metaphone[0].charAt(1) === 'J');
            assert(metaphone[1].charAt(1) === 'K');
        }
    );

    it('should transform GG to K', function () {
        assert(doubleMetaphone('GG')[0] === 'K');
    });

    it('should transform G to K', function () {
        assert(doubleMetaphone('G')[0] === 'K');
    });

    it('should keep H when initial and followed by a vowel', function () {
        assert(doubleMetaphone('ha')[0] === 'H');
    });

    it('should keep H when both followed and preceded by a vowel',
        function () {
            assert(doubleMetaphone('aha')[0] === 'AH');
        }
    );

    it('should drop H', function () {
        assert(doubleMetaphone('h')[0] === '');
    });

    it('should transform J to H when obviously spanish (an initial "SAN ")',
        function () {
            assert(doubleMetaphone('San Jacinto')[0].charAt(2) === 'H');
        }
    );

    it('should transform J to H in an initial "J... "', function () {
        assert(doubleMetaphone('Jose')[0].charAt(0) === 'H');
    });

    it('should transform the J to J and H, when in JOSE', function () {
        var metaphone = doubleMetaphone('Joseph');
        assert(metaphone[0].charAt(0) === 'J');
        assert(metaphone[1].charAt(0) === 'H');
    });

    it('should transform an initial J to J and A', function () {
        var metaphone = doubleMetaphone('Jankelowicz');
        assert(metaphone[0].charAt(0) === 'J');
        assert(metaphone[1].charAt(0) === 'A');
    });

    it('should transform J to J and H, when preceded by a vowel, followed ' +
        'by A or O, and not Slavo-Germanic', function () {
            var metaphone = doubleMetaphone('bajador');
            assert(metaphone[0].charAt(1) === 'J');
            assert(metaphone[1].charAt(1) === 'H');
        }
    );

    it('should both keep and drop a final J', function () {
        var metaphone = doubleMetaphone('svaraj');
        assert(metaphone[0] === 'SFRJ');
        assert(metaphone[1] === 'SFR');
    });

    it('should keep J when not preceded by S, K, and L, and not followed ' +
        'by L, T, K, S, N, M, B, and Z', function () {
            assert(doubleMetaphone('abject')[0].charAt(2) === 'J');
        }
    );

    it('should drop JJ', function () {
        assert(doubleMetaphone('sjji')[0] === 'S');
    });

    it('should drop J', function () {
        assert(doubleMetaphone('disject')[0] === 'TSKT');
    });

    it('should transform KK to K', function () {
        assert(doubleMetaphone('trekker')[0] === 'TRKR');
    });

    it('should keep K', function () {
        assert(doubleMetaphone('like')[0] === 'LK');
    });

    it('should both transform LL to L, and drop it, when in a final ILLO, ' +
        'ILLA and ALLE', function () {
            var metaphone = doubleMetaphone('cabrillo');
            assert(metaphone[0] === 'KPRL');
            assert(metaphone[1] === 'KPR');

            metaphone = doubleMetaphone('villa');
            assert(metaphone[0] === 'FL');
            assert(metaphone[1] === 'F');

            metaphone = doubleMetaphone('crevalle');
            assert(metaphone[0] === 'KRFL');
            assert(metaphone[1] === 'KRF');
        }
    );

    it('should both transform the LL to L, and drop it, in ALLE, when the ' +
        'given value ends in A, O, AS, or OS', function () {
            var metaphone = doubleMetaphone('allegretto');
            assert(metaphone[0] === 'ALKRT');
            assert(metaphone[1] === 'AKRT');

            metaphone = doubleMetaphone('allegros');
            assert(metaphone[0] === 'ALKRS');
            assert(metaphone[1] === 'AKRS');
        }
    );

    it('should transform LL to L', function () {
        assert(doubleMetaphone('ll')[0] === 'L');
    });

    it('should keep L', function () {
        assert(doubleMetaphone('l')[0] === 'L');
    });

    it('should transform a final UMB to M', function () {
        assert(doubleMetaphone('thumb')[0] === '0M');
    });

    it('should transform UMB to M when followed by ER', function () {
        assert(doubleMetaphone('dumber')[0] === 'TMR');
    });

    it('should transform MM to M', function () {
        assert(doubleMetaphone('mm')[0] === 'M');
    });

    it('should keep M', function () {
        assert(doubleMetaphone('m')[0] === 'M');
    });

    it('should transform NN to N', function () {
        assert(doubleMetaphone('nn')[0] === 'N');
    });

    it('should keep N', function () {
        assert(doubleMetaphone('n')[0] === 'N');
    });

    it('should transform Ñ to N', function () {
        assert(doubleMetaphone('Ñ')[0] === 'N');
    });

    it('should transform PH to F', function () {
        assert(doubleMetaphone('ph')[0] === 'F');
    });

    it('should transform PB to P', function () {
        assert(doubleMetaphone('pb')[0] === 'P');
    });

    it('should transform PP to P', function () {
        assert(doubleMetaphone('pp')[0] === 'P');
    });

    it('should keep P', function () {
        assert(doubleMetaphone('p')[0] === 'P');
    });

    it('should transform QQ to K', function () {
        assert(doubleMetaphone('qq')[0] === 'K');
    });

    it('should transform Q to K', function () {
        assert(doubleMetaphone('q')[0] === 'K');
    });

    it('should both drop and keep a final R when preceded by IE, in ' +
        'turn not preceded by ME and MA', function () {
            var metaphone = doubleMetaphone('Xavier');
            assert(metaphone[0] === 'SF');
            assert(metaphone[1] === 'SFR');
        }
    );

    it('should transform RR to R', function () {
        assert(doubleMetaphone('rr')[0] === 'R');
    });

    it('should keep R', function () {
        assert(doubleMetaphone('r')[0] === 'R');
    });

    it('should drop S when preceded by I or Y and followed by L',
        function () {
            assert(doubleMetaphone('island')[0] === 'ALNT');
        }
    );

    it('should drop S when preceded by I or Y and followed by L',
        function () {
            assert(doubleMetaphone('island')[0] === 'ALNT');
        }
    );

    it('should transform the S to X and S in an initial SUGAR', function () {
        var metaphone = doubleMetaphone('sugar');
        assert(metaphone[0].charAt(0) === 'X');
        assert(metaphone[1].charAt(0) === 'S');
    });

    it('should transform the SH to S in SHEIM, SHOEK, SHOLM, SHOLZ',
        function () {
            assert(doubleMetaphone('Sholz')[0].charAt(0) === 'S');
        }
    );

    it('should transform the SH to X', function () {
        assert(doubleMetaphone('sh')[0].charAt(0) === 'X');
    });

    it('should transform SIO and SIA to S and X, when not Slavo-Germanic',
        function () {
            var metaphone = doubleMetaphone('sio');
            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'X');
        }
    );

    it('should transform SIO and SIA to S, when Slavo-Germanic',
        function () {
            var metaphone = doubleMetaphone('sioricz');
            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'S');
        }
    );

    it('should transform SZ to X and S', function () {
        var metaphone = doubleMetaphone('sz');
        assert(metaphone[0] === 'S');
        assert(metaphone[1] === 'X');
    });

    it('should transform S to X and S when followed by L, M, N, or W',
        function () {
            var metaphone = doubleMetaphone('sl');
            assert(metaphone[0] === 'SL');
            assert(metaphone[1] === 'XL');
        }
    );

    it('should transform SCH to X and SK when followed by ER or EN',
        function () {
            var metaphone = doubleMetaphone('schenker');
            assert(metaphone[0] === 'XNKR');
            assert(metaphone[1] === 'SKNKR');
        }
    );

    it('should transform SCH to SK when followed by OO, UY, ED, or EM',
        function () {
            var metaphone = doubleMetaphone('schooner');
            assert(metaphone[0] === 'SKNR');
            assert(metaphone[1] === 'SKNR');
        }
    );

    it('should transform SCH to X and S, when initial, and not followed ' +
        'by a non-vowel and W', function () {
            var metaphone = doubleMetaphone('schlepp');
            assert(metaphone[0] === 'XLP');
            assert(metaphone[1] === 'SLP');
        }
    );

    it('should transform SCH to X', function () {
        assert(doubleMetaphone('borscht')[0] === 'PRXT');
    });

    it('should transform SCI, SCE, and SCY to S', function () {
        assert(doubleMetaphone('sci')[0] === 'S');
    });

    it('should transform SC. to SK', function () {
        assert(doubleMetaphone('scu')[0] === 'SK');
    });

    it('should drop and keep S, when final and preceded by AI or OI',
        function () {
            var metaphone = doubleMetaphone('ois');
            assert(metaphone[0] === 'A');
            assert(metaphone[1] === 'AS');
        }
    );

    it('should transform SS to S', function () {
        assert(doubleMetaphone('ss')[0] === 'S');
    });

    it('should keep S', function () {
        assert(doubleMetaphone('s')[0] === 'S');
    });

    it('should transform TIO to X, when followed by N', function () {
        assert(doubleMetaphone('tion')[0] === 'XN');
    });

    it('should transform TIA and TCH to X', function () {
        assert(doubleMetaphone('tia')[0] === 'X');
        assert(doubleMetaphone('tch')[0] === 'X');
    });

    it('should transform TH to T, when followed by OM or AM', function () {
        assert(doubleMetaphone('thom')[0] === 'TM');
        assert(doubleMetaphone('tham')[0] === 'TM');
    });

    it('should transform TH to T, when Germanic', function () {
        assert(doubleMetaphone('Von Goethals')[0].charAt(3) === 'T');
    });

    it('should transform TT to T, when Germanic and followed by H',
        function () {
            assert(doubleMetaphone('Von Matthes')[0].charAt(3) === 'T');
        }
    );

    it('should transform TH to 0 and T', function () {
        var metaphone = doubleMetaphone('th');
        assert(metaphone[0] === '0');
        assert(metaphone[1] === 'T');
    });

    it('should transform TT to T', function () {
        assert(doubleMetaphone('tt')[0] === 'T');
    });

    it('should transform TD to T', function () {
        assert(doubleMetaphone('td')[0] === 'T');
    });

    it('should keep T', function () {
        assert(doubleMetaphone('t')[0] === 'T');
    });

    it('should transform VV to F', function () {
        assert(doubleMetaphone('vv')[0] === 'F');
    });

    it('should transform V to F', function () {
        assert(doubleMetaphone('v')[0] === 'F');
    });

    it('should transform WR to R', function () {
        assert(doubleMetaphone('awr')[0] === 'AR');
    });

    it('should transform W to A and F, when initial and followed by a vowel',
        function () {
            var metaphone = doubleMetaphone('wa');
            assert(metaphone[0] === 'A');
            assert(metaphone[1] === 'F');
        }
    );

    it('should transform W to A, when initial and followed by H',
        function () {
            assert(doubleMetaphone('wh')[0] === 'A');
        }
    );

    it('should both drop and transform W to F, when in EWSKI, EWSKY, ' +
        'OWSKI, or OWSKY', function () {
            var metaphone = doubleMetaphone('Tsjaikowski');
            assert(metaphone[0] === 'TSKSK');
            assert(metaphone[1] === 'TSKFSK');

            metaphone = doubleMetaphone('Tsjaikowsky');
            assert(metaphone[0] === 'TSKSK');
            assert(metaphone[1] === 'TSKFSK');
        }
    );

    it('should both drop and transform W to F, when the value starts ' +
        'with SCH', function () {
            var metaphone = doubleMetaphone('schwa');

            assert(metaphone[0] === 'X');
            assert(metaphone[1] === 'XF');
        }
    );

    it('should both drop and transform W to F, when final and preceded by ' +
        'a vowel', function () {
            var metaphone = doubleMetaphone('Arnow');
            assert(metaphone[0] === 'ARN');
            assert(metaphone[1] === 'ARNF');
        }
    );

    it('should transform W to TS and FX, when followed by ICZ or ITZ',
        function () {
            var metaphone = doubleMetaphone('Filipowicz');
            assert(metaphone[0] === 'FLPTS');
            assert(metaphone[1] === 'FLPFX');

            metaphone = doubleMetaphone('Filipowitz');
            assert(metaphone[0] === 'FLPTS');
            assert(metaphone[1] === 'FLPFX');
        }
    );

    it('should drop W', function () {
        assert(doubleMetaphone('w')[0] === '');
    });

    it('should transform X to KS, when final', function () {
        assert(doubleMetaphone('matrix')[0] === 'MTRKS');
    });

    it('should transform X to KS, when preceded by IAU, EAU, AU, or OU',
        function () {
            assert(doubleMetaphone('iauxa')[0] === 'AKS');
            assert(doubleMetaphone('eauxa')[0] === 'AKS');
            assert(doubleMetaphone('auxa')[0] === 'AKS');
            assert(doubleMetaphone('ouxa')[0] === 'AKS');
        }
    );

    it('should drop XC', function () {
        assert(doubleMetaphone('AXC')[0] === 'A');
    });

    it('should drop XX', function () {
        assert(doubleMetaphone('axx')[0] === 'A');
    });

    it('should drop X', function () {
        assert(doubleMetaphone('axe')[0] === 'A');
    });

    it('should transform ZH to J', function () {
        assert(doubleMetaphone('zhao')[0] === 'J');
    });

    it('should transform Z to S and TS, when followed by ZA, ZI, or ZO',
        function () {
            var metaphone = doubleMetaphone('zza');
            assert(metaphone[0] === 'S');
            assert(metaphone[1] === 'TS');

            metaphone = doubleMetaphone('zzi');
            assert(metaphone[0] === 'S');
            assert(metaphone[1] === 'TS');

            metaphone = doubleMetaphone('zzo');
            assert(metaphone[0] === 'S');
            assert(metaphone[1] === 'TS');
        }
    );

    it('should transform Z to S and TS, when not initial, not ' +
        'Slavo-Germanic, and not preceded by T', function () {
            var metaphone = doubleMetaphone('Mazurkiewicz');
            assert(metaphone[0] === 'MSRKTS');
            assert(metaphone[1] === 'MTSRKFX');
        }
    );

    it('should transform ZZ to S', function () {
        assert(doubleMetaphone('zz')[0] === 'S');
    });

    it('should transform Z to S', function () {
        assert(doubleMetaphone('z')[0] === 'S');
    });

    it('should be compatible with (Node) Natural', function () {
        // Source:
        // https://github.com/NaturalNode/natural
        var attribute, tests, phonetics;

        tests = {
            'complete' : ['KMPLT', 'KMPLT'],
            'Matrix' : ['MTRKS', 'MTRKS'],
            'appropriate' : ['APRPRT', 'APRPRT'],
            'intervention' : ['ANTRFNXN', 'ANTRFNXN'],
            'Français' : ['FRNS', 'FRNSS']
        };

        for (attribute in tests) {
            phonetics = doubleMetaphone(attribute);
            // console.log(phonetics, tests[attribute]);
            assert(phonetics[0] === tests[attribute][0]);
            assert(phonetics[1] === tests[attribute][1]);
        }
    });
});

},{"..":1,"assert":2}]},{},[7])