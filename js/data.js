'use strict';
/* ================= storage ================= */
var KEY = 'kidslearn.v1';
function loadLS(k, fb) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
var state = loadLS(KEY, null);
var setupSel = { theme: (state && state.theme) || 'bear', name: (state && state.name) || '', char: (state && state.charName) || '', kg: (state && state.kg) || 'kg1' };

/* ================= themes: Kenney animal characters (CC0) ================= */
var THEMES = {
    monster_blue: { ar: 'فزفز', en: 'Fuzzy', charDef: 'Fuzzy', img: 'monsters/blue_stand.png', imgCheer: 'monsters/blue_cheer.png', fx: 50, fy: 33, fr: 36 },
    monster_green: { ar: 'طقطق', en: 'Blinky', charDef: 'Blinky', img: 'monsters/green_stand.png', imgCheer: 'monsters/green_cheer.png', fx: 50, fy: 46, fr: 56 },
    hero: { ar: 'بطل', en: 'Hero', charDef: 'Captain Star', img: 'monsters/hero_stand.png', imgCheer: 'monsters/hero_cheer.png', fx: 50, fy: 30, fr: 40 },
    caped: { ar: 'فارس الليل', en: 'Night Hero', charDef: 'Luna', img: 'monsters/caped_stand.png', imgCheer: 'monsters/caped_cheer.png', fx: 50, fy: 30, fr: 40 },
    princess: { ar: 'أميرة', en: 'Princess', charDef: 'Princess', img: 'monsters/princess_stand.png', imgCheer: 'monsters/princess_cheer.png', fx: 50, fy: 24, fr: 30 },
    fairy: { ar: 'جنية', en: 'Fairy', charDef: 'Fairy', img: 'monsters/fairy_stand.png', imgCheer: 'monsters/fairy_cheer.png', fx: 50, fy: 26, fr: 30 },
    bear: { ar: 'دب', en: 'Bear', charDef: 'Teddy', img: 'animals/bear.png', fx: 50, fy: 50, fr: 62 },
    panda: { ar: 'باندا', en: 'Panda', charDef: 'Panda', img: 'animals/panda.png', fx: 50, fy: 48, fr: 64 },
    rabbit: { ar: 'أرنب', en: 'Rabbit', charDef: 'Bunny', img: 'animals/rabbit.png', fx: 50, fy: 38, fr: 56 },
    dog: { ar: 'كلب', en: 'Dog', charDef: 'Puppy', img: 'animals/dog.png', fx: 50, fy: 46, fr: 60 },
    duck: { ar: 'بطة', en: 'Duck', charDef: 'Ducky', img: 'animals/duck.png', fx: 50, fy: 50, fr: 62 },
    monkey: { ar: 'قرد', en: 'Monkey', charDef: 'Monkey', img: 'animals/monkey.png', fx: 50, fy: 52, fr: 60 }
};
if (state && !THEMES[state.theme]) state.theme = 'bear';
if (!THEMES[setupSel.theme]) setupSel.theme = 'bear';
function theme() { return THEMES[(state && state.theme)] || THEMES.bear; }
function kidName() { return (state && state.name) || 'friend'; }
function charName() { return (state && state.charName) || theme().charDef; }
function save() { saveLS(KEY, state); }

/* ================= KG curriculum (words map to bundled Kenney art) ================= */
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var WIMG = {
    dog: 'animals/dog.png', sun: 'bg/sun.png', owl: 'animals/owl.png', fish: 'food/fish.png',
    cake: 'food/cake.png', duck: 'animals/duck.png', frog: 'animals/frog.png', star: 'tiles/star.png',
    bear: 'animals/bear.png', tree: 'bg/tree.png', panda: 'animals/panda.png', rabbit: 'animals/rabbit.png',
    monkey: 'animals/monkey.png', donut: 'food/donut1.png', heart: 'tiles/heart.png',
    cloud: 'bg/cloud1.png', carrot: 'food/carrot.png'
};
var WORDS1 = ['dog', 'sun', 'owl', 'fish', 'cake', 'duck', 'frog', 'star', 'bear', 'tree'];
var WORDS2 = ['panda', 'rabbit', 'monkey', 'donut', 'heart', 'cloud', 'carrot'];
var WORDS3 = ['monkey', 'rabbit', 'carrot', 'donut', 'panda'];
var ALLWORDS = WORDS1.concat(WORDS2, WORDS3);
var SIGHT = ['the', 'and', 'you', 'is', 'it', 'in', 'on', 'we', 'he', 'she', 'my', 'to', 'go', 'up', 'at', 'am', 'can', 'see', 'like', 'play'];
var SOUNDS = { A: 'ah', B: 'buh', C: 'kuh', D: 'duh', E: 'eh', F: 'fff', G: 'guh', H: 'huh', I: 'ih', J: 'juh', K: 'kuh', L: 'lll', M: 'mmm', N: 'nnn', O: 'oh', P: 'puh', Q: 'kwuh', R: 'rrr', S: 'sss', T: 'tuh', U: 'uh', V: 'vvv', W: 'wuh', X: 'ks', Y: 'yuh', Z: 'zzz' };
var SHAPES = ['circle', 'square', 'diamond', 'star', 'heart'];
var SHAPEBODIES = ['circle', 'square', 'diamond'];
var SORTCOLORS = [['red', 0xef4444], ['blue', 0x3b82f6], ['green', 0x22c55e], ['pink', 0xf472b6]];
var CNTIMG = ['food/donut1.png', 'food/carrot.png', 'food/fish.png', 'food/cake.png', 'food/donut2.png', 'tiles/star.png', 'tiles/heart.png'];
var NUMWORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

function rnd(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[rnd(arr.length)]; }
function shuffle(a) { var x = a.slice(); for (var i = x.length - 1; i > 0; i--) { var j = rnd(i + 1); var t = x[i]; x[i] = x[j]; x[j] = t; } return x; }
function sample(arr, n, excl) { return shuffle(arr.filter(function (x) { return excl.indexOf(x) < 0; })).slice(0, n); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function shapeKey(shape, color) {
    if (shape === 'star') return 'tile_star';
    if (shape === 'heart') return 'tile_heart';
    var f = { circle: 'circle', square: 'square', diamond: 'rhombus' }[shape] || 'circle';
    var c = SORTCOLORS.some(function (x) { return x[0] === color; }) ? color : 'red';
    return 'shape_' + c + '_' + f;
}


/* ================= school phonics sequence (KG1 -> Grade 1) ================= */
var KGS = ['kg1', 'kg2', 'g1'];
var KG_LABEL = { kg1: 'KG1', kg2: 'KG2', g1: 'G1' };
var PHON = {
    kg1: ['s a t p i n', 'm d g o c k', 'e u r h b', 'f l j v w x', 'y z qu'],
    kg2: ['ck ff ll ss zz', 'sh ch th ng', 'ai ee igh oa', 'oo ar or ur', 'ow oi ear er'],
    g1: ['a_e i_e o_e u_e', 'ay ea', 'er ir ur', 'ow oy aw', 'ing ed']
};
/* graphemes unlocked at (kg, lvl): all groups of previous stages + groups 1..lvl of this stage */
function unlockedPhon(kg, lvl) {
    var out = [];
    for (var s = 0; s < KGS.length; s++) {
        var st = KGS[s], gs = PHON[st];
        if (KGS.indexOf(kg) > s) { gs.forEach(function (g) { out = out.concat(g.split(' ')); }); }
        else if (st === kg) {
            for (var i = 0; i < Math.min(lvl, gs.length); i++) out = out.concat(gs[i].split(' '));
            break;
        }
    }
    return out;
}
/* grapheme splitter (longest match; magic-e handled as vowel_e) */
var GRAPHS = ['igh', 'ear', 'a_e', 'i_e', 'o_e', 'u_e', 'ing', 'qu', 'ck', 'ff', 'll', 'ss', 'zz', 'sh', 'ch', 'th', 'ng', 'ai', 'ee', 'oa', 'oo', 'ar', 'or', 'ur', 'ow', 'oi', 'er', 'ay', 'ea', 'oy', 'aw', 'ed', 'ir'];
function graphemesOf(w) {
    /* magic-e: vowel + single consonant + final e (cake -> c a_e k) */
    var me = w.match(/^(.+?)([aeiou])([^aeiou])e$/);
    if (me && w.length >= 4 && ['a', 'i', 'o', 'u'].indexOf(me[2]) >= 0) {
        var g2 = graphemesOf(me[1]);
        g2.push(me[2] + '_e');
        var rest = graphemesOf(me[3]);
        return g2.concat(rest);
    }
    var g = [], i = 0;
    while (i < w.length) {
        var hit = null;
        for (var j = 0; j < GRAPHS.length; j++) {
            var d = GRAPHS[j];
            if (d.indexOf('_') < 0 && w.substr(i, d.length) === d) { hit = d; break; }
        }
        if (hit) { g.push(hit); i += hit.length; }
        else { g.push(w[i]); i++; }
    }
    return g;
}
function phKey(g) { return 'ph_' + g.toLowerCase(); }
function phDisp(g) { return g.replace('_', '-'); }
/* decodable words grouped per phonics group (parallel to PHON) */
var DECOD = {
    kg1: [
        'sat sit pin pat tap nap tin pan tip pit sip tan ant',
        'mat map man mad sad can cat cap dog dig pig kid kit big',
        'pen ten hen bed red wet run sun bun cup cut bus rug hug hat hot hop bat bit but',
        'fox box six van vet jam jet jug win web fun fan fat fit log lot lip leg',
        'yes yet zip zap yum yak quiz quit'
    ],
    kg2: [
        'duck sock rock kick lick sick pick pack back neck bell sell tell hill fill kiss miss',
        'ship shop fish dish cash rush chop chat chin rich much bath math path sing ring king long song thing',
        'rain tail pail wait see bee tree feet seed night light right boat coat goat road',
        'moon zoo food boot car star far jar corn turn',
        'cow how now owl oil coin boil ear hear dear her'
    ],
    g1: [
        'cake make name late five like time bike nine home nose note cube cute',
        'day play say train read leaf soap snow slow',
        'hard park barn fork storm bird girl shirt burn',
        'down town toy boy saw paw',
        'cats dogs runs jumps jumped playing singing'
    ]
};
function decodablePool(kg, lvl) {
    var out = [];
    for (var s = 0; s < KGS.length; s++) {
        var st = KGS[s], gs = DECOD[st];
        if (KGS.indexOf(kg) > s) { gs.forEach(function (g) { out = out.concat(g.split(' ')); }); }
        else if (st === kg) {
            for (var i = 0; i < Math.min(lvl, gs.length); i++) out = out.concat(gs[i].split(' '));
            break;
        }
    }
    return out;
}
/* sight words by stage */
var SIGHT2 = 'said was are they all for his but that with had her what there out this have went some so'.split(' ');
var SIGHT3 = 'after again an any as ask by could every fly from give going has him how just know let live may of old once open over put round stop take thank them then think walk were when'.split(' ');
function sightPool(kg) {
    if (kg === 'g1') return SIGHT.concat(SIGHT2, SIGHT3);
    if (kg === 'kg2') return SIGHT.concat(SIGHT2);
    return SIGHT;
}

/* ================= game registry (meta; scenes attach .scene) ================= */
var GAMES = {
    letters: { ico: 'bubble', icos: .55, icoTint: 0xff9ecb, em: '🫧', title: 'Letter Bubbles', sub: 'Pop the sounds!', scene: 'g_letters', kg: { kg1: 'الحروف الكبيرة ثم أصواتها بترتيب المنهج (ساتبين)', kg2: 'المركبات الصوتية sh ch th ng والقصور الطويلة ai ee igh oa', g1: 'الحروف الساكنة السحرية a-e i-e o-e u-e واللواحق ing ed' } },
    words: { ico: 'food_fish', icos: .9, em: '🍎', title: 'Feed the Buddy', sub: 'Yummy words!', scene: 'g_feed', kg: { kg1: 'كلمات بسيطة مع صورها', kg2: 'قراءة بالتقطيع الصوتي + كلمات النظر', g1: 'كلمات نظر أطول + قراءة أسرع' } },
    spelling: { ico: 'tile_A', icos: .48, em: '🚂', title: 'Word Train', sub: 'Build the word', scene: 'g_train', kg: { kg1: 'تهجي كلمات CVC بالأصوات', kg2: 'كلمات بالمركبات الصوتية', g1: 'كلمات بالحروف الطويلة واللواحق' } },
    counting: { ico: 'food_carrot', icos: .62, em: '🧺', title: 'Picnic Count', sub: 'Feed me 4!', scene: 'g_count', kg: { kg1: 'العد حتى ١٠ + أكتر/أقل', kg2: 'العد حتى ٢٠ + أكتر/أقل', g1: 'العد حتى ٣٠ بالعشرات + أكتر/أقل' } },
    math: { ico: 'ship_red', icos: .6, em: '🚀', title: 'Rocket Math', sub: 'Launch the answer', scene: 'g_rocket', kg: { kg1: 'جمع وطرح في حدود ٥', kg2: 'تكوين العشرة + جمع وطرح حتى ٢٠', g1: 'جمع وطرح حتى ٢٠ والعشرات الكاملة' } },
    shapes: { ico: 'shape_red_circle', icos: .5, em: '🧩', title: 'Shape Sorter', sub: 'Sort the shapes', scene: 'g_sort', kg: { kg1: 'أسماء الأشكال والألوان', kg2: 'تمييز الشكل واللون مع بعض', g1: 'تمييز الشكل واللون مع بعض' } },
    pattern: { ico: 'tile_heart', icos: .5, em: '🎨', title: 'Pattern Train', sub: 'What comes next?', scene: 'g_pattern', kg: { kg1: 'أنماط بسيطة AB بالألوان', kg2: 'أنماط ABB و ABC + أنماط الأعداد', g1: 'العد القفزي ٢ و ٥ و ١٠' } }
};
