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

/* ================= game registry (meta; scenes attach .scene) ================= */
var GAMES = {
    letters: { ico: 'bubble', icos: .55, icoTint: 0xff9ecb, em: '🫧', title: 'Letter Bubbles', sub: 'Pop the letter!', scene: 'g_letters', kg: { kg1: 'التعرف على الحروف الكبيرة A-Z (فقع الفقاعات)', kg2: 'الحروف الصغيرة + أصوات الحروف (فونكس)' } },
    words: { ico: 'food_fish', icos: .9, em: '🍎', title: 'Feed the Bear', sub: 'Yummy words!', scene: 'g_feed', kg: { kg1: 'كلمات بسيطة مع صورها (إطعام الدب)', kg2: 'كلمات النظر الشائعة (sight words) + كلمات أطول' } },
    spelling: { ico: 'tile_A', icos: .48, em: '🚂', title: 'Word Train', sub: 'Build the word', scene: 'g_train', kg: { kg1: 'تهجي كلمات بسيطة (٣-٤ حروف) مع قطار الكلمات', kg2: 'تهجي كلمات من ٤-٦ حروف' } },
    counting: { ico: 'food_carrot', icos: .62, em: '🧺', title: 'Picnic Count', sub: 'Feed me 4!', scene: 'g_count', kg: { kg1: 'العد حتى ١٠ (إطعام بالعد)', kg2: 'العد حتى ٢٠' } },
    math: { ico: 'ship_red', icos: .6, em: '🚀', title: 'Rocket Math', sub: 'Launch the answer', scene: 'g_rocket', kg: { kg1: 'جمع وطرح في حدود ٥ (صواريخ)', kg2: 'جمع وطرح في حدود ٢٠' } },
    shapes: { ico: 'shape_red_circle', icos: .5, em: '🧩', title: 'Shape Sorter', sub: 'Sort the shapes', scene: 'g_sort', kg: { kg1: 'أسماء الأشكال والألوان (ترتيب الأشكال)', kg2: 'تمييز الشكل واللون مع بعض' } }
};
