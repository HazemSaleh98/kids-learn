'use strict';
/* ================= round generators (KG curriculum, auto-leveling) ================= */
GAMES.letters.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    var groups = PHON[kg];
    var gi = Math.min(lvl, groups.length) - 1;
    var current = groups[gi].split(' ');
    var unlocked = unlockedPhon(kg, lvl);
    var target = pick(current);
    var mode = (kg === 'kg1' && lvl <= 2) ? 'upper' : 'phonics';
    var disp = mode === 'upper' ? target.toUpperCase() : phDisp(target);
    var others = sample(unlocked, 8, [target]);
    var chars = shuffle([disp, disp, disp].concat(others.slice(0, 6).map(function (g) {
        return mode === 'upper' ? g.toUpperCase() : phDisp(g);
    })));
    var instr = mode === 'upper' ? 'Pop every ' + disp + ' bubble!' : 'Pop the sound "' + phDisp(target) + '"!';
    var keys = mode === 'upper'
        ? ['instr_letters_1', 'letter_' + target.toLowerCase(), 'instr_letters_2']
        : ['instr_letters_phonics', phKey(target)];
    return { mode: mode, target: disp, chars: chars, hits: 0, need: 3, instr: instr, keys: keys };
};
GAMES.words.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    /* sight-word reading at the top of each stage */
    if ((kg === 'kg2' && lvl >= 4) || (kg === 'g1' && lvl >= 3)) {
        var poolS = sightPool(kg);
        var ansS = pick(poolS);
        var optsS = shuffle([ansS].concat(sample(poolS, 3, [ansS])));
        return { mode: 'read', word: ansS, options: optsS, instr: 'Give me the word "' + ansS + '"!', keys: ['instr_feed_1', 'sight_' + ansS], answer: ansS };
    }
    /* blend-to-feed: hear the sounds, pick the picture */
    if (kg !== 'kg1' || lvl >= 4) {
        var ansB = pick(ALLWORDS);
        var othersB = sample(ALLWORDS, 3, [ansB]);
        var gs = graphemesOf(ansB);
        var keysB = ['instr_blend_1'].concat(gs.map(phKey)).concat(['instr_blend_2']);
        return { mode: 'pic', word: ansB, options: shuffle([ansB].concat(othersB)), instr: 'Sound it out and feed me!', keys: keysB, answer: ansB };
    }
    var pool = lvl < 2 ? WORDS1 : WORDS1.concat(WORDS2);
    var ans = pick(pool);
    var opts = shuffle([ans].concat(sample(pool, 3, [ans])));
    return { mode: 'pic', word: ans, options: opts, instr: 'Give me the ' + ans + '!', keys: ['instr_feed_1', 'word_' + ans], answer: ans };
};
GAMES.spelling.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    var pool = decodablePool(kg, lvl);
    var ans = pick(pool);
    var gs = graphemesOf(ans);
    return { word: ans, graphs: gs, tiles: shuffle(gs.map(function (g, i) { return { g: g, id: i }; })),
        instr: 'Build the word! Tap the sounds!', keys: ['instr_train_1'], answer: ans };
};
GAMES.counting.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    /* more / less rounds from L3 */
    if (lvl >= 3 && rnd(2) === 0) {
        var hi = kg === 'g1' ? 20 : 10;
        var a = 1 + rnd(hi), b = 1 + rnd(hi);
        while (b === a) b = 1 + rnd(hi);
        var askMore = rnd(2) === 0;
        return { mode: 'more', a: a, b: b, askMore: askMore, img: pick(CNTIMG),
            instr: askMore ? 'Which plate has MORE?' : 'Which plate has LESS?',
            keys: [askMore ? 'instr_more_1' : 'instr_less_1'],
            answer: askMore ? Math.max(a, b) : Math.min(a, b) };
    }
    var max = kg === 'g1' ? (lvl < 3 ? 20 : 30) : kg === 'kg2' ? (lvl < 2 ? 10 : lvl < 4 ? 15 : 20) : (lvl < 2 ? 5 : 10);
    var n = 1 + rnd(max);
    var img = pick(CNTIMG);
    var extra = Math.min(4, Math.ceil(n / 3));
    return { mode: 'count', n: n, img: img, total: n + extra, got: 0,
        instr: 'Give me ' + n + ' ' + (n === 1 ? 'piece' : 'pieces') + '!',
        keys: ['instr_count_1', 'num_' + n, 'instr_count_2'], answer: n };
};
GAMES.math.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    /* number bonds to 10 (kg2 L2+) */
    if ((kg === 'kg2' && lvl === 2) || (kg === 'g1' && lvl === 1)) {
        var ba = 1 + rnd(9), bb = 10 - ba;
        var bopts = {}; bopts[bb] = 1;
        while (Object.keys(bopts).length < 4) bopts[Math.max(0, bb + rnd(7) - 3)] = 1;
        return { eq: ba + ' + ? = 10', options: shuffle(Object.keys(bopts)), ships: shuffle(['red', 'green', 'blue', 'orange']),
            instr: 'Make ten! What is missing?',
            keys: ['instr_bonds_1', 'num_' + ba], answer: String(bb) };
    }
    var max = kg === 'g1' ? (lvl < 4 ? 20 : 50) : kg === 'kg2' ? (lvl < 2 ? 10 : 20) : 5;
    var a = 1 + rnd(max), b = 1 + rnd(max), op = pick(['+', '-']);
    if (kg === 'g1' && lvl >= 4) { a = (1 + rnd(9)) * 10; b = (1 + rnd(9)) * 10; } /* tens */
    if (op === '-' && b > a) { var t = a; a = b; b = t; }
    var ans = op === '+' ? a + b : a - b;
    var opts = {}; opts[ans] = 1;
    var spread = kg === 'g1' && lvl >= 4 ? 30 : 7;
    while (Object.keys(opts).length < 4) opts[Math.max(0, ans + rnd(spread) - Math.floor(spread / 2))] = 1;
    return { eq: a + ' ' + op + ' ' + b + ' = ?', options: shuffle(Object.keys(opts)),
        ships: shuffle(['red', 'green', 'blue', 'orange']),
        instr: 'Launch the right rocket!',
        keys: ['instr_math_1', 'num_' + a, op === '+' ? 'instr_math_plus' : 'instr_math_minus', 'num_' + b, 'instr_math_2'],
        answer: String(ans) };
};
GAMES.shapes.gen = function (lvl, kg) {
    var mode = kg === 'kg2' ? (lvl < 3 ? 'color' : 'combo') : (lvl < 3 ? 'shape' : 'color');
    var n = 3, holes = [], pieces = [], i;
    if (mode === 'combo') {
        var cs = shuffle(SORTCOLORS).slice(0, n), ss = shuffle(SHAPEBODIES).slice(0, n);
        for (i = 0; i < n; i++) {
            holes.push({ key: cs[i][0] + '-' + ss[i], shape: ss[i], color: cs[i][0] });
            pieces.push({ key: cs[i][0] + '-' + ss[i], shape: ss[i], color: cs[i][0] });
        }
    } else if (mode === 'color') {
        var cs2 = shuffle(SORTCOLORS).slice(0, n), shp = pick(SHAPEBODIES);
        for (i = 0; i < n; i++) {
            holes.push({ key: cs2[i][0], shape: shp, color: cs2[i][0] });
            pieces.push({ key: cs2[i][0], shape: shp, color: cs2[i][0] });
        }
    } else {
        var ss2 = shuffle(SHAPES).slice(0, n), col = pick(SORTCOLORS);
        for (i = 0; i < n; i++) {
            holes.push({ key: ss2[i], shape: ss2[i], color: col[0] });
            pieces.push({ key: ss2[i], shape: ss2[i], color: col[0] });
        }
    }
    var txt = { shape: 'Sort the shapes! Put every shape in its home!', color: 'Sort by color!', combo: 'Match the shape AND the color!' };
    return { mode: mode, holes: holes, pieces: shuffle(pieces), instr: txt[mode], keys: ['instr_sort_' + mode], answer: 'all' };
};
GAMES.pattern = GAMES.pattern || {};
GAMES.pattern.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    /* number patterns (skip counting) for g1, shape/color patterns for kg */
    if (kg === 'g1' || (kg === 'kg2' && lvl >= 4)) {
        var step = kg === 'g1' ? pick([2, 5, 10]) : pick([1, 2]);
        var start = 1 + rnd(4) * step;
        var seq = [];
        for (var i = 0; i < 5; i++) seq.push(start + i * step);
        var missAt = 3 + rnd(2);
        var ansN = seq[missAt];
        var optsN = {}; optsN[ansN] = 1;
        while (Object.keys(optsN).length < 3) optsN[Math.max(1, ansN + (rnd(3) - 1) * step)] = 1;
        return { mode: 'num', seq: seq, missAt: missAt, options: shuffle(Object.keys(optsN)),
            instr: 'What number comes next?', keys: ['instr_skip_1'], answer: String(ansN) };
    }
    var kinds = kg === 'kg2' && lvl >= 2 ? ['ABB', 'ABC', 'AB'] : ['AB'];
    var kind = kinds[Math.min(lvl - 1, kinds.length - 1)];
    var cols = shuffle(SORTCOLORS).slice(0, kind === 'AB' ? 2 : 3);
    var shp = pick(SHAPEBODIES);
    var unit = kind === 'AB' ? [cols[0][0], cols[1][0]] : kind === 'ABB' ? [cols[0][0], cols[1][0], cols[1][0]] : [cols[0][0], cols[1][0], cols[2][0]];
    var seqS = [];
    while (seqS.length < 6) unit.forEach(function (c) { if (seqS.length < 6) seqS.push(c); });
    var ansS = seqS[5];
    var optNames = cols.map(function (c) { return c[0]; });
    var extras = SORTCOLORS.filter(function (c) { return optNames.indexOf(c[0]) < 0; });
    while (optNames.length < 3 && extras.length) optNames.push(extras.shift()[0]);
    return { mode: 'shape', seq: seqS.slice(0, 5), shape: shp, options: shuffle(optNames),
        instr: 'What comes next?', keys: [rnd(2) ? 'instr_pattern_1' : 'instr_pattern_2'], answer: ansS };
};
GAMES.memory = GAMES.memory || {};
GAMES.memory.gen = function (lvl, kg) {
    kg = kg || 'kg1';
    var picPool = ALLWORDS.filter(function (w) { return !!WIMG[w]; });
    var n = lvl >= 3 ? 8 : 6;
    if (lvl >= 2) {
        /* letter -> picture: distinct initial letters only, no ambiguity */
        var used = {}, wsL = [];
        shuffle(picPool.slice()).forEach(function (w) {
            var L0 = w[0].toUpperCase();
            if (!used[L0] && wsL.length < n) { used[L0] = 1; wsL.push(w); }
        });
        return { mode: 'letter', words: wsL, instr: 'Match every letter with its picture!', keys: ['instr_memory_letter'], answer: 'all' };
    }
    var ws = sample(picPool, n, []);
    return { mode: 'pic', words: ws, instr: 'Find all the matching pairs!', keys: ['instr_memory_pic'], answer: 'all' };
};
function cntKey(path) {
    var f = path.replace(/\.png$/, '');
    if (f.indexOf('food/') === 0) return 'food_' + f.slice(5);
    if (f.indexOf('tiles/') === 0) return 'tile_' + f.slice(6);
    return f.replace('/', '_');
}

/* ================= shared game scene base ================= */
class GameBase extends Phaser.Scene {
    constructor(key, gameId) { super(key); this.gameId = gameId; }
    create() {
        var s = this;
        this.roundLock = false;
        this.roundObjs = [];
        /* world */
        var bg = this.add.image(W / 2, H / 2, 'bg_grass');
        bg.setScale(Math.max(W / bg.width, H / bg.height) * 1.02);
        addCloud(this, 'cloud3', 210, 62000, .4);
        addCloud(this, 'cloud4', 300, 52000, .34, -20000).setAlpha(.7);
        /* header */
        var backG = this.add.graphics();
        backG.fillStyle(0xffffff, .95).fillRoundedRect(14, 14, 48, 48, 16);
        backG.fillStyle(0x3b2a5e, 1);
        backG.fillTriangle(38, 26, 38, 50, 22, 38);
        var back = this.add.zone(14, 14, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
        back.on('pointerdown', function () { VO.stop(); s.scene.start('home'); });
        var pill = this.add.graphics();
        pill.fillStyle(0xffb03d, 1).fillRoundedRect(W - 106, 16, 92, 44, 22);
        this.add.image(W - 84, 38, 'tile_star').setScale(.24);
        this.starTxt = this.add.text(W - 66, 38, String((state && state.stars) || 0), { fontSize: '22px', fontStyle: '900', color: '#4a2c00' }).setOrigin(0, .5);
        /* prompt bar */
        var pr = this.add.graphics();
        pr.fillStyle(0xffffff, .96).fillRoundedRect(20, 78, W - 40, 62, 20);
        pr.lineStyle(3, 0xffd93d, 1).strokeRoundedRect(20, 78, W - 40, 62, 20);
        this.promptTxt = this.add.text(W / 2 - 16, 109, '', { fontSize: '19px', fontStyle: '900', color: '#3b2a5e', align: 'center', wordWrap: { width: W - 130 } }).setOrigin(.5);
        this.sayBtn = this.add.text(W - 48, 109, '🔊', { fontSize: '24px' }).setOrigin(.5).setInteractive({ useHandCursor: true });
        this.sayBtn.on('pointerdown', function () { s.sayRound(); });
        this.newRound();
    }
    lvl() { return (state.levels && state.levels[this.gameId]) || 1; }
    track(o) { this.roundObjs.push(o); return o; }
    addPlayBuddy(x, y, size) {
        var pb = makePlayBuddy(this, x, y, size || 92);
        if (pb) { this.playBuddy = pb; this.track(pb.c); }
        return pb;
    }
    newRound() {
        this.cur = GAMES[this.gameId].gen(this.lvl(), (state && state.kg) || 'kg1');
        this.promptTxt.setText(this.cur.instr);
        this.buildRound(this.cur);
        this.sayRound();
    }
    sayRound() { if (this.cur && this.cur.keys && !(state && state.muted)) VO.say.apply(VO, this.cur.keys); }
    clearRound() {
        this.roundObjs.forEach(function (o) { if (o && o.destroy) o.destroy(); });
        this.roundObjs = [];
    }
    levelUpMaybe(correct) {
        var id = this.gameId, leveled = false;
        if (!state.levels) state.levels = {};
        if (!state.streaks) state.streaks = {};
        if (correct) {
            state.streaks[id] = (state.streaks[id] || 0) + 1;
            if (state.streaks[id] >= 3 && (state.levels[id] || 1) < 5) {
                state.levels[id] = (state.levels[id] || 1) + 1;
                state.streaks[id] = 0; leveled = true;
            }
        } else state.streaks[id] = 0;
        return leveled;
    }
    win() {
        if (this.roundLock) return;
        this.roundLock = true;
        var s = this;
        state.stars = (state.stars || 0) + 1;
        var leveled = this.levelUpMaybe(true);
        save();
        this.starTxt.setText(String(state.stars));
        this.tweens.add({ targets: this.starTxt, scaleX: 1.6, scaleY: 1.6, duration: 160, yoyo: true });
        /* star burst + confetti */
        var burst = this.add.particles(W / 2, H / 2 - 60, 'tile_star', {
            speed: { min: 160, max: 420 }, angle: { min: 0, max: 360 },
            scale: { start: .3, end: 0 }, lifespan: 900, gravityY: 300, emitting: false
        });
        burst.explode(14);
        SFX.play('sparkle'); SFX.play('cheer');
        var conf = this.add.particles(0, -10, 'conf', {
            x: { min: 0, max: W }, speedY: { min: 120, max: 300 }, speedX: { min: -60, max: 60 },
            scale: { min: .5, max: 1.1 }, lifespan: 2200, rotate: { min: 0, max: 360 },
            tint: [0xf472b6, 0x38bdf8, 0x4ade80, 0xffd93d, 0xc084fc, 0xfb923c], emitting: false
        });
        conf.explode(36);
        if (this.playBuddy) this.playBuddy.react('win');
        /* celebrating buddy */
        var ck = 'theme_' + ((state && state.theme) || 'monster_blue') + '_cheer';
        if (this.textures.exists(ck)) {
            var cm = this.add.image(W / 2, H / 2 - 40, ck).setDepth(40);
            cm.setScale(0);
            var cs = 210 / Math.max(cm.width, cm.height);
            this.tweens.add({ targets: cm, scaleX: cs, scaleY: cs, duration: 450, ease: 'Back.easeOut' });
            this.tweens.add({ targets: cm, y: H / 2 - 66, duration: 300, yoyo: true, repeat: 2, delay: 450, ease: 'Quad.easeOut' });
            this.track(cm);
        }
        /* cheer voice (English teacher + buddy Arabic banter mix, + level-up line) */
        if (!(state && state.muted)) {
            if (leveled) VO.cheerMixed('instr_levelup');
            else VO.cheerMixed();
        }
        this.time.delayedCall(1800, function () {
            s.clearRound();
            s.roundLock = false;
            s.newRound();
        });
    }
    oopsAt(targets) {
        var s = this;
        this.levelUpMaybe(false); save();
        if (targets) this.tweens.add({ targets: targets, x: '+=8', duration: 60, yoyo: true, repeat: 3, onComplete: function () { } });
        SFX.play('buzz');
        if (this.playBuddy) this.playBuddy.react('no');
        if (!(state && state.muted)) VO.oops();
    }
    popParticles(x, y, tint) {
        var p = this.add.particles(x, y, 'dot', {
            speed: { min: 90, max: 300 }, angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 }, lifespan: 550, tint: tint || [0xffffff, 0xffd93d, 0x7dd3fc], emitting: false
        });
        p.explode(12);
        this.time.delayedCall(700, function () { p.destroy(); });
    }
    bobTween(o, dist, dur) {
        this.tweens.add({ targets: o, y: o.y - (dist || 10), duration: dur || (1400 + rnd(700)), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
}

/* ================= 1) Letter Bubbles ================= */
class LettersScene extends GameBase {
    constructor() { super('g_letters', 'letters'); }
    buildRound(cur) {
        var s = this;
        s.addPlayBuddy(W - 64, 752, 92);
        var tintPool = [0xffc7dd, 0xbfe6ff, 0xc7f9cc, 0xfff3b0, 0xe5ccff, 0xffd9b3];
        var cols = 3, rows = 3;
        cur.chars.forEach(function (ch, i) {
            var gx = 70 + (i % cols) * 125 + rnd(20) - 10;
            var gy = 240 + Math.floor(i / cols) * 185 + rnd(20) - 10;
            var c = s.add.container(gx, gy);
            var bub = s.add.image(0, 0, 'bubble').setScale(.62).setTint(tintPool[i % tintPool.length]);
            var fs = ch.length > 2 ? '22px' : ch.length > 1 ? '30px' : '44px';
            var txt = s.add.text(0, -4, ch, { fontSize: fs, fontStyle: '900', color: '#2d2340' }).setOrigin(.5);
            c.add([bub, txt]);
            c.setSize(110, 110);
            c.setInteractive({ useHandCursor: true });
            c.setScale(0);
            s.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 420, delay: i * 70, ease: 'Back.easeOut' });
            s.tweens.add({ targets: c, y: gy - 12, duration: 1500 + rnd(800), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            s.tweens.add({ targets: c, angle: rnd(7) - 3, duration: 2200 + rnd(600), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            c.on('pointerdown', function () {
                if (s.roundLock || c.dead) return;
                if (ch === cur.target) {
                    c.dead = true;
                    SFX.play('pop');
                    s.popParticles(c.x, c.y, [tintPool[i % tintPool.length], 0xffffff]);
                    s.tweens.add({ targets: c, scaleX: 1.5, scaleY: 1.5, alpha: 0, duration: 220, onComplete: function () { c.destroy(); } });
                    if (!(state && state.muted)) VO.mini();
                    cur.hits++;
                    if (s.playBuddy) s.playBuddy.react('yay');
                    if (cur.hits >= cur.need) s.win();
                } else s.oopsAt(c);
            });
            s.track(c);
        });
    }
}

/* ================= 2) Feed the Bear ================= */
class FeedScene extends GameBase {
    constructor() { super('g_feed', 'words'); }
    buildRound(cur) {
        var s = this;
        /* hungry mascot */
        var m = mascotWithFace(this, W / 2, H - 210, 190);
        this.track(m);
        makeSquish(this, m, 1);
        this.tweens.add({ targets: m, y: H - 216, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        /* option cards 2x2 */
        cur.options.forEach(function (opt, i) {
            var cx = (i % 2 === 0) ? 102 : 288, cy = 290 + Math.floor(i / 2) * 165;
            var card = s.add.container(cx, cy);
            var g = s.add.graphics();
            g.fillStyle(0xd8c9a3, 1).fillRoundedRect(-82, -62, 164, 128, 24);
            g.fillStyle(0xfffdf5, 1).fillRoundedRect(-82, -70, 164, 128, 24);
            g.lineStyle(3, 0xe8dcc0, 1).strokeRoundedRect(-82, -70, 164, 128, 24);
            card.add(g);
            if (cur.mode === 'pic') {
                var im = s.add.image(0, -18, 'w_' + opt);
                im.setScale(Math.min(80 / im.width, 80 / im.height));
                card.add(im);
                card.add(s.add.text(0, 38, opt, { fontSize: '17px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            } else {
                card.add(s.add.text(0, -6, opt, { fontSize: '30px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            }
            card.setSize(164, 128);
            card.setInteractive({ useHandCursor: true });
            card.setScale(0);
            s.tweens.add({ targets: card, scaleX: 1, scaleY: 1, duration: 380, delay: 100 + i * 80, ease: 'Back.easeOut' });
            card.on('pointerdown', function () {
                if (s.roundLock || card.dead) return;
                if (opt === cur.answer) {
                    card.dead = true;
                    /* fly into mascot mouth */
                    s.tweens.add({
                        targets: card, x: m.x, y: m.y + 20, scaleX: .2, scaleY: .2, duration: 380, ease: 'Quad.easeIn',
                        onComplete: function () {
                            card.destroy();
                            /* munch */
                            SFX.play('munch');
                            s.tweens.add({ targets: m, scaleY: .88, scaleX: 1.1, duration: 110, yoyo: true, repeat: 3 });
                            s.tweens.add({ targets: m, y: m.y - 46, duration: 260, yoyo: true, ease: 'Quad.easeOut' });
                            s.popParticles(m.x, m.y - 30, [0xffd93d, 0xff9f43]);
                            s.time.delayedCall(450, function () { s.win(); });
                        }
                    });
                    if (!(state && state.muted)) VO.mini();
                } else {
                    s.oopsAt(card);
                    s.tweens.add({ targets: m, angle: -6, duration: 90, yoyo: true, repeat: 3, onComplete: function () { m.angle = 0; } });
                }
            });
            s.track(card);
        });
    }
}

/* ================= 3) Word Train ================= */
class TrainScene extends GameBase {
    constructor() { super('g_train', 'spelling'); }
    buildRound(cur) {
        var s = this;
        s.addPlayBuddy(60, 762, 84);
        var word = cur.word, graphs = cur.graphs, L = graphs.length;
        /* word picture (if one exists) */
        if (this.textures.exists('w_' + word)) {
            var pic = this.add.image(W / 2, 225, 'w_' + word);
            pic.setScale(Math.min(100 / pic.width, 100 / pic.height));
            this.track(pic);
            this.bobTween(pic, 8, 1600);
        } else {
            /* show the word itself as the goal */
            this.track(this.add.text(W / 2, 225, word, { fontSize: '46px', fontStyle: '900', color: '#3b2a5e', backgroundColor: 'rgba(255,255,255,.9)', padding: { x: 22, y: 10 } }).setOrigin(.5));
        }
        /* slots (train cars) */
        var slotW = Math.min(66, (W - 70) / L - 6), gap = 6;
        var totalW = L * slotW + (L - 1) * gap;
        var x0 = W / 2 - totalW / 2 + slotW / 2;
        var slots = [];
        for (var i = 0; i < L; i++) {
            (function (i) {
                var sx = x0 + i * (slotW + gap), sy = 400;
                var car = s.add.graphics();
                car.fillStyle(0xffffff, .95).fillRoundedRect(sx - slotW / 2, sy - 34, slotW, 68, 14);
                car.lineStyle(3, 0x9b59f5, 1).strokeRoundedRect(sx - slotW / 2, sy - 34, slotW, 68, 14);
                car.fillStyle(0x3b2a5e, 1).fillCircle(sx - 16, sy + 42, 8).fillCircle(sx + 16, sy + 42, 8);
                s.track(car);
                slots.push({ x: sx, y: sy, filled: false });
            })(i);
        }
        this.trainSlots = slots;
        this.placedCount = 0;
        /* grapheme tiles: picture tile for single letters, text card for digraphs */
        cur.tiles.forEach(function (tile, i) {
            var cols = 4;
            var tx = 55 + (i % cols) * 95, ty = 555 + Math.floor(i / cols) * 105;
            var t = s.add.container(tx, ty);
            if (tile.g.length === 1 && s.textures.exists('tile_' + tile.g.toUpperCase())) {
                t.add(s.add.image(0, 0, 'tile_' + tile.g.toUpperCase()).setScale(.5));
            } else {
                var card = s.add.graphics();
                card.fillStyle(0xffd93d, 1).fillRoundedRect(-42, -34, 84, 68, 14);
                card.lineStyle(3, 0xe07f1a, 1).strokeRoundedRect(-42, -34, 84, 68, 14);
                t.add(card);
                t.add(s.add.text(0, 0, phDisp(tile.g), { fontSize: tile.g.length > 2 ? '20px' : '26px', fontStyle: '900', color: '#4a2c00' }).setOrigin(.5));
            }
            t.setSize(84, 84);
            t.setInteractive({ useHandCursor: true });
            t.setScale(0);
            s.tweens.add({ targets: t, scaleX: 1, scaleY: 1, duration: 380, delay: 120 + i * 70, ease: 'Back.easeOut' });
            s.bobTween(t, 6, 1300 + i * 120);
            t.on('pointerdown', function () {
                if (s.roundLock || t.dead) return;
                var need = graphs[s.placedCount];
                if (tile.g === need) {
                    t.dead = true;
                    var slot = s.trainSlots[s.placedCount];
                    s.tweens.killTweensOf(t);
                    s.tweens.add({
                        targets: t, x: slot.x, y: slot.y, duration: 320, ease: 'Back.easeOut',
                        onComplete: function () {
                            s.tweens.add({ targets: t, scaleX: .62, scaleY: .62, duration: 140 });
                            s.popParticles(slot.x, slot.y, [0x9b59f5, 0xffd93d]);
                        }
                    });
                    /* sound-out: each placed grapheme says its sound */
                    SFX.play('note', s.placedCount);
                    if (!(state && state.muted)) VO.say(phKey(tile.g));
                    s.placedCount++;
                    if (s.playBuddy) s.playBuddy.react('yay');
                    if (s.placedCount >= L) {
                        SFX.play('whoosh');
                        /* then the whole word */
                        if (!(state && state.muted)) s.time.delayedCall(650, function () { VO.say('word_' + word); });
                        s.roundObjs.forEach(function (o) {
                            s.tweens.add({ targets: o, x: o.x + W + 200, duration: 900, delay: 1400, ease: 'Quad.easeIn' });
                        });
                        var smoke = s.add.particles(W / 2, 360, 'dot', {
                            speed: { min: 30, max: 90 }, angle: { min: 240, max: 300 },
                            scale: { start: 1.6, end: 0 }, alpha: { start: .5, end: 0 },
                            lifespan: 900, tint: 0xffffff, frequency: 90, emitting: true
                        });
                        s.track(smoke);
                        s.time.delayedCall(2300, function () { smoke.destroy(); });
                        s.time.delayedCall(1500, function () { s.win(); });
                    }
                } else s.oopsAt(t);
            });
            s.track(t);
        });
    }
}

/* ================= 4) Picnic Count ================= */
class CountScene extends GameBase {
    constructor() { super('g_count', 'counting'); }
    buildRound(cur) {
        var s = this;
        /* ---- more / less: two plates, tap the right one ---- */
        if (cur.mode === 'more') {
            var key = cntKey(cur.img);
            [[W / 4, cur.a, 'a'], [3 * W / 4, cur.b, 'b']].forEach(function (pd) {
                var px = pd[0], n = pd[1];
                var plate = s.add.graphics();
                plate.fillStyle(0xffffff, .95).fillRoundedRect(px - 82, 260, 164, 380, 26);
                plate.lineStyle(4, 0xffd93d, 1).strokeRoundedRect(px - 82, 260, 164, 380, 26);
                s.track(plate);
                var cols2 = Math.ceil(Math.sqrt(n));
                var cell = Math.min(150 / cols2, 330 / Math.ceil(n / cols2), 64);
                var sc = cell * .82;
                for (var i = 0; i < n; i++) {
                    var ix = px - (cols2 - 1) * cell / 2 + (i % cols2) * cell;
                    var iy = 300 + Math.floor(i / cols2) * cell;
                    var it = s.add.image(ix, iy, key);
                    var k = Math.min(sc / it.width, sc / it.height);
                    it.setScale(k);
                    it.setScale(0);
                    s.tweens.add({ targets: it, scaleX: k, scaleY: k, duration: 300, delay: 100 + i * 55, ease: 'Back.easeOut' });
                    s.track(it);
                }
                var zone = s.add.zone(px, 450, 164, 380).setInteractive({ useHandCursor: true });
                zone.on('pointerdown', function () {
                    if (s.roundLock) return;
                    if (n === cur.answer) {
                        SFX.play('chime');
                        s.popParticles(px, 420, [0xffd93d, 0x4ade80]);
                        s.win();
                    } else s.oopsAt(null);
                });
                s.track(zone);
            });
            return;
        }
        /* ---- count & feed ---- */
        var m = mascotWithFace(this, W - 92, 205, 120);
        this.track(m);
        makeSquish(this, m, 1);
        this.cntTxt = this.add.text(90, 205, '0', { fontSize: '54px', fontStyle: '900', color: '#e07f1a' }).setOrigin(.5);
        this.track(this.cntTxt);
        var bl = this.add.graphics();
        bl.fillStyle(0xff8fa3, 1).fillRoundedRect(24, 300, W - 48, 420, 30);
        bl.lineStyle(4, 0xffffff, .8);
        for (var lx = 44; lx < W - 40; lx += 46) { bl.lineBetween(lx, 308, lx, 712); }
        for (var ly = 316; ly < 712; ly += 46) { bl.lineBetween(30, ly, W - 30, ly); }
        this.track(bl);
        var key = cntKey(cur.img);
        var big = cur.total > 14;
        var sz = big ? 42 : 54, mind = big ? 44 : 58;
        var placed = [];
        for (var i = 0; i < cur.total; i++) {
            (function (i) {
                var px, py, ok = false, tries = 0;
                while (!ok && tries++ < 80) {
                    px = 52 + rnd(W - 104); py = 336 + rnd(352);
                    ok = placed.every(function (p) { var dx = p[0] - px, dy = p[1] - py; return dx * dx + dy * dy > mind * mind; });
                }
                placed.push([px, py]);
                var it = s.add.image(px, py, key);
                var kk = Math.min(sz / it.width, sz / it.height);
                it.setInteractive({ useHandCursor: true });
                it.setScale(0);
                s.tweens.add({ targets: it, scaleX: kk, scaleY: kk, duration: 340, delay: 80 + i * 45, ease: 'Back.easeOut' });
                it.on('pointerdown', function () {
                    if (s.roundLock || it.dead) return;
                    it.dead = true;
                    SFX.play('munch');
                    cur.got++;
                    s.cntTxt.setText(String(cur.got));
                    s.tweens.add({ targets: s.cntTxt, scaleX: 1.7, scaleY: 1.7, duration: 140, yoyo: true });
                    if (!(state && state.muted)) VO.say('num_' + cur.got);
                    s.tweens.add({
                        targets: it, x: m.x, y: m.y + 10, scaleX: .15, scaleY: .15, duration: 320, ease: 'Quad.easeIn',
                        onComplete: function () {
                            it.destroy();
                            s.tweens.add({ targets: m, scaleY: .9, scaleX: 1.08, duration: 100, yoyo: true, repeat: 1 });
                            if (cur.got >= cur.n) {
                                s.tweens.add({ targets: m, y: m.y - 40, duration: 240, yoyo: true, ease: 'Quad.easeOut' });
                                s.popParticles(m.x, m.y - 40, [0xffd93d, 0xff9f43]);
                                s.win();
                            }
                        }
                    });
                });
                s.track(it);
            })(i);
        }
    }
}

/* ================= 5) Rocket Math ================= */
class RocketScene extends GameBase {
    constructor() { super('g_rocket', 'math'); }
    buildRound(cur) {
        var s = this;
        s.addPlayBuddy(W - 62, 372, 96);
        /* equation */
        var eqG = this.add.graphics();
        eqG.fillStyle(0x1e2a5e, .92).fillRoundedRect(W / 2 - 130, 165, 260, 76, 24);
        this.track(eqG);
        this.track(this.add.text(W / 2, 203, cur.eq, { fontSize: '40px', fontStyle: '900', color: '#ffd93d' }).setOrigin(.5));
        /* rockets */
        var spots = [62, 152, 242, 332];
        cur.options.forEach(function (opt, i) {
            var rx = spots[i], ry = 560 + (i % 2) * 60;
            var r = s.add.container(rx, ry);
            var ship = s.add.image(0, 0, 'ship_' + cur.ships[i]);
            ship.setScale(88 / Math.max(ship.width, ship.height));
            ship.setAngle(0);
            var label = s.add.text(0, 76, opt, { fontSize: '27px', fontStyle: '900', color: '#fff', backgroundColor: 'rgba(30,42,94,.85)', padding: { x: 10, y: 3 } }).setOrigin(.5);
            r.add([ship, label]);
            r.setSize(90, 160);
            r.setInteractive({ useHandCursor: true });
            /* idle hover + flame */
            s.tweens.add({ targets: r, y: ry - 14, duration: 1100 + i * 160, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            s.tweens.add({ targets: ship, angle: 4, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            var flame = s.add.particles(rx, ry + 46, 'dot', {
                speed: { min: 30, max: 80 }, angle: { min: 80, max: 100 },
                scale: { start: 1.5, end: 0 }, alpha: { start: .9, end: 0 },
                lifespan: 420, tint: [0xffb03d, 0xff6b35, 0xffd93d], frequency: 55
            });
            s.track(flame);
            r.on('pointerdown', function () {
                if (s.roundLock || r.dead) return;
                if (opt === cur.answer) {
                    r.dead = true;
                    flame.explode(30);
                    flame.destroy();
                    var blast = s.add.particles(rx, ry + 44, 'dot', {
                        speed: { min: 60, max: 180 }, angle: { min: 60, max: 120 },
                        scale: { start: 1.4, end: 0 }, alpha: { start: .9, end: 0 },
                        lifespan: 600, tint: [0xffb03d, 0xff6b35, 0xfff3b0], frequency: 40
                    });
                    s.track(blast);
                    SFX.play('whoosh');
                    if (s.playBuddy) s.playBuddy.react('yay');
                    s.tweens.killTweensOf(r);
                    s.tweens.add({ targets: r, y: -220, duration: 850, ease: 'Quad.easeIn' });
                    if (!(state && state.muted)) VO.mini();
                    s.time.delayedCall(500, function () { s.win(); });
                } else {
                    s.oopsAt(r);
                    s.tweens.add({ targets: ship, angle: -14, duration: 80, yoyo: true, repeat: 3, onComplete: function () { ship.angle = 0; } });
                }
            });
            s.track(r);
        });
    }
}

/* ================= 6) Shape Sorter ================= */
class SortScene extends GameBase {
    constructor() { super('g_sort', 'shapes'); }
    buildRound(cur) {
        var s = this;
        s.addPlayBuddy(64, 770, 82);
        var holes = [];
        /* holes (homes) at bottom */
        cur.holes.forEach(function (h, i) {
            var hx = 75 + i * 120, hy = 640;
            var c = s.add.container(hx, hy);
            var ring = s.add.graphics();
            ring.lineStyle(4, 0xffffff, .9).strokeCircle(0, 0, 52);
            ring.fillStyle(0x000000, .12).fillCircle(0, 0, 52);
            c.add(ring);
            var sil = s.add.image(0, 0, shapeKey(h.shape, h.color));
            sil.setScale(92 / Math.max(sil.width, sil.height)).setAlpha(.35);
            c.add(sil);
            s.tweens.add({ targets: ring, scaleX: 1.05, scaleY: 1.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            holes.push({ c: c, sil: sil, key: h.key, filled: false, x: hx, y: hy });
            s.track(c);
        });
        this.sortHoles = holes;
        this.sortFilled = 0;
        /* pieces (draggable) */
        cur.pieces.forEach(function (p, i) {
            var px = 75 + i * 120, py = 300 + (i % 2) * 90;
            var pc = s.add.container(px, py);
            var im = s.add.image(0, 0, shapeKey(p.shape, p.color));
            pc.bs = 88 / Math.max(im.width, im.height);
            im.setScale(pc.bs);
            pc.add(im);
            pc.setSize(100, 100);
            pc.setInteractive({ useHandCursor: true, draggable: true });
            s.input.setDraggable(pc);
            s.bobTween(pc, 8, 1200 + i * 150);
            pc.homeX = px; pc.homeY = py;
            pc.on('dragstart', function () { s.tweens.killTweensOf(pc); pc.setScale(pc.bs * 1.15); pc.setDepth(5); });
            pc.on('drag', function (ptr, dx, dy) { pc.x = dx; pc.y = dy; });
            pc.on('dragend', function () {
                if (s.roundLock) { pc.setScale(pc.bs); return; }
                var hit = null;
                holes.forEach(function (h) {
                    if (h.filled) return;
                    var dx = h.x - pc.x, dy = h.y - pc.y;
                    if (dx * dx + dy * dy < 70 * 70) hit = h;
                });
                if (hit && hit.key === p.key) {
                    hit.filled = true;
                    pc.setScale(pc.bs); pc.setDepth(1);
                    pc.x = hit.x; pc.y = hit.y;
                    pc.disableInteractive();
                    hit.sil.setAlpha(0);
                    s.tweens.add({ targets: pc, scaleX: pc.bs * 1.15, scaleY: pc.bs * 1.15, duration: 140, yoyo: true, ease: 'Back.easeOut' });
                    SFX.play('chime');
                    s.popParticles(hit.x, hit.y, [0xffffff, 0xffd93d]);
                    if (!(state && state.muted)) VO.mini();
                    if (s.playBuddy) s.playBuddy.react('yay');
                    s.sortFilled++;
                    if (s.sortFilled >= holes.length) s.win();
                } else {
                    if (hit) s.oopsAt(pc);
                    pc.setScale(pc.bs); pc.setDepth(1);
                    s.tweens.add({ targets: pc, x: pc.homeX, y: pc.homeY, duration: 380, ease: 'Back.easeOut', onComplete: function () { s.bobTween(pc, 8, 1200); } });
                }
            });
            s.track(pc);
        });
    }
}

/* ================= 7) Pattern Train ================= */
class PatternScene extends GameBase {
    constructor() { super('g_pattern', 'pattern'); }
    buildRound(cur) {
        var s = this;
        s.addPlayBuddy(64, 742, 92);
        /* engine + cars row */
        var n = cur.mode === 'num' ? cur.seq.length : cur.seq.length + 1;
        var gap = 8;
        var carW = Math.min(58, Math.floor((W - 60 - (n - 1) * gap) / n));
        var totalW = n * carW + (n - 1) * gap;
        var x0 = W / 2 - totalW / 2 + carW / 2;
        var y0 = 330;
        var missIdx = cur.mode === 'num' ? cur.missAt : cur.seq.length - 1 + 0; /* shape: answer slot at end */
        if (cur.mode === 'shape') { missIdx = cur.seq.length; }
        this.missPos = null;
        for (var i = 0; i <= (cur.mode === 'shape' ? cur.seq.length : cur.seq.length - 1); i++) {
            (function (i) {
                var cx = x0 + i * (carW + gap);
                var isMiss = i === missIdx;
                var car = s.add.graphics();
                car.fillStyle(isMiss ? 0xfff1c7 : 0xffffff, .96).fillRoundedRect(cx - carW / 2, y0 - 34, carW, 68, 14);
                car.lineStyle(3, isMiss ? 0xe07f1a : 0x9b59f5, 1).strokeRoundedRect(cx - carW / 2, y0 - 34, carW, 68, 14);
                var wx = Math.min(14, carW / 4);
                car.fillStyle(0x3b2a5e, 1).fillCircle(cx - wx, y0 + 42, 7).fillCircle(cx + wx, y0 + 42, 7);
                s.track(car);
                var inner = Math.min(40, carW - 14);
                if (isMiss) {
                    s.missPos = { x: cx, y: y0 };
                    s.track(s.add.text(cx, y0, '?', { fontSize: '30px', fontStyle: '900', color: '#e07f1a' }).setOrigin(.5));
                } else if (cur.mode === 'num') {
                    s.track(s.add.text(cx, y0, String(cur.seq[i]), { fontSize: (cur.seq[i] > 99 ? '17px' : '22px'), fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
                } else {
                    var im = s.add.image(cx, y0, shapeKey(cur.shape, cur.seq[i]));
                    im.setScale(Math.min(inner / im.width, inner / im.height));
                    s.track(im);
                }
            })(i);
        }
        /* option cards */
        var oy = 560;
        var opts = cur.options;
        opts.forEach(function (opt, i) {
            var ox = W / 2 + (i - (opts.length - 1) / 2) * 120;
            var c = s.add.container(ox, oy);
            var card = s.add.graphics();
            card.fillStyle(0xffffff, 1).fillRoundedRect(-52, -52, 104, 104, 20);
            card.lineStyle(4, 0x2ecc71, 1).strokeRoundedRect(-52, -52, 104, 104, 20);
            c.add(card);
            if (cur.mode === 'num') {
                c.add(s.add.text(0, 0, String(opt), { fontSize: '30px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            } else {
                var im2 = s.add.image(0, 0, shapeKey(cur.shape, opt));
                im2.setScale(Math.min(64 / im2.width, 64 / im2.height));
                c.add(im2);
            }
            c.setSize(104, 104);
            c.setInteractive({ useHandCursor: true });
            c.setScale(0);
            s.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 380, delay: 200 + i * 90, ease: 'Back.easeOut' });
            s.bobTween(c, 7, 1300 + i * 150);
            c.on('pointerdown', function () {
                if (s.roundLock || c.dead) return;
                if (String(opt) === String(cur.answer)) {
                    c.dead = true;
                    s.tweens.killTweensOf(c);
                    s.tweens.add({
                        targets: c, x: s.missPos.x, y: s.missPos.y, scaleX: .55, scaleY: .55, duration: 350, ease: 'Back.easeOut',
                        onComplete: function () {
                            SFX.play('pop');
                            if (s.playBuddy) s.playBuddy.react('yay');
                            s.popParticles(s.missPos.x, s.missPos.y, [0x2ecc71, 0xffd93d]);
                            if (!(state && state.muted) && cur.mode === 'num') VO.say('num_' + cur.answer);
                            /* train chugs off */
                            s.time.delayedCall(500, function () {
                                s.roundObjs.forEach(function (o) { s.tweens.add({ targets: o, x: o.x + W + 220, duration: 800, ease: 'Quad.easeIn' }); });
                            });
                            s.time.delayedCall(900, function () { s.win(); });
                        }
                    });
                } else s.oopsAt(c);
            });
            s.track(c);
        });
    }
}

/* ================= 8) Memory Match ================= */
class MemoryScene extends GameBase {
    constructor() { super('g_memory', 'memory'); }
    buildRound(cur) {
        var s = this;
        var n = cur.words.length * 2, rows = n / 4;
        var cw = 84, x0 = 57, stepX = 92;
        var y0 = rows === 3 ? 252 : 212, rowH = rows === 3 ? 148 : 126;
        s.addPlayBuddy(W / 2, rows === 3 ? 726 : 730, rows === 3 ? 96 : 88);
        var cards = [];
        cur.words.forEach(function (w) {
            if (cur.mode === 'letter') {
                cards.push({ pair: w, kind: 'letter', label: w[0].toUpperCase() });
                cards.push({ pair: w, kind: 'pic', word: w });
            } else {
                cards.push({ pair: w, kind: 'pic', word: w });
                cards.push({ pair: w, kind: 'pic', word: w });
            }
        });
        shuffle(cards);
        this.flipped = []; this.matched = 0; this.lockFlip = false;
        cards.forEach(function (cd, i) {
            var cx = x0 + (i % 4) * stepX, cy = y0 + Math.floor(i / 4) * rowH;
            var c = s.add.container(cx, cy);
            var back = s.add.graphics();
            back.fillStyle(0xff6b9d, 1).fillRoundedRect(-cw / 2, -cw / 2, cw, cw, 18);
            back.lineStyle(3, 0xffffff, .9).strokeRoundedRect(-cw / 2, -cw / 2, cw, cw, 18);
            var backMotif = s.add.image(0, 0, 'tile_heart').setScale(.32).setAlpha(.85);
            var front = s.add.container(0, 0);
            var fg = s.add.graphics();
            fg.fillStyle(0xffffff, 1).fillRoundedRect(-cw / 2, -cw / 2, cw, cw, 18);
            fg.lineStyle(3, 0xffd93d, 1).strokeRoundedRect(-cw / 2, -cw / 2, cw, cw, 18);
            front.add(fg);
            if (cd.kind === 'letter') {
                if (s.textures.exists('tile_' + cd.label)) front.add(s.add.image(0, 0, 'tile_' + cd.label).setScale(.52));
                else front.add(s.add.text(0, 0, cd.label, { fontSize: '40px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            } else {
                var im = s.add.image(0, -8, 'w_' + cd.word);
                im.setScale(Math.min(50 / im.width, 50 / im.height));
                front.add(im);
                front.add(s.add.text(0, 27, cd.word, { fontSize: '13px', fontStyle: '900', color: '#7a7194' }).setOrigin(.5));
            }
            front.setVisible(false);
            c.add([back, backMotif, front]);
            c.setSize(cw, cw);
            c.setInteractive({ useHandCursor: true });
            c.setScale(0);
            s.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 380, delay: 100 + i * 50, ease: 'Back.easeOut' });
            cd.go = c; cd.front = front; cd.backBits = [back, backMotif];
            c.on('pointerdown', function () { s.flipCard(cd, cur); });
            s.track(c);
        });
    }
    flipCard(cd, cur) {
        var s = this;
        if (s.roundLock || s.lockFlip || cd.done || cd.open) return;
        cd.open = true;
        SFX.play('flip');
        if (s.playBuddy) s.playBuddy.react('peek');
        s.tweens.add({
            targets: cd.go, scaleX: 0, duration: 110, onComplete: function () {
                cd.backBits.forEach(function (b) { b.setVisible(false); });
                cd.front.setVisible(true);
                s.tweens.add({ targets: cd.go, scaleX: 1, duration: 110 });
            }
        });
        s.flipped.push(cd);
        if (s.flipped.length < 2) return;
        var a = s.flipped[0], b = s.flipped[1];
        s.flipped = [];
        if (a.pair === b.pair && a !== b) {
            a.done = b.done = true;
            s.time.delayedCall(360, function () {
                SFX.play('chime');
                s.popParticles(a.go.x, a.go.y, [0xffd93d, 0x4ade80]);
                s.popParticles(b.go.x, b.go.y, [0xffd93d, 0x4ade80]);
                if (!(state && state.muted)) VO.say('word_' + a.pair);
                if (s.playBuddy) s.playBuddy.react('yay');
                [a, b].forEach(function (cd2) {
                    s.tweens.add({ targets: cd2.go, angle: 4, duration: 120, yoyo: true, repeat: 1 });
                    cd2.go.setAlpha(.85);
                });
                s.matched++;
                if (s.matched >= cur.words.length) s.win();
            });
        } else {
            s.lockFlip = true;
            s.time.delayedCall(640, function () {
                SFX.play('buzz');
                if (s.playBuddy) s.playBuddy.react('no');
                [a, b].forEach(function (cd2) {
                    cd2.open = false;
                    s.tweens.add({
                        targets: cd2.go, scaleX: 0, duration: 110, onComplete: function () {
                            cd2.front.setVisible(false);
                            cd2.backBits.forEach(function (b2) { b2.setVisible(true); });
                            s.tweens.add({ targets: cd2.go, scaleX: 1, duration: 110 });
                        }
                    });
                });
                s.lockFlip = false;
            });
        }
    }
}

/* ================= 9) Story Time: buddy-narrated stories ================= */
var STORY_ART = { cat: '🐱', sleep: '😴', milk: '🥛', bus: '🚌', hill: '⛰️', home: '🏠', park: '🌳', fish: '🐟', pond: '🏞️', gift: '🎁', apple: '🍎', jump: '🤸', bonk: '💫', star: '⭐', play: '🎈', friends: '💛', garden: '🌷', butterfly: '🦋' };
var BUDDY_THEME = { fuzzy: 'monster_blue', blinky: 'monster_green', captain: 'hero', luna: 'caped', princess: 'princess', fairy: 'fairy' };
var BUDDY_AR = { fuzzy: 'فزفز', blinky: 'بلينكي', captain: 'كابتن ستار', luna: 'لونا', princess: 'الأميرة', fairy: 'الجنية' };
class StoryScene extends Phaser.Scene {
    constructor() { super('g_story'); }
    create() {
        var s = this;
        this.add.image(W / 2, H / 2, 'bg_grass').setScale(Math.max(W / 390, H / 844) * 1.02);
        addCloud(this, 'cloud3', 200, 62000, .4);
        addCloud(this, 'cloud4', 320, 52000, .34, -20000).setAlpha(.7);
        /* header */
        var backG = this.add.graphics();
        backG.fillStyle(0xffffff, .95).fillRoundedRect(14, 14, 48, 48, 16);
        backG.fillStyle(0x3b2a5e, 1).fillTriangle(38, 26, 38, 50, 22, 38);
        var back = this.add.zone(14, 14, 48, 48).setOrigin(0).setInteractive({ useHandCursor: true });
        back.on('pointerdown', function () { VO.stop(); if (s.mode === 'read') s.showPicker(); else s.scene.start('home'); });
        this.add.text(W / 2, 40, '📖 Story Time', { fontSize: '26px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5);
        this.showPicker();
    }
    clearLayer() {
        if (this.layer) this.layer.forEach(function (o) { if (o && o.destroy) o.destroy(); });
        this.layer = [];
    }
    showPicker() {
        var s = this;
        this.mode = 'pick';
        this.clearLayer();
        STORIES.forEach(function (st, i) {
            var cx = (i % 2 === 0) ? 102 : 288, cy = 170 + Math.floor(i / 2) * 190;
            var c = s.add.container(cx, cy);
            var col = SPOTCOLORS[i % SPOTCOLORS.length];
            var g = s.add.graphics();
            g.fillStyle(col[1], 1).fillRoundedRect(-88, -72, 176, 158, 24);
            g.fillStyle(col[0], 1).fillRoundedRect(-88, -80, 176, 158, 24);
            c.add(g);
            c.add(s.add.text(0, -44, st.em, { fontSize: '40px' }).setOrigin(.5));
            c.add(s.add.text(0, 2, st.title.ar, { fontSize: '17px', fontStyle: '900', color: '#fff', align: 'center', wordWrap: { width: 160 } }).setOrigin(.5));
            var tk = BUDDY_THEME[st.buddy] || st.buddy;
            if (s.textures.exists('theme_' + tk)) {
                var bm = s.add.image(-58, 44, 'theme_' + tk);
                bm.setScale(46 / Math.max(bm.width, bm.height));
                c.add(bm);
            }
            c.add(s.add.text(12, 44, st.lang === 'ar' ? 'عربي 🎧' : 'English 🎧', { fontSize: '13px', fontStyle: '700', color: 'rgba(255,255,255,.95)' }).setOrigin(.5));
            c.setSize(176, 158);
            c.setInteractive({ useHandCursor: true });
            c.setScale(0);
            s.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 450, delay: 80 + i * 80, ease: 'Back.easeOut' });
            c.on('pointerdown', function () { s.openStory(st); });
            s.layer.push(c);
        });
        this.add && (this.pickHint = this.add.text(W / 2, H - 40, 'اختاروا قصة — الشخصية اللي عليها هي اللي هتحكيها!', { fontSize: '13.5px', fontStyle: '700', color: '#7a7194' }).setOrigin(.5));
        this.layer.push(this.pickHint);
    }
    openStory(st) {
        var s = this;
        this.story = st;
        this.finished = false;
        this.mode = 'read';
        /* tier by stage: kg1 tier 1, kg2/g1 tier 2 */
        var tier = (state && state.kg && state.kg !== 'kg1') ? 't2' : 't1';
        this.pages = st[tier];
        this.page = 0;
        this.showPage();
    }
    showPage() {
        var s = this;
        this.clearLayer();
        var st = this.story, pg = this.pages[this.page];
        /* sky card */
        var card = this.add.graphics();
        card.fillStyle(0xffffff, .96).fillRoundedRect(24, 88, W - 48, 560, 28);
        card.lineStyle(4, 0xffd93d, 1).strokeRoundedRect(24, 88, W - 48, 560, 28);
        this.layer.push(card);
        /* art: big emoji prop center stage */
        this.layer.push(this.add.text(W / 2 + 30, 250, STORY_ART[pg.art] || '✨', { fontSize: '120px' }).setOrigin(.5));
        /* narrator buddy on stage, breathing idle */
        var tk2 = BUDDY_THEME[st.buddy] || st.buddy;
        if (this.textures.exists('theme_' + tk2)) {
            var bm = this.add.image(108, 350, 'theme_' + tk2);
            bm.setScale(140 / Math.max(bm.width, bm.height));
            var bs0 = bm.scaleX;
            this.tweens.add({ targets: bm, scaleY: bm.scaleY * .955, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            this.layer.push(bm);
            this.layer.push(this.add.text(108, 440, 'بتحكي: ' + BUDDY_AR[st.buddy], { fontSize: '12.5px', fontStyle: '700', color: '#7a7194' }).setOrigin(.5));
        }
        /* text inside the card */
        var isAr = st.lang === 'ar';
        this.layer.push(this.add.text(W / 2, 545, pg.text, {
            fontSize: isAr ? '23px' : '21px', fontStyle: '900', color: '#3b2a5e', align: 'center',
            wordWrap: { width: W - 90 }, rtl: isAr, lineSpacing: 6
        }).setOrigin(.5));
        /* page dots */
        var dots = this.add.graphics();
        for (var i = 0; i < this.pages.length; i++) {
            dots.fillStyle(i === this.page ? 0xff9f43 : 0xd9d3e8, 1).fillCircle(W / 2 + (i - (this.pages.length - 1) / 2) * 22, 676, i === this.page ? 7 : 5);
        }
        this.layer.push(dots);
        /* buttons: replay, next/end */
        var rp = this.add.text(96, 720, '🔊', { fontSize: '34px' }).setOrigin(.5).setInteractive({ useHandCursor: true });
        rp.on('pointerdown', function () { SFX.play('tap'); s.narrate(); });
        this.layer.push(rp);
        var last = this.page >= this.pages.length - 1;
        var nx = this.add.container(W - 110, 720);
        var ng = this.add.graphics();
        ng.fillStyle(last ? 0x2ecc71 : 0xff9f43, 1).fillRoundedRect(-84, -34, 168, 68, 22);
        nx.add(ng);
        nx.add(this.add.text(0, 0, last ? 'النهاية! ⭐' : 'التالي ◀', { fontSize: '20px', fontStyle: '900', color: '#fff' }).setOrigin(.5));
        nx.setSize(168, 68); nx.setInteractive({ useHandCursor: true });
        nx.on('pointerdown', function () {
            if (s.finished) return;
            SFX.play('tap');
            if (last) { s.finished = true; nx.disableInteractive(); s.finishStory(); }
            else { s.page++; s.showPage(); }
        });
        this.layer.push(nx);
        if (this.page > 0) {
            var pv = this.add.text(48, 720, '▶', { fontSize: '30px', color: '#9b59f5' }).setOrigin(.5).setInteractive({ useHandCursor: true });
            pv.on('pointerdown', function () { s.page--; s.showPage(); });
            this.layer.push(pv);
        }
        this.narrate();
    }
    narrate() {
        var s = this, st = this.story;
        var tier = (state && state.kg && state.kg !== 'kg1') ? 't2' : 't1';
        var n = this.page + 1;
        var pg = this.pages[this.page];
        /* register line text so English TTS fallback can read it */
        if (typeof VO_MANIFEST !== 'undefined') {
            var ek = 'story_' + st.id + (tier === 't2' ? '_t2' : '') + '_p' + n;
            VO_MANIFEST.lines[ek] = { t: pg.text, v: 'lily', d: 'story narration' };
        }
        if (st.lang === 'ar') {
            var ak = 'story_' + st.id + (tier === 't2' ? '_t2' : '') + '_p' + n;
            if (VO.hasArClip(ak)) VO.say('ar:' + ak);
            else VO.speak(pg.text, 'ar-EG');
        } else {
            var ek2 = 'story_' + st.id + (tier === 't2' ? '_t2' : '') + '_p' + n;
            if (VO.hasClip(ek2)) VO.say(ek2);
            else VO.speak(pg.text, 'en-US');
        }
    }
    finishStory() {
        var s = this;
        VO.stop();
        state.stars = (state.stars || 0) + 1;
        save();
        var burst = this.add.particles(W / 2, H / 2 - 60, 'tile_star', {
            speed: { min: 160, max: 420 }, angle: { min: 0, max: 360 },
            scale: { start: .3, end: 0 }, lifespan: 900, gravityY: 300, emitting: false
        });
        burst.explode(14);
        var ck = 'theme_' + this.story.buddy + '_cheer';
        if (this.textures.exists(ck)) {
            var cm = this.add.image(W / 2, H / 2 - 40, ck).setDepth(40);
            cm.setScale(0);
            var cs = 210 / Math.max(cm.width, cm.height);
            this.tweens.add({ targets: cm, scaleX: cs, scaleY: cs, duration: 450, ease: 'Back.easeOut' });
            this.tweens.add({ targets: cm, y: H / 2 - 66, duration: 300, yoyo: true, repeat: 2, delay: 450, ease: 'Quad.easeOut' });
        }
        if (!(state && state.muted)) VO.cheerMixed();
        this.time.delayedCall(2000, function () { burst.destroy(); s.showPicker(); });
    }
}
