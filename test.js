import assert from 'node:assert/strict'
import util from 'node:util'
import cp from 'node:child_process'
import fs from 'node:fs'
import {URL} from 'node:url'
import {PassThrough} from 'node:stream'
import test from 'node:test'
import {doubleMetaphone as m} from './index.js'

const exec = util.promisify(cp.exec)

/** @type {import('type-fest').PackageJson} */
const pack = JSON.parse(
  String(fs.readFileSync(new URL('package.json', import.meta.url)))
)

test('api', async function (t) {
  assert.equal(typeof m, 'function', 'should be a `function`')

  await t.test('compatibility w/ natural', function () {
    assert.deepEqual(m('ptah'), ['PT', 'PT'])
    assert.deepEqual(m('ceasar'), ['SSR', 'SSR'])
    assert.deepEqual(m('ach'), ['AK', 'AK'])
    assert.deepEqual(m('chemical'), ['KMKL', 'KMKL'])
    assert.deepEqual(m('choral'), ['KRL', 'KRL'])
  })

  assert.deepEqual(m('alexander'), m('aleksander'), 'GH-2')

  assert.deepEqual(m('HICCUPS'), m('HiCcUpS'), 'should ignore casing (1)')
  assert.deepEqual(m('HiCcUpS'), m('hiccups'), 'should ignore casing (2)')

  assert.equal(
    m('gnarl')[0].charAt(0),
    'N',
    'should drop the initial G when followed by N'
  )
  assert.equal(
    m('knack')[0].charAt(0),
    'N',
    'should drop the initial K when followed by N'
  )
  assert.equal(
    m('pneumatic')[0].charAt(0),
    'N',
    'should drop the initial P when followed by N'
  )
  assert.equal(
    m('wrack')[0].charAt(0),
    'R',
    'should drop the initial W when followed by R'
  )
  assert.equal(
    m('psycho')[0].charAt(0),
    'S',
    'should drop the initial P when followed by S'
  )
  assert.equal(
    m('Xavier')[0].charAt(0),
    'S',
    'should transform the initial X to S'
  )

  assert.doesNotThrow(function () {
    const vowels = 'aeiouy'
    let index = -1
    while (++index < vowels.length) {
      assert.strictEqual(m(vowels.charAt(index))[0], 'A')
    }
  }, 'should transform all initial vowels to A')

  assert.doesNotThrow(function () {
    const vowels = 'aeiouy'
    let index = -1
    while (++index < vowels.length) {
      assert.strictEqual(m('b' + vowels.charAt(index))[0].length, 1)
    }
  }, 'should drop all non-initial vowels')

  assert.equal(m('b')[0].charAt(0), 'P', 'should transform B to P (1)')
  assert.equal(m('bb')[0].charAt(0), 'P', 'should transform B to P (2)')

  assert.equal(m('Ç')[0].charAt(0), 'S', 'should transform Ç to S')

  await t.test(
    'should transform C to K, when preceded by A (not preceded by a vowel), followed by H (in turn not followed by I and E, unless the E is in a sequence of BACHER or MACHER)',
    function () {
      assert.equal(m('ACH')[0].charAt(1), 'K')
      assert.notEqual(m('AACH')[0].charAt(2), 'K')
      assert.notEqual(m('ACHI')[0].charAt(1), 'K')
      assert.equal(m('ACHB')[0].charAt(1), 'K')
      assert.equal(m('MACHER')[1].charAt(1), 'K')
      assert.equal(m('BACHER')[1].charAt(1), 'K')
    }
  )

  assert.equal(
    m('CAESAR')[0].charAt(0),
    'S',
    'should transform the C to S, when in an initial CAESAR'
  )
  assert.equal(
    m('chianti')[0].charAt(0),
    'K',
    'should transform the C to K, when in CHIA'
  )
  assert.equal(
    m('michael')[0].charAt(1),
    'K',
    'should transform the C to K and X, when in CHAE (1)'
  )
  assert.equal(
    m('michael')[1].charAt(1),
    'X',
    'should transform the C to K and X, when in CHAE (2)'
  )
  assert.equal(
    m('chiastic')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHIA'
  )
  assert.equal(
    m('chemical')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHEM'
  )
  assert.equal(
    m('choral')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHOR'
  )
  assert.equal(
    m('chyme')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHYM'
  )
  assert.equal(
    m('character')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHARAC'
  )
  assert.equal(
    m('charisma')[0].charAt(0),
    'K',
    'should transform the C to K, when in an initial CHARIS'
  )
  assert.equal(
    m('von ch')[0].charAt(2),
    'K',
    'should transform the C to K, when followed by H, and the given value starts with `von `'
  )

  // This might be a bug, not sure.
  // Now other C's will transform to K in a string sarting with `sch`.
  assert.equal(
    m('schooner')[0].charAt(1),
    'K',
    'should transform the C to K, when followed by H, and the given value starts with SCH'
  )

  assert.equal(
    m('orchestra')[0].charAt(2),
    'K',
    'should transform the C to K, when in ORCHES'
  )
  assert.equal(
    m('architect')[0].charAt(2),
    'K',
    'should transform the C to K, when in ARCHIT'
  )
  assert.notEqual(
    m('arch')[0].charAt(2),
    'K',
    'should NOT transform the C to K, when in ARCH'
  )
  assert.equal(
    m('orchid')[0].charAt(2),
    'K',
    'should transform the C to K, when in ORCHID'
  )
  assert.equal(
    m('chthonic')[0].charAt(0),
    'K',
    'should transform the C to K, when followed by HT'
  )
  assert.equal(
    m('fuchsia')[0].charAt(1),
    'K',
    'should transform the C to K, when followed by HS'
  )

  assert.equal(
    m('chloride')[0].charAt(0),
    'K',
    'should transform the C to K, when an initial, and followed by H and either ` `, B, F, H, L, M, N, R, V, or W (1)'
  )
  assert.equal(
    m('chroma')[0].charAt(0),
    'K',
    'should transform the C to K, when an initial, and followed by H and either ` `, B, F, H, L, M, N, R, V, or W (2)'
  )
  assert.equal(
    m('tichner')[1].charAt(1),
    'K',
    'should transform the C to K, when preceded by A, E, O, or U, followed by H and either " ", B, F, H, L, M, N, R, V, or W'
  )

  assert.equal(
    m('tichner')[1].charAt(1),
    'K',
    'should transform the C to K, when preceded by A, E, O, or U, followed by H and either " ", B, F, H, L, M, N, R, V, or W'
  )

  assert.equal(
    m('McHugh')[0].charAt(1),
    'K',
    'should transform the C in MCH to K'
  )
  assert.equal(
    m('chore')[0].charAt(0),
    'X',
    'should transform the C to X, when in an initial CH'
  )

  await t.test(
    'should transform the C to X and K, when followed by H',
    function () {
      const phonetics = m('achievement')

      assert.equal(phonetics[0].charAt(1), 'X')
      assert.equal(phonetics[1].charAt(1), 'K')
    }
  )

  await t.test(
    'should transform the C to S and X, when followed by Z and not preceded by WI',
    function () {
      const phonetics = m('czerny')

      assert.equal(phonetics[0].charAt(0), 'S')
      assert.equal(phonetics[1].charAt(0), 'X')
    }
  )

  assert.equal(
    m('focaccia')[0].charAt(2),
    'X',
    'should transform the C to X, when followed by CIA'
  )

  await t.test(
    'should transform the C to KS, when in an initial ACC, followed by either E, I, or H (but not HU)',
    function () {
      let phonetics = m('accident')

      assert.equal(phonetics[0].charAt(1), 'K')
      assert.equal(phonetics[0].charAt(2), 'S')

      phonetics = m('accede')

      assert.equal(phonetics[0].charAt(1), 'K')
      assert.equal(phonetics[0].charAt(2), 'S')
    }
  )

  await t.test(
    'should transform the C to KS, when in UCCEE or UCCES',
    function () {
      const phonetics = m('succeed')

      assert.equal(phonetics[0].charAt(1), 'K')
      assert.equal(phonetics[0].charAt(2), 'S')
    }
  )

  await t.test(
    'should transform the C to X, when followed by C (but not in an initial MCC), either E, I, or H (but not HU)',
    function () {
      assert.equal(m('bacci')[0].charAt(1), 'X')
      assert.equal(m('bertucci')[0].charAt(3), 'X')
    }
  )

  assert.equal(
    m('hiccups')[0].charAt(1),
    'K',
    'should transform the C to K, when followed by C (but not in an initial MCC)'
  )
  assert.equal(
    m('knack')[0].charAt(1),
    'K',
    'should transform the C to K, when followed by either G, K, or Q'
  )

  await t.test(
    'should transform the C to S and X, when followed by I and either E, or O',
    function () {
      let phonetics = m('ancient')

      assert.equal(phonetics[0].charAt(2), 'S')
      assert.equal(phonetics[1].charAt(2), 'X')

      phonetics = m('delicious')

      assert.equal(phonetics[0].charAt(2), 'S')
      assert.equal(phonetics[1].charAt(2), 'X')
    }
  )

  await t.test(
    'should transform the C to S, when followed by either I, E, or Y',
    function () {
      assert.equal(m('acicula')[0].charAt(1), 'S')
      assert.equal(m('abduce')[0].charAt(3), 'S')
      assert.equal(m('acyl')[0].charAt(1), 'S')
    }
  )

  assert.equal(
    m('Mac Caffrey')[0].charAt(1),
    'K',
    'should transform "C C" to K'
  )
  assert.equal(m('Mac Gregor')[0].charAt(1), 'K', 'should transform "C G" to K')
  assert.equal(
    m('Mac Quillan')[0].charAt(1),
    'K',
    'should transform "C G" to K'
  )
  assert.equal(m('aback')[0].charAt(2), 'K', 'should transform CK to K')
  assert.equal(m('acquit')[0].charAt(1), 'K', 'should transform CQ to K')
  assert.equal(
    m('acclimate')[0].charAt(1),
    'K',
    'should transform CC to K, when not followed by E or I'
  )
  assert.equal(m('edge')[0].charAt(1), 'J', 'should transform DGE to J')
  assert.equal(m('pidgin')[0].charAt(1), 'J', 'should transform DGI to J')
  assert.equal(m('edgy')[0].charAt(1), 'J', 'should transform DGY to J')
  assert.equal(m('Edgar')[0].slice(1, 3), 'TK', 'should transform DG to TK')
  assert.equal(m('width')[0].charAt(1), 'T', 'should transform DT to T')
  assert.equal(m('add')[0].charAt(1), 'T', 'should transform DD to T')
  assert.equal(m('Abduce')[0].charAt(2), 'T', 'should transform D to T')
  assert.equal(m('affect')[0].charAt(1), 'F', 'should transform FF to F')
  assert.equal(m('abaft')[0].charAt(2), 'F', 'should transform F to F')
  assert.equal(
    m('aargh')[0].charAt(2),
    'K',
    'should transform GH to K when preceded by a consonant'
  )
  assert.equal(
    m('ghislane')[0].charAt(0),
    'J',
    'should transform initial GHI to J'
  )
  assert.equal(m('ghoul')[0].charAt(0), 'K', 'should transform initial GH to K')
  assert.equal(m('hugh')[0], 'H', 'should drop GH in B.GH, H.GH, or D.GH')
  assert.equal(m('bough')[0], 'P', 'should drop GH in B..GH, H..GH, or D..GH')
  assert.equal(m('broughton')[0], 'PRTN', 'should drop GH in B...GH or H...GH')
  assert.equal(
    m('laugh')[0],
    'LF',
    'should transform GH to F in C.UGH, G.UGH, L.UGH, R.UGH, assert.UGH'
  )
  assert.equal(
    m('curagh')[0],
    'KRK',
    'should transform GH to K, when preceded by anything other than I'
  )
  assert.equal(m('weight')[0], 'AT', 'should drop GH')

  await t.test(
    'should transform GN to KN and N, when preceded by a vowel and ^, and not Slavo-Germanic',
    function () {
      const phonetics = m('agnize')

      assert.equal(phonetics[0].slice(0, 3), 'AKN')
      assert.equal(phonetics[1].slice(0, 2), 'AN')
    }
  )

  assert.deepEqual(
    m('tagliaro'),
    ['TKLR', 'TLR'],
    'should transform GLI to KL and L'
  )

  await t.test(
    'should transform GN to N and KN, when not followed by EY and Y, and not Slavo-Germanic',
    function () {
      const phonetics = m('acceptingness')

      assert.equal(phonetics[0].slice(-3), 'NNS')
      assert.equal(phonetics[1].slice(-4), 'NKNS')
    }
  )

  assert.equal(m('cagney')[0], 'KKN', 'should transform GN to KN')

  await t.test(
    'should transform an initial GY., GES, GEP, GEB, GEL, GEY, GIB, GIL, GIN, GIE, GEI, and GER to K and J',
    function () {
      const phonetics = m('Gerben')

      assert.equal(phonetics[0].charAt(0), 'K')
      assert.equal(phonetics[1].charAt(0), 'J')
    }
  )

  await t.test(
    'should transform GER to K and J, when not in DANGER, RANGER, and MANGER, and not preceded by E and I',
    function () {
      const phonetics = m('auger')

      assert.equal(phonetics[0].charAt(1), 'K')
      assert.equal(phonetics[1].charAt(1), 'J')
    }
  )

  await t.test(
    'should transform GY to K and J, when not preceded by E, I, R, and O',
    function () {
      const phonetics = m('bulgy')

      assert.equal(phonetics[0].charAt(2), 'K')
      assert.equal(phonetics[1].charAt(2), 'J')
    }
  )

  assert.equal(
    m('altogether')[0].charAt(3),
    'K',
    'should transform the G in GET to K'
  )
  assert.equal(
    m('Van Agema')[0].charAt(2),
    'K',
    'should transform G to K, when Germanic and followed by E, I, or Y'
  )
  assert.equal(
    m('Von Goggin')[0].charAt(3),
    'K',
    'should transform G to K, when Germanic, preceded by A or O, and followed by GI'
  )
  assert.equal(
    m('tangier')[0].charAt(2),
    'J',
    'should transform G to J, when followed by "IER "'
  )

  await t.test(
    'should transform G to J and K, when followed by E, I, or Y, or preceded by A or O and followed by GI',
    function () {
      const phonetics = m('biaggi')

      assert.equal(phonetics[0].charAt(1), 'J')
      assert.equal(phonetics[1].charAt(1), 'K')
    }
  )

  assert.equal(m('GG')[0], 'K', 'should transform GG to K')
  assert.equal(m('G')[0], 'K', 'should transform G to K')
  assert.equal(
    m('ha')[0],
    'H',
    'should keep H when initial and followed by a vowel'
  )
  assert.equal(
    m('aha')[0],
    'AH',
    'should keep H when both followed and preceded by a vowel'
  )
  assert.equal(m('h')[0], '', 'should drop H')
  assert.equal(
    m('San Jacinto')[0].charAt(2),
    'H',
    'should transform J to H when obviously spanish (an initial "SAN ")'
  )
  assert.equal(
    m('Jose')[0].charAt(0),
    'H',
    'should transform J to H in an initial "J... "'
  )

  await t.test('should transform the J to J and H, when in JOSE', function () {
    const phonetics = m('Joseph')

    assert.equal(phonetics[0].charAt(0), 'J')
    assert.equal(phonetics[1].charAt(0), 'H')
  })

  await t.test('should transform the J to J and H, when in JOSE', function () {
    const phonetics = m('Jankelowicz')

    assert.equal(phonetics[0].charAt(0), 'J')
    assert.equal(phonetics[1].charAt(0), 'A')
  })

  await t.test(
    'should transform J to J and H, when preceded by a vowel, followed by A or O, and not Slavo-Germanic',
    function () {
      const phonetics = m('bajador')

      assert.equal(phonetics[0].charAt(1), 'J')
      assert.equal(phonetics[1].charAt(1), 'H')
    }
  )

  await t.test('should both keep and drop a final J', function () {
    const phonetics = m('svaraj')

    assert.equal(phonetics[0], 'SFRJ')
    assert.equal(phonetics[1], 'SFR')
  })

  assert.equal(
    m('abject')[0].charAt(2),
    'J',
    'should keep J when not preceded by S, K, and L, and not followed by L, T, K, S, N, M, B, and Z'
  )
  assert.equal(m('sjji')[0].charAt(0), 'S', 'should drop JJ')
  assert.equal(m('disject')[0], 'TSKT', 'should drop J')
  assert.equal(m('trekker')[0], 'TRKR', 'should transform KK to K')
  assert.equal(m('like')[0], 'LK', 'should keep K')

  await t.test(
    'should both transform LL to L, and drop it, when in a final ILLO, ILLA and ALLE',
    function () {
      assert.deepEqual(m('cabrillo'), ['KPRL', 'KPR'])
      assert.deepEqual(m('villa'), ['FL', 'F'])
      assert.deepEqual(m('crevalle'), ['KRFL', 'KRF'])
    }
  )

  await t.test(
    'should both transform the LL to L, and drop it, in ALLE, when the given value ends in A, O, AS, or OS',
    function () {
      assert.deepEqual(m('allegretto'), ['ALKRT', 'AKRT'])
      assert.deepEqual(m('allegros'), ['ALKRS', 'AKRS'])
    }
  )

  assert.equal(m('ll')[0], 'L', 'should transform LL to L')
  assert.equal(m('l')[0], 'L', 'should keep L')
  assert.equal(m('thumb')[0], '0M', 'should transform a final UMB to M')
  assert.equal(
    m('dumber')[0],
    'TMR',
    'should transform UMB to M when followed by ER'
  )
  assert.equal(m('mm')[0], 'M', 'should transform MM to M')
  assert.equal(m('m')[0], 'M', 'should keep M')
  assert.equal(m('nn')[0], 'N', 'should transform NN to N')
  assert.equal(m('n')[0], 'N', 'should keep N')
  assert.equal(m('Ñ')[0], 'N', 'should transform Ñ to N')
  assert.equal(m('ph')[0], 'F', 'should transform PH to F')
  assert.equal(m('pb')[0], 'P', 'should transform PB to P')
  assert.equal(m('pp')[0], 'P', 'should transform PP to P')
  assert.equal(m('p')[0], 'P', 'should keep P')
  assert.equal(m('qq')[0], 'K', 'should transform QQ to K')
  assert.equal(m('q')[0], 'K', 'should transform Q to K')

  assert.deepEqual(
    m('Xavier'),
    ['SF', 'SFR'],
    'should both drop and keep a final R when preceded by IE, in turn not preceded by ME and MA'
  )

  assert.equal(m('rr')[0], 'R', 'should transform RR to R')
  assert.equal(m('r')[0], 'R', 'should keep R')
  assert.equal(
    m('island')[0],
    'ALNT',
    'should drop S when preceded by I or Y and followed by L'
  )
  assert.equal(
    m('island')[0],
    'ALNT',
    'should drop S when preceded by I or Y and followed by L'
  )

  await t.test(
    'should transform the S to X and S in an initial SUGAR',
    function () {
      const phonetics = m('sugar')

      assert.equal(phonetics[0].charAt(0), 'X')
      assert.equal(phonetics[1].charAt(0), 'S')
    }
  )

  assert.equal(
    m('Sholz')[0].charAt(0),
    'S',
    'should transform the SH to S in SHEIM, SHOEK, SHOLM, SHOLZ'
  )
  assert.equal(m('sh')[0].charAt(0), 'X', 'should transform the SH to X')

  assert.deepEqual(
    m('sio'),
    ['S', 'X'],
    'should transform SIO and SIA to S and X, when not Slavo-Germanic'
  )

  assert.deepEqual(
    m('sioricz'),
    ['SRS', 'SRX'],
    'should transform SIO and SIA to S, when Slavo-Germanic'
  )

  assert.deepEqual(m('sz'), ['S', 'X'], 'should transform SZ to X and S')

  assert.deepEqual(
    m('sl'),
    ['SL', 'XL'],
    'should transform S to X and S when followed by L, M, N, or W'
  )

  assert.deepEqual(
    m('schenker'),
    ['XNKR', 'SKNKR'],
    'should transform SCH to X and SK when followed by ER or EN'
  )

  assert.deepEqual(
    m('schooner'),
    ['SKNR', 'SKNR'],
    'should transform SCH to SK when followed by OO, UY, ED, or EM'
  )

  assert.deepEqual(
    m('schlepp'),
    ['XLP', 'SLP'],
    'should transform SCH to X and S, when initial, and not followed by a non-vowel and W'
  )

  assert.equal(m('borscht')[0], 'PRXT', 'should transform SCH to X')
  assert.equal(m('sci')[0], 'S', 'should transform SCI, SCE, and SCY to S')
  assert.equal(m('scu')[0], 'SK', 'should transform SC. to SK')

  assert.deepEqual(
    m('ois'),
    ['A', 'AS'],
    'should drop and keep S, when final and preceded by AI or OI'
  )

  assert.equal(m('ss')[0], 'S', 'should transform SS to S')
  assert.equal(m('s')[0], 'S', 'should keep S')
  assert.equal(
    m('tion')[0],
    'XN',
    'should transform TIO to X, when followed by N'
  )
  assert.equal(m('tia')[0], 'X', 'should transform TIA and TCH to X')
  assert.equal(m('tch')[0], 'X', 'should transform TIA and TCH to X')
  assert.equal(
    m('thom')[0],
    'TM',
    'should transform TH to T, when followed by OM or AM (1)'
  )
  assert.equal(
    m('tham')[0],
    'TM',
    'should transform TH to T, when followed by OM or AM (2)'
  )
  assert.equal(
    m('Von Goethals')[0].charAt(3),
    'T',
    'should transform TH to T, when Germanic'
  )
  assert.equal(
    m('Von Matthes')[0].charAt(3),
    'T',
    'should transform TT to T, when Germanic and followed by H'
  )

  assert.deepEqual(m('th'), ['0', 'T'], 'should transform TH to 0 and T')

  assert.equal(m('tt')[0], 'T', 'should transform TT to T')
  assert.equal(m('td')[0], 'T', 'should transform TD to T')
  assert.equal(m('t')[0], 'T', 'should keep T')
  assert.equal(m('vv')[0], 'F', 'should transform VV to F')
  assert.equal(m('v')[0], 'F', 'should transform V to F')
  assert.equal(m('awr')[0], 'AR', 'should transform WR to R')

  assert.deepEqual(
    m('wa'),
    ['A', 'F'],
    'should transform W to A and F, when initial and followed by a vowel'
  )

  assert.equal(
    m('wh')[0],
    'A',
    'should transform W to A, when initial and followed by H'
  )

  await t.test(
    'should both drop and transform W to F, when in EWSKI, EWSKY, OWSKI, or OWSKY',
    function () {
      assert.deepEqual(m('Tsjaikowski'), ['TSKSK', 'TSKFSK'])
      assert.deepEqual(m('Tsjaikowsky'), ['TSKSK', 'TSKFSK'])
    }
  )

  assert.deepEqual(
    m('schwa'),
    ['X', 'XF'],
    'should both drop and transform W to F, when the value starts with SCH'
  )

  assert.deepEqual(
    m('Arnow'),
    ['ARN', 'ARNF'],
    'should both drop and transform W to F, when final and preceded by a vowel'
  )

  await t.test(
    'should transform W to TS and FX, when followed by ICZ or ITZ',
    function () {
      assert.deepEqual(m('Filipowicz'), ['FLPTS', 'FLPFX'])
      assert.deepEqual(m('Filipowitz'), ['FLPTS', 'FLPFX'])
    }
  )

  assert.equal(m('w')[0], '', 'should drop W')
  assert.equal(m('matrix')[0], 'MTRKS', 'should transform X to KS, when final')

  await t.test(
    'should transform X to KS, when *NOT* preceded by IAU, EAU, AU, or OU',
    function () {
      assert.equal(m('iauxa')[0], 'AKS')
      assert.equal(m('eauxa')[0], 'AKS')
      assert.equal(m('auxa')[0], 'AKS')
      assert.equal(m('ouxa')[0], 'AKS')
    }
  )

  assert.equal(m('AUX')[0], 'A', 'should drop `UX` in `AUX`')
  assert.equal(m('OUX')[0], 'A', 'should drop `UX` in `OUX`')
  assert.equal(m('breaux')[0], 'PR', 'should drop `aux` in `breaux`')

  assert.equal(m('AXC')[0], 'AKS', 'should *not* drop XC')
  assert.equal(m('axx')[0], 'AKS', 'should *not* drop XX')
  assert.equal(m('axe')[0], 'AKS', 'should *not* drop X')
  assert.equal(m('zhao')[0], 'J', 'should transform ZH to J')

  await t.test(
    'should transform Z to S and TS, when followed by ZA, ZI, or ZO',
    function () {
      assert.deepEqual(m('zza'), ['S', 'TS'])
      assert.deepEqual(m('zzi'), ['S', 'TS'])
      assert.deepEqual(m('zzo'), ['S', 'TS'])
    }
  )

  assert.deepEqual(
    m('Mazurkiewicz'),
    ['MSRKTS', 'MTSRKFX'],
    'should transform Z to S and TS, when not initial, not Slavo-Germanic, and not preceded by T'
  )

  assert.equal(m('zz')[0], 'S', 'should transform ZZ to S')
  assert.equal(m('z')[0], 'S', 'should transform Z to S')
})

test('cli', async function () {
  assert.deepEqual(
    await exec('./cli.js michael'),
    {stdout: 'MKL\tMXL\n', stderr: ''},
    'one'
  )

  assert.deepEqual(
    await exec('./cli.js detestable vileness'),
    {stdout: 'TTSTPL\tTTSTPL FLNS\tFLNS\n', stderr: ''},
    'two'
  )

  await new Promise(function (resolve) {
    const input = new PassThrough()
    const subprocess = cp.exec('./cli.js', function (error, stdout, stderr) {
      assert.deepEqual(
        [error, stdout, stderr],
        [null, 'TTSTPL\tTTSTPL FLNS\tFLNS\n', ''],
        'stdin'
      )
    })
    assert(subprocess.stdin, 'expected stdin on `subprocess`')
    input.pipe(subprocess.stdin)
    input.write('detestable')
    setImmediate(function () {
      input.end(' vileness')
      setImmediate(resolve)
    })
  })

  const h = await exec('./cli.js -h')

  assert.ok(/\sUsage: double-metaphone/.test(h.stdout), '-h')

  const help = await exec('./cli.js --help')

  assert.ok(/\sUsage: double-metaphone/.test(help.stdout), '-h')

  assert.deepEqual(
    await exec('./cli.js -v'),
    {stdout: pack.version + '\n', stderr: ''},
    '-v'
  )

  assert.deepEqual(
    await exec('./cli.js --version'),
    {stdout: pack.version + '\n', stderr: ''},
    '--version'
  )
})
