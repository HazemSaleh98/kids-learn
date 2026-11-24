'use strict';
/* ================= round generators (KG curriculum, auto-leveling) ================= */
GAMES.letters.gen = function (lvl, kg) {
    var target, pool, mode = 'upper';
    if (kg === 'kg2') {
        if (lvl >= 3) mode = 'phonics';
        else { mode = 'lower'; pool = lvl < 2 ? LETTERS.slice(0, 10) : LETTERS; }
    } else {
        pool = lvl < 2 ? LETTERS.slice(0, 10) : lvl < 4 ? LETTERS.slice(0, 18) : LETTERS;
    }
    if (mode === 'phonics') { target = pick(LETTERS); pool = LETTERS; }
    else target = pick(pool);
    var disp = mode === 'lower' ? target.toLowerCase() : target;
    var others = sample(pool, 8, [target]);
    if (mode === 'lower') others = others.map(function (l) { return l.toLowerCase(); });
    var chars = shuffle([disp, disp, disp].concat(others.slice(0, 6)));
    var instr = mode === 'phonics' ? 'Pop the letter that says "' + SOUNDS[target] + '"!' : 'Pop every ' + disp + ' bubble!';
    var keys = mode === 'phonics' ? ['instr_letters_phonics', 'ph_' + target.toLowerCase()]
        : ['instr_letters_1', 'letter_' + target.toLowerCase(), 'instr_letters_2'];
    return { mode: mode, target: disp, chars: chars, hits: 0, need: 3, instr: instr, keys: keys };
};
GAMES.words.gen = function (lvl, kg) {
    if (kg === 'kg2' && lvl >= 3) {
        var ansS = pick(SIGHT);
        var optsS = shuffle([ansS].concat(sample(SIGHT, 3, [ansS])));
        return { mode: 'read', word: ansS, options: optsS, instr: 'Give me the word "' + ansS + '"!', keys: ['instr_feed_1', 'sight_' + ansS], answer: ansS };
    }
    var pool = kg === 'kg2' ? WORDS2.concat(WORDS3) : (lvl < 2 ? WORDS1 : lvl < 4 ? WORDS1.concat(WORDS2) : ALLWORDS);
    var ans = pick(pool);
    var opts = shuffle([ans].concat(sample(pool, 3, [ans])));
    return { mode: 'pic', word: ans, options: opts, instr: 'Give me the ' + ans + '!', keys: ['instr_feed_1', 'word_' + ans], answer: ans };
};
GAMES.spelling.gen = function (lvl, kg) {
    var pool = kg === 'kg2' ? WORDS2.concat(WORDS3) : (lvl < 2 ? WORDS1 : lvl < 4 ? WORDS2 : WORDS3);
    var ans = pick(pool);
    var keys = ['instr_train_1'].concat(ans.split('').map(function (c) { return 'letter_' + c; }));
    keys.push('word_' + ans);
    return { word: ans, tiles: shuffle(ans.split('').map(function (c, i) { return { c: c, id: i }; })), instr: 'Build the word!', keys: keys, answer: ans };
};
GAMES.counting.gen = function (lvl, kg) {
    var max = kg === 'kg2' ? (lvl < 2 ? 10 : lvl < 4 ? 15 : 20) : (lvl < 2 ? 5 : 10);
    var n = 1 + rnd(max);
    var img = pick(CNTIMG);
    var extra = Math.min(4, Math.ceil(n / 3));
    return { n: n, img: img, total: n + extra, got: 0, instr: 'Give me ' + n + ' ' + (n === 1 ? 'piece' : 'pieces') + '!', keys: ['instr_count_1', 'num_' + n, 'instr_count_2'], answer: n };
};
GAMES.math.gen = function (lvl, kg) {
    var max = kg === 'kg2' ? (lvl < 2 ? 10 : 20) : 5;
    var a = 1 + rnd(max), b = 1 + rnd(max), op = pick(['+', '-']);
    if (op === '-' && b > a) { var t = a; a = b; b = t; }
    var ans = op === '+' ? a + b : a - b;
    var opts = {}; opts[ans] = 1;
    while (Object.keys(opts).length < 4) opts[Math.max(0, ans + rnd(7) - 3)] = 1;
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
        var sun = this.add.image(W - 52, 100, 'sun').setScale(.34).setAlpha(.9);
        this.tweens.add({ targets: sun, angle: 360, duration: 36000, repeat: -1 });
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
        var conf = this.add.particles(0, -10, 'conf', {
            x: { min: 0, max: W }, speedY: { min: 120, max: 300 }, speedX: { min: -60, max: 60 },
            scale: { min: .5, max: 1.1 }, lifespan: 2200, rotate: { min: 0, max: 360 },
            tint: [0xf472b6, 0x38bdf8, 0x4ade80, 0xffd93d, 0xc084fc, 0xfb923c], emitting: false
        });
        conf.explode(36);
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
        var tintPool = [0xffc7dd, 0xbfe6ff, 0xc7f9cc, 0xfff3b0, 0xe5ccff, 0xffd9b3];
        var cols = 3, rows = 3;
        cur.chars.forEach(function (ch, i) {
            var gx = 70 + (i % cols) * 125 + rnd(20) - 10;
            var gy = 240 + Math.floor(i / cols) * 185 + rnd(20) - 10;
            var c = s.add.container(gx, gy);
            var bub = s.add.image(0, 0, 'bubble').setScale(.62).setTint(tintPool[i % tintPool.length]);
            var txt = s.add.text(0, -4, ch, { fontSize: '44px', fontStyle: '900', color: '#2d2340' }).setOrigin(.5);
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
                    s.popParticles(c.x, c.y, [tintPool[i % tintPool.length], 0xffffff]);
                    s.tweens.add({ targets: c, scaleX: 1.5, scaleY: 1.5, alpha: 0, duration: 220, onComplete: function () { c.destroy(); } });
                    if (!(state && state.muted)) VO.mini();
                    cur.hits++;
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
        var word = cur.word, L = word.length;
        /* word picture */
        var pic = this.add.image(W / 2, 235, 'w_' + word);
        pic.setScale(Math.min(110 / pic.width, 110 / pic.height));
        this.track(pic);
        this.bobTween(pic, 8, 1600);
        /* slots (train cars) */
        var slotW = 62, gap = 8;
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
        /* letter tiles */
        cur.tiles.forEach(function (tile, i) {
            var tx = 55 + (i % 4) * 95, ty = 560 + Math.floor(i / 4) * 110;
            var t = s.add.container(tx, ty);
            var im = s.add.image(0, 0, 'tile_' + tile.c.toUpperCase()).setScale(.5);
            t.add(im);
            t.setSize(84, 84);
            t.setInteractive({ useHandCursor: true });
            t.setScale(0);
            s.tweens.add({ targets: t, scaleX: 1, scaleY: 1, duration: 380, delay: 120 + i * 70, ease: 'Back.easeOut' });
            s.bobTween(t, 6, 1300 + i * 120);
            t.on('pointerdown', function () {
                if (s.roundLock || t.dead) return;
                var need = word[s.placedCount];
                if (tile.c === need) {
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
                    if (!(state && state.muted)) VO.say('letter_' + tile.c);
                    s.placedCount++;
                    if (s.placedCount >= L) {
                        /* train chugs off */
                        if (!(state && state.muted)) VO.say('word_' + word);
                        s.roundObjs.forEach(function (o) {
                            s.tweens.add({ targets: o, x: o.x + W + 200, duration: 900, delay: 500, ease: 'Quad.easeIn' });
                        });
                        var smoke = s.add.particles(W / 2, 360, 'dot', {
                            speed: { min: 30, max: 90 }, angle: { min: 240, max: 300 },
                            scale: { start: 1.6, end: 0 }, alpha: { start: .5, end: 0 },
                            lifespan: 900, tint: 0xffffff, frequency: 90, emitting: true
                        });
                        s.track(smoke);
                        s.time.delayedCall(1400, function () { smoke.destroy(); });
                        s.time.delayedCall(600, function () { s.win(); });
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
        /* mascot waiting */
        var m = mascotWithFace(this, W - 92, 205, 120);
        this.track(m);
        makeSquish(this, m, 1);
        /* big counter */
        this.cntTxt = this.add.text(90, 205, '0', { fontSize: '54px', fontStyle: '900', color: '#e07f1a' }).setOrigin(.5);
        this.track(this.cntTxt);
        /* picnic blanket */
        var bl = this.add.graphics();
        bl.fillStyle(0xff8fa3, 1).fillRoundedRect(24, 300, W - 48, 420, 30);
        bl.lineStyle(4, 0xffffff, .8);
        for (var lx = 44; lx < W - 40; lx += 46) { bl.lineBetween(lx, 308, lx, 712); }
        for (var ly = 316; ly < 712; ly += 46) { bl.lineBetween(30, ly, W - 30, ly); }
        this.track(bl);
        /* items */
        var key = cntKey(cur.img);
        var placed = [];
        for (var i = 0; i < cur.total; i++) {
            (function (i) {
                var px, py, ok = false, tries = 0;
                while (!ok && tries++ < 60) {
                    px = 60 + rnd(W - 120); py = 340 + rnd(340);
                    ok = placed.every(function (p) { var dx = p[0] - px, dy = p[1] - py; return dx * dx + dy * dy > 58 * 58; });
                }
                placed.push([px, py]);
                var it = s.add.image(px, py, key);
                it.setScale(Math.min(54 / it.width, 54 / it.height));
                it.setInteractive({ useHandCursor: true });
                it.setScale(0);
                s.tweens.add({ targets: it, scaleX: Math.min(54 / it.width, 54 / it.height), scaleY: Math.min(54 / it.width, 54 / it.height), duration: 340, delay: 80 + i * 60, ease: 'Back.easeOut' });
                it.on('pointerdown', function () {
                    if (s.roundLock || it.dead) return;
                    it.dead = true;
                    cur.got++;
                    s.cntTxt.setText(String(cur.got));
                    s.tweens.add({ targets: s.cntTxt, scaleX: 1.7, scaleY: 1.7, duration: 140, yoyo: true });
                    if (!(state && state.muted)) VO.say('num_' + cur.got);
                    s.tweens.add({
                        targets: it, x: m.x, y: m.y + 10, scaleX: .15, scaleY: .15, duration: 380, ease: 'Quad.easeIn',
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
                    s.popParticles(hit.x, hit.y, [0xffffff, 0xffd93d]);
                    if (!(state && state.muted)) VO.mini();
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
