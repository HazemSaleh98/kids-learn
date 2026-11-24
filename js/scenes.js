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
        addCloud(this, 'cloud1', 90, 46000, .45);
        addCloud(this, 'cloud3', 170, 68000, .5, -26000);
        addCloud(this, 'cloud4', 250, 56000, .42, -12000).setAlpha(.75);

        /* top bar */
        var pill = this.add.graphics();
        pill.fillStyle(0xffb03d, 1).fillRoundedRect(14, 16, 92, 44, 22);
        this.add.image(38, 38, 'tile_star').setScale(.24);
        this.starTxt = this.add.text(56, 38, String((state && state.stars) || 0), { fontSize: '22px', fontStyle: '900', color: '#4a2c00' }).setOrigin(0, .5);
        this.muteBtn = this.add.text(W - 116, 38, (state && state.muted) ? '🔇' : '🔊', { fontSize: '26px' }).setOrigin(.5).setInteractive({ useHandCursor: true });
        this.muteBtn.on('pointerdown', function () {
            state.muted = !state.muted; save();
            if (state.muted) VO.stop();
            s.muteBtn.setText(state.muted ? '🔇' : '🔊');
        });
        this.gear = this.add.text(W - 56, 38, '⚙️', { fontSize: '26px' }).setOrigin(.5).setInteractive({ useHandCursor: true });
        var holdT = null, taps = 0;
        this.gear.on('pointerdown', function () {
            holdT = s.time.delayedCall(1200, function () { holdT = null; DOMScreens.showParents(); });
        });
        this.gear.on('pointerup', function () {
            if (holdT) { holdT.remove(); holdT = null; taps++; if (taps >= 3) { taps = 0; DOMScreens.showParents(); } else s.time.delayedCall(800, function () { taps = 0; }); }
        });
        this.gear.on('pointerout', function () { if (holdT) { holdT.remove(); holdT = null; } });

        /* mascot + bubble */
        var m = mascotWithFace(this, 92, 190, 130);
        makeSquish(this, m, 1);
        var bb = this.add.graphics();
        bb.fillStyle(0xffffff, 1).fillRoundedRect(168, 130, 206, 96, 20);
        bb.lineStyle(3, 0xffd93d, 1).strokeRoundedRect(168, 130, 206, 96, 20);
        bb.fillStyle(0xffd93d, 1).fillTriangle(168, 196, 168, 170, 148, 186);
        this.add.text(182, 150, 'Hi, ' + kidName() + '! 👋', { fontSize: '21px', fontStyle: '900', color: '#3b2a5e' });
        this.add.text(182, 182, "Let's play and learn\nwith " + charName() + '!', { fontSize: '14.5px', fontStyle: '700', color: '#7a7194' });

        /* game spots */
        var ids = Object.keys(GAMES);
        ids.forEach(function (id, i) {
            var g = GAMES[id];
            var col = SPOTCOLORS[i % SPOTCOLORS.length];
            var cx = (i % 2 === 0) ? 104 : 286, cy = 288 + Math.floor(i / 2) * 124;
            var btn = s.add.container(cx, cy);
            var bg2 = s.add.graphics();
            bg2.fillStyle(col[1], 1).fillRoundedRect(-82, -56, 164, 120, 24); /* shadow lip */
            bg2.fillStyle(col[0], 1).fillRoundedRect(-82, -64, 164, 120, 24);
            btn.add(bg2);
            var circ = s.add.graphics();
            circ.fillStyle(0xffffff, 1).fillCircle(0, -30, 22);
            btn.add(circ);
            var ico = s.add.image(0, -30, g.ico).setScale((g.icos || .4) * .78);
            if (g.icoTint) ico.setTint(g.icoTint);
            btn.add(ico);
            if (g.icoText) btn.add(s.add.text(0, -30, g.icoText, { fontSize: '21px', fontStyle: '900', color: '#3b2a5e' }).setOrigin(.5));
            btn.add(s.add.text(0, 0, g.title, { fontSize: '15.5px', fontStyle: '900', color: '#fff' }).setOrigin(.5));
            btn.add(s.add.text(0, 20, g.sub, { fontSize: '10.5px', fontStyle: '700', color: 'rgba(255,255,255,.92)' }).setOrigin(.5));
            var lv = (state.levels && state.levels[id]) || 1;
            btn.add(s.add.text(0, 39, 'Level ' + lv, { fontSize: '10px', fontStyle: '900', color: '#fff', backgroundColor: 'rgba(255,255,255,.3)', padding: { x: 7, y: 2 } }).setOrigin(.5));
            btn.setSize(164, 120);
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerdown', function () {
                SFX.play('tap');
                s.tweens.add({ targets: btn, scaleX: .93, scaleY: .93, duration: 90, yoyo: true });
                s.time.delayedCall(140, function () { startGameScene(s, id); });
            });
            /* entrance bounce + idle sway */
            btn.setScale(0);
            s.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 500, delay: 80 + i * 90, ease: 'Back.easeOut' });
            s.tweens.add({ targets: btn, angle: i % 2 ? 1.4 : -1.4, duration: 2400 + i * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });
        VO.hello();
        /* unlock WebAudio on first touch */
        this.input.once('pointerdown', function () { SFX.unlock(); });
    }
}
var SPOTCOLORS = [[0xff6b9d, 0xe04a82], [0x4f8ef7, 0x3a6fd8], [0xff9f43, 0xe07f1a], [0x2ecc71, 0x22a355], [0x9b59f5, 0x7a3fd4], [0xff5f57, 0xe03e36]];

function startGameScene(scene, id) {
    var key = GAMES[id] && GAMES[id].scene;
    if (key && scene.scene.get(key)) scene.scene.start(key);
}
