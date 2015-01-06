'use strict';

/*
 * Dependencies.
 */

var doubleMetaphone,
    assert;

doubleMetaphone = require('./');
assert = require('assert');

/*
 * Tests.
 */

describe('doubleMetaphone(value)', function () {
    it('should be of type `function`', function () {
        assert(typeof doubleMetaphone === 'function');
    });

    it('should ignore casing', function () {
        var result;

        result = doubleMetaphone('hiccups');

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
        var vowels,
            index,
            vowel;

        vowels = 'aeiouy';
        index = -1;

        while (vowels[++index]) {
            vowel = vowels[index];

            assert(doubleMetaphone(vowel)[0] === 'A');
        }
    });

    it('should drop all non-initial vowels', function () {
        var vowels,
            index,
            vowel;

        vowels = 'aeiouy';
        index = -1;

        while (vowels[++index]) {
            vowel = vowels[index];

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
        var metaphone;

        metaphone = doubleMetaphone('achievement');

        assert(metaphone[0].charAt(1) === 'X');
        assert(metaphone[1].charAt(1) === 'K');
    });

    it('should transform the C to S and X, when followed by Z and not ' +
        'preceded by WI', function () {
            var metaphone;

            metaphone = doubleMetaphone('czerny');

            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'X');
        }
    );

    it('should transform the C to X, when followed by CIA', function () {
        assert(doubleMetaphone('focaccia')[0].charAt(2) === 'X');
    });

    it('should transform the C to KS, when in an initial ACC, followed by ' +
        'either E, I, or H (but not HU)', function () {
            var metaphone;

            metaphone = doubleMetaphone('accident')[0];

            assert(metaphone.charAt(1) === 'K');
            assert(metaphone.charAt(2) === 'S');

            metaphone = doubleMetaphone('accede')[0];

            assert(metaphone.charAt(1) === 'K');
            assert(metaphone.charAt(2) === 'S');
        }
    );

    it('should transform the C to KS, when in UCCEE or UCCES', function () {
        var metaphone;

        metaphone = doubleMetaphone('succeed')[0];

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
            var metaphone;

            metaphone = doubleMetaphone('ancient');

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
            var metaphone;

            metaphone = doubleMetaphone('agnize');

            assert(metaphone[0].slice(0, 3) === 'AKN');
            assert(metaphone[1].slice(0, 2) === 'AN');
        }
    );

    it('should transform GN to N and KN, when not followed by EY and Y, ' +
        'and not Slavo-Germanic', function () {
            var metaphone;

            metaphone = doubleMetaphone('acceptingness');

            assert(metaphone[0].slice(-3) === 'NNS');
            assert(metaphone[1].slice(-4) === 'NKNS');
        }
    );

    it('should transform GN to KN', function () {
        assert(doubleMetaphone('cagney')[0] === 'KKN');
    });

    it('should transform GLI to KL and L', function () {
        var metaphone;

        metaphone = doubleMetaphone('tagliaro');

        assert(metaphone[0] === 'TKLR');
        assert(metaphone[1] === 'TLR');
    });

    it('should transform an initial GY., GES, GEP, GEB, GEL, GEY, GIB, ' +
        'GIL, GIN, GIE, GEI, and GER to K and J', function () {
            var metaphone;

            metaphone = doubleMetaphone('Gerben');

            assert(metaphone[0].charAt(0) === 'K');
            assert(metaphone[1].charAt(0) === 'J');
        }
    );

    it('should transform GER to K and J, when not in DANGER, RANGER, and ' +
        'MANGER, and not preceded by E and I', function () {
            var metaphone;

            metaphone = doubleMetaphone('auger');

            assert(metaphone[0].charAt(1) === 'K');
            assert(metaphone[1].charAt(1) === 'J');
        }
    );

    it('should transform GY to K and J, when not preceded by E, I, R, ' +
        'and O', function () {
            var metaphone;

            metaphone = doubleMetaphone('bulgy');

            assert(metaphone[0].charAt(2) === 'K');
            assert(metaphone[1].charAt(2) === 'J');
        }
    );

    it('should transform the G in GET to K', function () {
        var metaphone;

        metaphone = doubleMetaphone('altogether');

        assert(metaphone[0].charAt(3) === 'K');
    });

    it('should transform G to K, when Germanic and followed by E, I, or Y',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('Van Agema');

            assert(metaphone[0].charAt(2) === 'K');
        }
    );

    it('should transform G to K, when Germanic, preceded by A or O, and ' +
        'followed by GI',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('Von Goggin');

            assert(metaphone[0].charAt(3) === 'K');
        }
    );

    it('should transform G to J, when followed by "IER "', function () {
        var metaphone;

        metaphone = doubleMetaphone('tangier');

        assert(metaphone[0].charAt(2) === 'J');
    });

    it('should transform G to J and K, when followed by E, I, or Y, or ' +
        'preceded by A or O and followed by GI',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('biaggi');

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
        var metaphone;

        metaphone = doubleMetaphone('Joseph');

        assert(metaphone[0].charAt(0) === 'J');
        assert(metaphone[1].charAt(0) === 'H');
    });

    it('should transform an initial J to J and A', function () {
        var metaphone;

        metaphone = doubleMetaphone('Jankelowicz');

        assert(metaphone[0].charAt(0) === 'J');
        assert(metaphone[1].charAt(0) === 'A');
    });

    it('should transform J to J and H, when preceded by a vowel, followed ' +
        'by A or O, and not Slavo-Germanic', function () {
            var metaphone;

            metaphone = doubleMetaphone('bajador');

            assert(metaphone[0].charAt(1) === 'J');
            assert(metaphone[1].charAt(1) === 'H');
        }
    );

    it('should both keep and drop a final J', function () {
        var metaphone;

        metaphone = doubleMetaphone('svaraj');

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
            var metaphone;

            metaphone = doubleMetaphone('cabrillo');

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
            var metaphone;

            metaphone = doubleMetaphone('allegretto');

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
            var metaphone;

            metaphone = doubleMetaphone('Xavier');

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
        var metaphone;

        metaphone = doubleMetaphone('sugar');

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
            var metaphone;

            metaphone = doubleMetaphone('sio');

            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'X');
        }
    );

    it('should transform SIO and SIA to S, when Slavo-Germanic',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('sioricz');

            assert(metaphone[0].charAt(0) === 'S');
            assert(metaphone[1].charAt(0) === 'S');
        }
    );

    it('should transform SZ to X and S', function () {
        var metaphone;

        metaphone = doubleMetaphone('sz');

        assert(metaphone[0] === 'S');
        assert(metaphone[1] === 'X');
    });

    it('should transform S to X and S when followed by L, M, N, or W',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('sl');

            assert(metaphone[0] === 'SL');
            assert(metaphone[1] === 'XL');
        }
    );

    it('should transform SCH to X and SK when followed by ER or EN',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('schenker');

            assert(metaphone[0] === 'XNKR');
            assert(metaphone[1] === 'SKNKR');
        }
    );

    it('should transform SCH to SK when followed by OO, UY, ED, or EM',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('schooner');

            assert(metaphone[0] === 'SKNR');
            assert(metaphone[1] === 'SKNR');
        }
    );

    it('should transform SCH to X and S, when initial, and not followed ' +
        'by a non-vowel and W', function () {
            var metaphone;

            metaphone = doubleMetaphone('schlepp');

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
            var metaphone;

            metaphone = doubleMetaphone('ois');

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
        var metaphone;

        metaphone = doubleMetaphone('th');

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
            var metaphone;

            metaphone = doubleMetaphone('wa');

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
            var metaphone;

            metaphone = doubleMetaphone('Tsjaikowski');

            assert(metaphone[0] === 'TSKSK');
            assert(metaphone[1] === 'TSKFSK');

            metaphone = doubleMetaphone('Tsjaikowsky');

            assert(metaphone[0] === 'TSKSK');
            assert(metaphone[1] === 'TSKFSK');
        }
    );

    it('should both drop and transform W to F, when the value starts ' +
        'with SCH', function () {
            var metaphone;

            metaphone = doubleMetaphone('schwa');

            assert(metaphone[0] === 'X');
            assert(metaphone[1] === 'XF');
        }
    );

    it('should both drop and transform W to F, when final and preceded by ' +
        'a vowel', function () {
            var metaphone;

            metaphone = doubleMetaphone('Arnow');

            assert(metaphone[0] === 'ARN');
            assert(metaphone[1] === 'ARNF');
        }
    );

    it('should transform W to TS and FX, when followed by ICZ or ITZ',
        function () {
            var metaphone;

            metaphone = doubleMetaphone('Filipowicz');

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
            var metaphone;

            metaphone = doubleMetaphone('zza');

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
            var metaphone;

            metaphone = doubleMetaphone('Mazurkiewicz');

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
});

/*
 * Tests that this module returns the same results
 * as Natural.
 *
 * Source:
 *   https://github.com/NaturalNode/natural
 */

describe('Compatibility with Natural', function () {
    var fixtures;

    fixtures = {
        'complete': ['KMPLT', 'KMPLT'],
        'Matrix': ['MTRKS', 'MTRKS'],
        'appropriate': ['APRPRT', 'APRPRT'],
        'intervention': ['ANTRFNXN', 'ANTRFNXN'],
        'Français': ['FRNS', 'FRNSS']
    };

    Object.keys(fixtures).forEach(function (fixture) {
        var result;

        result = fixtures[fixture];

        it('should process `' + fixture + '` to `' + result[0] + '` and `' +
            result[1] + '`', function () {
                var phonetics;

                phonetics = doubleMetaphone(fixture);

                assert(phonetics[0] === result[0]);
                assert(phonetics[1] === result[1]);
            }
        );
    });
});
