'use strict';
/* ================= Phaser scenes ================= */
var W = 390, H = 844;

/* ---------- Boot: preload all assets ---------- */
class BootScene extends Phaser.Scene {
    constructor() { super('boot'); }
    preload() {
        var fill = document.getElementById('boot-fill');
        this.load.on('progress', function (p) { if (fill) fill.style.width = Math.round(p * 100) + '%'; });
        this.load.setPath('assets');
        Object.keys(THEMES).forEach(function (k) { var t = THEMES[k]; this.load.image('theme_' + k, t.img); if (t.imgCheer) this.load.image('theme_' + k + '_cheer', t.imgCheer); }, this);
        ['owl', 'frog'].forEach(function (a) { this.load.image('an_' + a, 'animals/' + a + '.png'); }, this);
        this.load.image('bg_grass', 'bg/grass.png');
        ['run', 'pond', 'space', 'workshop'].forEach(function (b) { this.load.image('bg_' + b, 'bg/' + b + '.jpg'); }, this);
        this.load.image('sun', 'bg/sun.png');
        ['cloud1', 'cloud3', 'cloud4'].forEach(function (c) { this.load.image(c, 'bg/' + c + '.png'); }, this);
        this.load.image('tree', 'bg/tree.png');
        this.load.image('treePine', 'bg/treePine.png');
        this.load.image('bush1', 'bg/bush1.png');
        this.load.image('bush2', 'bg/bush2.png');
        this.load.image('bubble', 'fx/bubble.png');
        ['fish', 'fish2'].forEach(function (f) { this.load.image('food_' + f, 'food/' + f + '.png'); }, this);
        ['donut1', 'donut2', 'donut3', 'carrot', 'carrot_gold', 'cake'].forEach(function (f) { this.load.image('food_' + f, 'food/' + f + '.png'); }, this);
        this.load.image('tile_star', 'tiles/star.png');
        this.load.image('tile_heart', 'tiles/heart.png');
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (c) { this.load.image('tile_' + c, 'tiles/tile' + c + '.png'); }, this);
        ['red', 'green', 'blue', 'orange'].forEach(function (c) { this.load.image('ship_' + c, 'ships/' + c + '.png'); }, this);
        ['circle', 'square', 'rhombus'].forEach(function (s) {
            ['red', 'blue', 'green', 'pink'].forEach(function (c) { this.load.image('shape_' + c + '_' + s, 'shapes/' + c + '_' + s + '.png'); }, this);
        }, this);
        ['face_a', 'face_b', 'face_c', 'face_d', 'face_e'].forEach(function (f) { this.load.image(f, 'shapes/' + f + '.png'); }, this);
        ['stand', 'walk1', 'walk2', 'jump', 'ready', 'hurt'].forEach(function (p) { this.load.image('bunny_' + p, 'bunny/bunny1_' + p + '.png'); }, this);
        Object.keys(WIMG).forEach(function (w) { this.load.image('w_' + w, WIMG[w]); }, this);
        Object.keys(STORY_ART_HAS).forEach(function (sid) { for (var pi = 1; pi <= 5; pi++) this.load.image('storyart_' + sid + '_p' + pi, 'story/' + sid + '_p' + pi + '.jpg'); }, this);
        Object.keys(GAMES).forEach(function (gid) { this.load.image('icon_' + gid, 'icons/' + gid + '.png'); }, this);
        for (var d = 0; d <= 9; d++) this.load.image('tile_' + d, 'tiles/tile' + d + '.png');
        /* photo face (data URL) loads on demand in HomeScene */
    }
    create() {
        /* particle textures */
        var g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1).fillCircle(5, 5, 5);
        g.generateTexture('dot', 10, 10); g.clear();
        g.fillStyle(0xffffff, 1).fillRect(0, 0, 9, 13);
        g.generateTexture('conf', 9, 13); g.destroy();
        var bt = document.getElementById('boot'); if (bt) bt.style.display = 'none';
        if (state) this.scene.start('home');
        else DOMScreens.showSetup(this.scene.start.bind(this.scene, 'home'));
    }
}

/* ---------- helpers ---------- */
function addCloud(scene, key, y, dur, scale, delay) {
    var c = scene.add.image(-180, y, key).setScale(scale).setAlpha(.95).setDepth(0);
    scene.tweens.add({ targets: c, x: W + 200, duration: dur, delay: delay || 0, repeat: -1 });
    return c;
}
function makeSquish(scene, img, base) {
    base = base || 1;
    scene.tweens.add({
        targets: img, scaleX: base * 1.04, scaleY: base * .96, duration: 900,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
}

/* ---------- play buddy: the kid's buddy joins gameplay ----------
   Breathing idle + periodic hops; reacts to correct ('yay'), wrong ('no') and 'win'. */
function makePlayBuddy(scene, x, y, size) {
    var k = (state && state.theme) || 'bear';
    var key = 'theme_' + k, ck = key + '_cheer';
    if (!scene.textures.exists(key)) return null;
    var c = scene.add.container(x, y).setDepth(25);
    var sh = scene.add.graphics();
    sh.fillStyle(0x1e2a5e, .14);
    sh.fillEllipse(0, Math.round(size * .52), Math.round(size * .86), Math.round(size * .24));
    c.add(sh);
    var img = scene.add.image(0, 0, key);
    var sc = size / Math.max(img.width, img.height);
    img.setScale(sc);
    c.add(img);
    scene.tweens.add({ targets: img, scaleY: sc * .94, scaleX: sc * 1.03, duration: 950, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    var hop = scene.tweens.add({ targets: c, y: y - size * .16, duration: 300, yoyo: true, repeat: -1, repeatDelay: 3200, ease: 'Quad.easeOut' });
    var busy = false;
    function react(kind) {
        if (!c.active) return;
        if (kind === 'peek') {
            if (busy) return;
            scene.tweens.add({ targets: img, angle: 7, duration: 90, yoyo: true, repeat: 1, onComplete: function () { img.angle = 0; } });
            return;
        }
        if (busy) return;
        if (kind === 'no') {
            busy = true;
            scene.tweens.add({ targets: c, x: x - 10, duration: 65, yoyo: true, repeat: 3, onComplete: function () { c.x = x; busy = false; } });
            scene.tweens.add({ targets: img, angle: -8, duration: 90, yoyo: true, repeat: 3, onComplete: function () { img.angle = 0; } });
            return;
        }
        busy = true;
        var swapped = false;
        if (scene.textures.exists(ck)) { img.setTexture(ck); swapped = true; }
        hop.pause();
        scene.tweens.add({
            targets: c, y: y - (kind === 'win' ? size * .5 : size * .3), duration: kind === 'win' ? 300 : 210,
            yoyo: true, repeat: kind === 'win' ? 2 : 0, ease: 'Quad.easeOut',
            onComplete: function () {
                c.y = y;
                if (swapped && c.active) img.setTexture(key);
                hop.resume(); busy = false;
            }
        });
    }
    return { c: c, react: react };
}

function mascotWithFace(scene, x, y, size) {
    var t = theme();
    var c = scene.add.container(x, y);
    var img = scene.add.image(0, 0, 'theme_' + ((state && state.theme) || setupSel.theme));
    img.setScale(size / img.width);
    c.add(img);
    if (state && state.photo) {
        var w = img.displayWidth, h = img.displayHeight;
        var fx = -w / 2 + (t.fx / 100) * w, fy = -h / 2 + (t.fy / 100) * h, fr = (t.fr / 100) * w / 2;
        var photo = scene.add.image(fx, fy, 'kidface');
        var pr = Math.min(fr * 2 / photo.width, fr * 2 / photo.height) * (state.faceTf ? state.faceTf.s : 1);
        photo.setScale(pr);
        if (state.faceTf) { photo.x += (state.faceTf.x / 100) * w; photo.y += (state.faceTf.y / 100) * h; photo.setRotation((state.faceTf.r || 0) * Math.PI / 180); }
        var mask = scene.make.graphics({ x: 0, y: 0, add: false });
        mask.fillStyle(0xffffff); mask.fillCircle(x + fx, y + fy, fr);
        photo.setMask(mask.createGeometryMask());
        c.add(photo);
    }
    return c;
}

/* ---------- Home scene ---------- */
class HomeScene extends Phaser.Scene {
    constructor() { super('home'); }
    create() {
        var s = this;
        if (state && state.photo && !this.textures.exists('kidface')) {
            this.textures.once('addtexture', function (key) { if (key === 'kidface') s.scene.restart(); });
            this.textures.addBase64('kidface', state.photo);
            return;
        }
        /* world */
        var bg = this.add.image(W / 2, H / 2, 'bg_grass');
        bg.setScale(Math.max(W / bg.width, H / bg.height) * 1.02);
        if (KLSTYLE === 'bubblegum') {
            var tint = this.add.graphics();
            tint.fillGradientStyle(0xff7ab8, 0xff7ab8, 0x8a3ffc, 0x8a3ffc, .16, .16, .14, .14);
            tint.fillRect(0, 0, W, H);
        }
        addCloud(this, 'cloud1', 90, 46000, .45);
        addCloud(this, 'cloud3', 170, 68000, .5, -26000);
        addCloud(this, 'cloud4', 250, 56000, .42, -12000).setAlpha(.75);

        fadeSceneIn(this, 180);
        /* top bar */
        candyPanel(this, 14, 14, 94, 44, 22, 0xffb03d, { lipColor: 0xd17f1a });
        this.add.image(38, 36, 'tile_star').setScale(.24);
        this.starTxt = this.add.text(56, 36, String((state && state.stars) || 0), { fontFamily: FONT_MAIN, fontSize: '22px', fontStyle: '900', color: '#4a2c00' }).setOrigin(0, .5);
        this.muteBtn = this.add.container(W - 116, 38);
        this.muteIc = drawSpeakerIcon(this, 0, 0, 1, 0x3b2a5e, !(state && state.muted));
        this.muteBtn.add(this.muteIc);
        this.muteBtn.setSize(44, 44).setInteractive({ useHandCursor: true });
        this.muteBtn.on('pointerdown', function () {
            state.muted = !state.muted; save();
            if (state.muted) VO.stop();
            s.muteIc.destroy();
            s.muteIc = drawSpeakerIcon(s, 0, 0, 1, 0x3b2a5e, !state.muted);
            s.muteBtn.add(s.muteIc);
        });
        this.gear = this.add.container(W - 56, 38);
        this.gear.add(drawGearIcon(this, 0, 0, 1, 0x3b2a5e));
        this.gear.setSize(44, 44).setInteractive({ useHandCursor: true });
        var holdT = null, taps = 0;
        this.gear.on('pointerdown', function () {
            holdT = s.time.delayedCall(1200, function () { holdT = null; DOMScreens.showParents(); });
        });
        this.gear.on('pointerup', function () {
            if (holdT) { holdT.remove(); holdT = null; taps++; if (taps >= 3) { taps = 0; DOMScreens.showParents(); } else s.time.delayedCall(800, function () { taps = 0; }); }
        });
        this.gear.on('pointerout', function () { if (holdT) { holdT.remove(); holdT = null; } });

        /* mascot + bubble */
        var m = mascotWithFace(this, 64, 140, 96);
        makeSquish(this, m, 1);
        this.tweens.add({ targets: m, y: 130, duration: 420, yoyo: true, repeat: -1, repeatDelay: 2600, ease: 'Quad.easeOut' });
        candyPanel(this, 148, 96, 228, 84, 18, 0xffffff, { border: 0xffd93d, borderW: 3, top: 0xffffff, bottom: 0xfff3d0 });
        var bb = this.add.graphics();
        bb.fillStyle(0xffd93d, 1).fillTriangle(150, 156, 150, 134, 132, 146);
        this.add.text(162, 116, 'Hi, ' + kidName() + '!', { fontFamily: FONT_MAIN, fontSize: '20px', fontStyle: '900', color: '#3b2a5e' });
        this.add.text(162, 146, "Let's play and learn\nwith " + charName() + '!', { fontFamily: FONT_MAIN, fontSize: '13.5px', fontStyle: '700', color: '#7a7194' });

        /* game spots: scrollable grid */
        var world = this.add.container(0, 0);
        var ids = Object.keys(GAMES);
        var lastRow = Math.floor((ids.length - 1) / 2);
        var contentBottom = 258 + lastRow * 106 + 50;
        var minY = Math.min(0, H - contentBottom - 20);
        ids.forEach(function (id, i) {
            var g = GAMES[id];
            var col = SPOTCOLORS[i % SPOTCOLORS.length];
            var modern = KLSTYLE === 'modern';
            var cx = (i % 2 === 0) ? 102 : 288, cy = 258 + Math.floor(i / 2) * 106;
            var btn = s.add.container(cx, cy);
            btn.add(candyPanel(s, -78, -50, 156, 102, 22, modern ? 0xffffff : col[0], modern ? { lip: 0, sheen: false, border: 0xe5e1f0, borderW: 2, shadowA: .10 } : { lipColor: col[1], border: mixCol(col[1], 0x000000, .18), lip: KLSTYLE === 'bubblegum' ? 8 : 5, borderW: KLSTYLE === 'bubblegum' ? 3 : 2, borderA: .6 }));
            var circ = s.add.graphics();
            circ.fillStyle(modern ? mixCol(col[0], 0xffffff, .80) : 0xffffff, 1).fillCircle(0, -26, 23);
            btn.add(circ);
            var ik = 'icon_' + id;
            if (s.textures.exists(ik)) {
                var im = s.add.image(0, -26, ik);
                im.setScale(44 / Math.max(im.width, im.height));
                btn.add(im);
            } else {
                var ico = s.add.image(0, -26, g.ico).setScale((g.icos || .4) * .68);
                if (g.icoTint) ico.setTint(g.icoTint);
                btn.add(ico);
                if (g.icoText) btn.add(s.add.text(0, -26, g.icoText, { fontFamily: FONT_MAIN, fontSize: '18px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            }
            var pastel = KLSTYLE === 'pastel';
            var pStroke = pastel ? ('#' + ('00000' + mixCol(col[1], 0x000000, .25).toString(16)).slice(-6)) : undefined;
            btn.add(s.add.text(0, 2, g.title, { fontFamily: FONT_MAIN, fontSize: '14.5px', fontStyle: '900', color: modern ? ('#' + ('00000' + col[1].toString(16)).slice(-6)) : '#fff', stroke: pStroke, strokeThickness: pastel ? 4 : 0 }).setOrigin(.5));
            btn.add(s.add.text(0, 20, g.sub, { fontFamily: FONT_MAIN, fontSize: '10px', fontStyle: '700', color: modern ? '#8a84a3' : 'rgba(255,255,255,.95)', stroke: pStroke, strokeThickness: pastel ? 3 : 0 }).setOrigin(.5));
            var lv = (state.levels && state.levels[id]) || 1;
            btn.add(s.add.text(0, 36, 'Level ' + lv, { fontFamily: FONT_MAIN, fontSize: '9.5px', fontStyle: '900', color: '#fff', backgroundColor: modern ? ('#' + ('00000' + col[0].toString(16)).slice(-6)) : 'rgba(255,255,255,.3)', padding: { x: 6, y: 2 } }).setOrigin(.5));
            btn.setSize(156, 100);
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerup', function () {
                if (s._scrolled) return;
                SFX.play('tap');
                s.tweens.add({ targets: btn, scaleX: .93, scaleY: .93, duration: 90, yoyo: true });
                s.time.delayedCall(140, function () { startGameScene(s, id); });
            });
            /* entrance bounce + idle sway */
            btn.setScale(0);
            s.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 500, delay: 80 + i * 90, ease: 'Back.easeOut' });
            s.tweens.add({ targets: btn, angle: i % 2 ? 1.4 : -1.4, duration: 2400 + i * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            world.add(btn);
        });
        /* drag-to-scroll */
        this._scrolled = false;
        var drag = null;
        this.input.on('pointerdown', function (p) { drag = { y: p.y, wy: world.y }; s._scrolled = false; });
        this.input.on('pointermove', function (p) {
            if (!drag || !p.isDown) return;
            var dy = p.y - drag.y;
            if (Math.abs(dy) > 10) s._scrolled = true;
            if (s._scrolled) world.y = Math.max(minY, Math.min(0, drag.wy + dy));
        });
        this.input.on('pointerup', function () { drag = null; s.time.delayedCall(60, function () { s._scrolled = false; }); });
        /* scroll hint arrow when content overflows */
        if (minY < 0) {
            var sa = this.add.triangle(W / 2, H - 16, 0, 0, 10, 0, 5, 10, 0xffffff, .9);
            this.tweens.add({ targets: sa, y: H - 26, alpha: .4, duration: 700, yoyo: true, repeat: -1 });
            this.tweens.add({ targets: sa, alpha: 0, delay: 4000, duration: 600, onComplete: function () { sa.destroy(); } });
        }
        VO.hello();
        /* unlock WebAudio on first touch */
        this.input.once('pointerdown', function () { SFX.unlock(); });
    }
}
var SPOTCOLORS = [[0xff6b9d, 0xe04a82], [0x4f8ef7, 0x3a6fd8], [0xff9f43, 0xe07f1a], [0x2ecc71, 0x22a355], [0x9b59f5, 0x7a3fd4], [0xff5f57, 0xe03e36]];
/* art-direction variants for style mockups (?style=bubblegum|pastel|modern) */
var KLSTYLE = '';
try { KLSTYLE = new URLSearchParams(window.location.search).get('style') || ''; } catch (e) {}
if (KLSTYLE === 'bubblegum') SPOTCOLORS = [[0xff4d8d, 0xd92662], [0x3d7bff, 0x1e54e0], [0xff8f1f, 0xe06a00], [0x17c964, 0x0a9e4c], [0x8a3ffc, 0x6920d8], [0xff4d4d, 0xd92b2b]];
if (KLSTYLE === 'pastel') SPOTCOLORS = [[0xf498bd, 0xd975a2], [0x8fb8ee, 0x6a93d4], [0xf6bd82, 0xe09a4e], [0x93d8ab, 0x6bb589], [0xc2a3ea, 0x9a7bcc], [0xee9d95, 0xd0756c]];

function startGameScene(scene, id) {
    var key = GAMES[id] && GAMES[id].scene;
    if (key && scene.scene.get(key)) goScene(scene, key);
}
