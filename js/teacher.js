'use strict';
/* ================= Teacher Shalabi: English curriculum (letters -> words -> sentences) =================
   Game-based: bubbles to pop, combos, stars, stickers, daily streak, chest. No fail state.
   Voice: Shalabi's personalised clips (assets/audio/ar/fuzzy_*), Miss Lily's English clips for the
   words/letters themselves, and optional Shalabi teaching lines (assets/audio/sh/*, see SH_FILES). */
var SH_FILES = {"lesson_done": true, "letter_listen": true, "letters_party": true, "map_hello": true, "pick_letter": true, "pick_word": true, "sent_build": true, "sent_listen": true, "sent_pick": true, "try_again": true, "word_listen": true};
var Teacher = (function () {
    var root = null, cur = null, seq = 0, L = null;

    /* ---------- curriculum ---------- */
    var LET = {
        A: ['bat', '🦇'], B: ['bear', '🐻'], C: ['cat', '🐱'], D: ['dog', '🐶'], E: ['bed', '🛏️'], F: ['fish', '🐟'], G: ['goat', '🐐'],
        H: ['hen', '🐔'], I: ['pig', '🐷'], J: ['jet', '✈️'], K: ['king', '🤴'], L: ['leaf', '🍃'], M: ['moon', '🌙'], N: ['nose', '👃'],
        O: ['box', '📦'], P: ['panda', '🐼'], Q: ['quiz', '❓'], R: ['rabbit', '🐰'], S: ['sun', '☀️'], T: ['tree', '🌳'], U: ['cup', '🥤'],
        V: ['van', '🚐'], W: ['web', '🕸️'], X: ['fox', '🦊'], Y: ['yak', '🦬'], Z: ['zoo', '🦓']
    };
    var WORLDS = [
        { t: 'Letters', ar: 'الحروف', c1: '#ffb36b', c2: '#ff6b6b', em: '🔤' },
        { t: 'Words', ar: 'الكلمات', c1: '#6fd3ff', c2: '#3b82f6', em: '🖼️' },
        { t: 'Sentences', ar: 'الجمل', c1: '#b79cff', c2: '#7c5cff', em: '💬' }
    ];
    var LESSONS = [];
    function addLet(id, t, ar, ic, st, letters) { LESSONS.push({ id: id, w: 0, kind: 'letters', t: t, ar: ar, ic: ic, st: st, letters: letters }); }
    addLet('l1', 'A B C D E', 'أول خمس حروف', '🅰️', '🌟', 'ABCDE'.split(''));
    addLet('l2', 'F G H I J', 'حروف جديدة', '🐟', '🦄', 'FGHIJ'.split(''));
    addLet('l3', 'K L M N O', 'كمل معايا', '🌙', '🚀', 'KLMNO'.split(''));
    addLet('l4', 'P Q R S T', 'اقتربنا', '🐼', '🎈', 'PQRST'.split(''));
    addLet('l5', 'U V W X Y Z', 'آخر الحروف', '🦓', '👑', 'UVWXYZ'.split(''));
    addLet('l6', 'ABC Party', 'تحدي كل الحروف', '🎉', '🏆', LETTERS_ALL());
    function LETTERS_ALL() { return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); }
    function addWords(id, t, ar, ic, st, words) { LESSONS.push({ id: id, w: 1, kind: 'words', t: t, ar: ar, ic: ic, st: st, words: words }); }
    addWords('w1', 'Animals', 'الحيوانات', '🐶', '🦁', [['cat', '🐱'], ['dog', '🐶'], ['pig', '🐷'], ['hen', '🐔'], ['cow', '🐮'], ['duck', '🦆'], ['frog', '🐸'], ['fish', '🐟']]);
    addWords('w2', 'Yummy Time', 'أكل حلو', '🍰', '🍩', [['cake', '🍰'], ['carrot', '🥕'], ['corn', '🌽'], ['donut', '🍩'], ['fork', '🍴'], ['cup', '🥤']]);
    addWords('w3', 'Go Go Go', 'مواصلات', '🚗', '🏎️', [['car', '🚗'], ['bus', '🚌'], ['bike', '🚲'], ['boat', '⛵'], ['train', '🚂'], ['jet', '✈️']]);
    addWords('w4', 'Sky and Trees', 'الطبيعة', '🌳', '🌈', [['sun', '☀️'], ['moon', '🌙'], ['star', '⭐'], ['tree', '🌳'], ['cloud', '☁️'], ['rain', '🌧️']]);
    addWords('w5', 'Action Time', 'حركة', '🏃', '🥇', [['run', '🏃'], ['sit', '🪑'], ['hop', '🦘'], ['sing', '🎤'], ['read', '📖'], ['kick', '⚽']]);
    addWords('w6', 'My Body', 'جسمي', '👃', '💎', [['nose', '👃'], ['ear', '👂'], ['leg', '🦵'], ['feet', '🦶'], ['lip', '👄'], ['hug', '🤗']]);
    function addSent(id, t, ar, ic, st, s) { LESSONS.push({ id: id, w: 2, kind: 'sent', t: t, ar: ar, ic: ic, st: st, sents: s }); }
    addSent('s1', 'I see...', 'أنا بشوف', '👀', '🔭', [['I see the sun', '☀️'], ['I see the moon', '🌙'], ['I see my dog', '🐶'], ['I see the star', '⭐']]);
    addSent('s2', 'I like...', 'أنا بحب', '❤️', '💖', [['I like cake', '🍰'], ['I like my cat', '🐱'], ['I like to play', '🎮'], ['we like fish', '🐟']]);
    addSent('s3', 'It is...', 'وصف', '🐘', '🎨', [['the dog is big', '🐶'], ['the cat is fat', '🐱'], ['the sun is hot', '☀️'], ['the man is sad', '😢']]);
    addSent('s4', 'I can...', 'أنا أقدر', '💪', '🦸', [['I can run', '🏃'], ['I can hop', '🦘'], ['we can sing', '🎤'], ['he can read', '📖'], ['she can play', '🎮']]);
    addSent('s5', 'Story Time', 'جمل أطول', '📚', '🏅', [['we go to the park', '🌳'], ['the bird is in the tree', '🐦'], ['you can see the bus', '🚌'], ['we go up the hill', '⛰️']]);

    /* ---------- state ---------- */
    function T() { if (!state.teacher) state.teacher = { done: {}, xp: 0, streak: 0, last: '' }; if (!state.teacher.done) state.teacher.done = {}; return state.teacher; }
    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function yesterday() { var d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function touchStreak() {
        var t = T(), td = today();
        if (t.last === td) return;
        t.streak = (t.last === yesterday()) ? (t.streak || 0) + 1 : 1;
        t.last = td; save();
    }
    function unlocked(i) { return i === 0 || !!T().done[LESSONS[i - 1].id]; }
    function doneCount() { var n = 0; LESSONS.forEach(function (l) { if (T().done[l.id]) n++; }); return n; }
    function totalStars() { var n = 0; LESSONS.forEach(function (l) { n += (T().done[l.id] || 0); }); return n; }
    function nextIdx() { for (var i = 0; i < LESSONS.length; i++) if (!T().done[LESSONS[i].id]) return i; return -1; }

    /* ---------- audio ---------- */
    function slug() { return state && state.name ? String(state.name).toLowerCase().replace(/[^a-z0-9]/g, '') : ''; }
    function arHas(k) { return typeof VO_AR_FILES !== 'undefined' && !!VO_AR_FILES[k]; }
    function wkey(w) {
        w = w.toLowerCase();
        if (w === 'i') return 'letter_i';
        if (VO.hasClip('sight_' + w)) return 'sight_' + w;
        if (VO.hasClip('word_' + w)) return 'word_' + w;
        return null;
    }
    function resolve(k) {
        if (k.indexOf('ar:') === 0) { var a = k.slice(3); return arHas(a) ? 'assets/audio/ar/' + a + '.mp3' : null; }
        if (k.indexOf('sh:') === 0) { var s = k.slice(3); return SH_FILES[s] ? 'assets/audio/sh/' + s + '.mp3' : null; }
        return VO.hasClip(k) ? 'assets/audio/' + k + '.mp3' : null;
    }
    function talk(on) { var s = root && root.querySelector('#sh'); if (s) s.classList[on ? 'add' : 'remove']('talk'); }
    function stop() { seq++; if (cur) { try { cur.pause(); } catch (e) {} cur = null; } try { VO.stop(); } catch (e) {} talk(false); }
    var seenSh = {};
    function say(items, onEach, onEnd) {
        stop();
        items = items.filter(function (k) { if (k.indexOf('sh:') !== 0 || k === 'sh:try_again' || k === 'sh:lesson_done' || k === 'sh:map_hello') return true; if (seenSh[k]) return false; seenSh[k] = 1; return true; });
        var id = seq, i = 0;
        talk(true);
        (function next() {
            if (id !== seq) return;
            if (i >= items.length) { talk(false); if (onEnd) onEnd(); return; }
            var idx = i++, k = items[idx], url = resolve(k);
            if (onEach) onEach(idx);
            if (!url || (state && state.muted)) { setTimeout(next, url ? 220 : (k.indexOf('sh:') === 0 ? 0 : 260)); return; }
            var a = new Audio(url), done = false, to;
            cur = a;
            var fin = function () { if (done) return; done = true; clearTimeout(to); setTimeout(next, 60); };
            to = setTimeout(fin, 7000);
            a.onended = fin; a.onerror = fin;
            var p = a.play(); if (p && p.catch) p.catch(fin);
        })();
    }
    function praiseKey() {
        var s = slug(), pool = [], n = 1 + rnd(6);
        if (s) {
            if (arHas('fuzzy_cheer__' + s)) pool.push('ar:fuzzy_cheer__' + s, 'ar:fuzzy_cheer__' + s);
            var h = 'fuzzy_hype_' + (1 + rnd(3)) + '__' + s;
            if (arHas(h)) pool.push('ar:' + h);
            if (VO.hasClip('cheer_' + n + '__' + s)) pool.push('cheer_' + n + '__' + s);
        }
        if (arHas('fuzzy_cheer_1')) pool.push('ar:fuzzy_cheer_1');
        if (arHas('fuzzy_cheer_2')) pool.push('ar:fuzzy_cheer_2');
        if (!pool.length) pool.push('cheer_' + n);
        return pick(pool);
    }
    function helloKey() {
        var s = slug();
        if (s && arHas('fuzzy_hello__' + s)) return 'ar:fuzzy_hello__' + s;
        return arHas('fuzzy_hello') ? 'ar:fuzzy_hello' : 'instr_welcome';
    }
    function hypeKey() {
        var s = slug(), k = 'fuzzy_hype_' + (1 + rnd(3)) + '__' + s;
        if (s && arHas(k)) return 'ar:' + k;
        return praiseKey();
    }

    /* ---------- styles ---------- */
    var css = '<style>'
        + '#teacher{position:fixed;inset:0;z-index:12;overflow:hidden;font-family:"Baloo 2","Baloo Bhaijaan 2",ui-rounded,sans-serif;color:#2b2150;-webkit-user-select:none;user-select:none;background:linear-gradient(180deg,#3aa8ff 0%,#7fd6ff 38%,#c9f0ff 62%,#a7e27f 100%)}'
        + '#teacher *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}'
        + '.tc-wrap{position:absolute;inset:0;max-width:520px;margin:0 auto;display:flex;flex-direction:column}'
        + '.tc-cloud{position:absolute;font-size:64px;opacity:.85;animation:tcdrift 40s linear infinite;pointer-events:none}'
        + '@keyframes tcdrift{from{transform:translateX(-120px)}to{transform:translateX(560px)}}'
        + '.tc-top{display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 12px 6px;position:relative;z-index:3}'
        + '.tc-btn{width:44px;height:44px;border-radius:15px;border:3px solid #fff;background:#fff;box-shadow:0 4px 0 rgba(40,30,110,.22);font-size:20px;font-weight:900;color:#4b3a9a;font-family:inherit;line-height:1}'
        + '.tc-btn:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(40,30,110,.22)}'
        + '.tc-pill{background:#fff;border-radius:999px;padding:4px 12px;font-weight:900;font-size:16px;box-shadow:0 4px 0 rgba(40,30,110,.18);display:flex;gap:5px;align-items:center;white-space:nowrap}'
        + '.tc-title{flex:1;text-align:center;font-weight:900;font-size:21px;color:#fff;text-shadow:0 3px 0 rgba(20,60,150,.45)}'
        + '.tc-scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 14px 40px;position:relative;z-index:2}'
        + '.tc-hero{display:flex;align-items:flex-end;gap:6px;margin:2px 0 8px}'
        + '.tc-hero img{width:150px;flex:none;filter:drop-shadow(0 8px 6px rgba(20,40,100,.3));animation:tcbob 2.6s ease-in-out infinite;transform-origin:50% 100%}'
        + '@keyframes tcbob{50%{transform:translateY(-6px) scale(1.02,.98)}}'
        + '.tc-bub{position:relative;background:#fff;border-radius:22px;padding:10px 14px;box-shadow:0 5px 0 rgba(40,30,110,.16);flex:1;margin-bottom:34px;animation:tcpop .45s cubic-bezier(.2,1.6,.4,1) both}'
        + '.tc-bub:after{content:"";position:absolute;left:-10px;bottom:16px;border:9px solid transparent;border-right-color:#fff;border-left:0}'
        + '.tc-bub .en{font-weight:900;font-size:19px;line-height:1.25;color:#2b2150}'
        + '.tc-bub .ar{font-weight:800;font-size:14px;color:#7a6fb0;margin-top:3px;direction:rtl;text-align:right}'
        + '@keyframes tcpop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}'
        + '.tc-prog{background:rgba(255,255,255,.75);border-radius:18px;padding:8px 12px;margin:0 0 10px;box-shadow:0 4px 0 rgba(40,30,110,.12)}'
        + '.tc-bar{height:14px;border-radius:99px;background:#e3defa;overflow:hidden;margin-top:4px}'
        + '.tc-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#ffd93d,#ff9f1c);transition:width .6s}'
        + '.tc-world{margin:16px 0 8px;border-radius:24px;padding:12px 14px;color:#fff;font-weight:900;display:flex;align-items:center;gap:10px;box-shadow:0 6px 0 rgba(30,20,90,.25);text-shadow:0 2px 0 rgba(0,0,0,.18)}'
        + '.tc-world .e{font-size:30px}.tc-world .t{font-size:21px;line-height:1}.tc-world .a{font-size:14px;opacity:.95;direction:rtl}'
        + '.tc-path{position:relative;padding:4px 0}'
        + '.tc-node{display:flex;align-items:center;gap:12px;margin:10px 0;position:relative}'
        + '.tc-node.r{flex-direction:row-reverse}'
        + '.tc-orb{width:78px;height:78px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:36px;border:5px solid #fff;box-shadow:0 7px 0 rgba(30,20,90,.28);position:relative;font-family:inherit}'
        + '.tc-orb.lock{background:#cfcbe0!important;filter:grayscale(.6);opacity:.9}'
        + '.tc-orb.now{animation:tcpulse 1.4s ease-in-out infinite}'
        + '@keyframes tcpulse{50%{transform:scale(1.1);box-shadow:0 7px 0 rgba(30,20,90,.28),0 0 0 10px rgba(255,255,255,.55)}}'
        + '.tc-orb .stk{position:absolute;right:-8px;top:-10px;font-size:24px;filter:drop-shadow(0 2px 0 rgba(0,0,0,.2))}'
        + '.tc-lab{background:rgba(255,255,255,.88);border-radius:16px;padding:6px 12px;box-shadow:0 4px 0 rgba(30,20,90,.12);min-width:130px}'
        + '.tc-lab b{display:block;font-size:17px;line-height:1.1}.tc-lab small{color:#7a6fb0;font-weight:800;font-size:13px;direction:rtl;display:block}'
        + '.tc-stars{font-size:15px;letter-spacing:1px;margin-top:2px}'
        + '.tc-go{display:block;width:100%;border:none;border-radius:24px;padding:15px;font-size:22px;font-weight:900;color:#5b3b00;background:linear-gradient(180deg,#ffe36b,#ffb52e);box-shadow:0 7px 0 #d98e1f;font-family:inherit;margin:6px 0 10px}'
        + '.tc-go:active{transform:translateY(5px);box-shadow:0 2px 0 #d98e1f}'
        + '.tc-go.sec{background:linear-gradient(180deg,#fff,#e9e4ff);color:#4b3a9a;box-shadow:0 7px 0 #b7aee6}'
        /* lesson */
        + '.tc-seg{display:flex;gap:4px;flex:1}.tc-seg i{flex:1;height:12px;border-radius:99px;background:rgba(255,255,255,.55);transition:background .3s}.tc-seg i.on{background:#ffd93d;box-shadow:0 0 8px #fff}.tc-seg i.cur{background:#fff}'
        + '.tc-stage{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 14px;position:relative;z-index:2;min-height:0}'
        + '.tc-card{background:#fff;border-radius:30px;padding:16px 14px 14px;box-shadow:0 9px 0 rgba(40,30,110,.18);text-align:center;animation:tcslide .45s cubic-bezier(.2,1.3,.4,1) both;position:relative}'
        + '@keyframes tcslide{from{transform:translateX(60px) scale(.92);opacity:0}to{transform:none;opacity:1}}'
        + '.tc-big{font-size:112px;line-height:1.05;font-weight:900;color:#ff6b6b;text-shadow:0 6px 0 rgba(255,107,107,.25);animation:tcbounce 1.8s ease-in-out infinite}'
        + '@keyframes tcbounce{50%{transform:translateY(-8px) rotate(-2deg)}}'
        + '.tc-emo{font-size:96px;line-height:1.1;display:inline-block;animation:tcbounce 2.2s ease-in-out infinite}'
        + '.tc-word{font-size:46px;font-weight:900;letter-spacing:2px;color:#3b2a8c}.tc-word b{color:#ff6b6b}'
        + '.tc-sent{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}'
        + '.tc-tk{border:none;border-radius:16px;padding:8px 14px;font-size:26px;font-weight:900;background:#efeaff;color:#3b2a8c;box-shadow:0 5px 0 #c7bdf0;font-family:inherit;transition:transform .15s}'
        + '.tc-tk.hl{background:#ffd93d;color:#5b3b00;box-shadow:0 5px 0 #d98e1f;transform:scale(1.18) translateY(-3px)}'
        + '.tc-tk.used{opacity:.25;pointer-events:none}'
        + '.tc-tk:active{transform:translateY(4px);box-shadow:0 1px 0 #c7bdf0}'
        + '.tc-hear{display:inline-flex;align-items:center;gap:6px;border:none;border-radius:99px;padding:8px 18px;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(180deg,#5ac8fa,#2f7df6);box-shadow:0 5px 0 #1d5bc0;font-family:inherit;margin-top:8px}'
        + '.tc-hear:active{transform:translateY(4px);box-shadow:0 1px 0 #1d5bc0}'
        + '.tc-opts{display:grid;gap:12px;margin-top:12px;grid-template-columns:repeat(3,1fr)}'
        + '.tc-opt{aspect-ratio:1;border:4px solid #fff;border-radius:50%;font-size:54px;font-weight:900;display:flex;align-items:center;justify-content:center;font-family:inherit;color:#3b2a8c;background:radial-gradient(circle at 30% 25%,#fff,#d6ecff 55%,#9fd0ff);box-shadow:0 8px 0 rgba(40,30,110,.22),inset 0 -6px 12px rgba(80,140,255,.25);animation:tcfloat 2.4s ease-in-out infinite}'
        + '.tc-opt:nth-child(2){animation-delay:-.8s;background:radial-gradient(circle at 30% 25%,#fff,#ffe3f0 55%,#ffb0d4)}'
        + '.tc-opt:nth-child(3){animation-delay:-1.6s;background:radial-gradient(circle at 30% 25%,#fff,#e1ffd6 55%,#a3e88a)}'
        + '.tc-opt.txt{font-size:26px;border-radius:30px;aspect-ratio:auto;padding:22px 4px}'
        + '@keyframes tcfloat{50%{transform:translateY(-9px)}}'
        + '.tc-opt.pop{animation:tcburst .45s ease-out both}'
        + '@keyframes tcburst{40%{transform:scale(1.4)}100%{transform:scale(0);opacity:0}}'
        + '.tc-opt.no{animation:tcshake .45s both}'
        + '@keyframes tcshake{20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}'
        + '.tc-slots{display:flex;gap:8px;justify-content:center;margin:6px 0 10px;flex-wrap:wrap}'
        + '.tc-slot{min-width:46px;height:58px;border-radius:14px;border:3px dashed #b7aee6;background:#f6f3ff;font-size:36px;font-weight:900;color:#3b2a8c;display:flex;align-items:center;justify-content:center;padding:0 8px;font-family:inherit}'
        + '.tc-slot.f{border-style:solid;background:#fff;border-color:#7c5cff}'
        + '.tc-slot.ok{background:#b8f5c0;border-color:#34c759}'
        + '.tc-tiles{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px}'
        + '.tc-foot{display:flex;align-items:flex-end;gap:4px;padding:6px 12px max(10px,env(safe-area-inset-bottom));position:relative;z-index:3}'
        + '.tc-foot .tc-bub{margin-bottom:26px}'
        + '#sh{width:140px;flex:none;position:relative;transform-origin:50% 100%;animation:tcbob 2.6s ease-in-out infinite}'
        + '#sh img{width:100%;display:block;filter:drop-shadow(0 8px 6px rgba(20,40,100,.3))}'
        + '#sh.talk img{animation:tctalk .38s ease-in-out infinite}'
        + '@keyframes tctalk{0%,100%{transform:scale(1,1)}50%{transform:scale(1.04,.96) rotate(-1.5deg)}}'
        + '#sh.jump{animation:tcjump .7s ease-out}'
        + '@keyframes tcjump{0%{transform:translateY(0)}35%{transform:translateY(-46px) rotate(-6deg) scale(1.08)}65%{transform:translateY(0) scale(1.06,.92)}100%{transform:none}}'
        + '#sh.shake{animation:tcshake .5s}'
        + '.tc-combo{position:absolute;top:-6px;right:6px;background:linear-gradient(180deg,#ff9f1c,#ff4d4d);color:#fff;font-weight:900;font-size:20px;padding:4px 12px;border-radius:99px;box-shadow:0 4px 0 #b52a2a;animation:tcpop .4s both;z-index:5}'
        + '.tc-spark{position:fixed;pointer-events:none;z-index:30;font-size:28px;animation:tcspark .9s ease-out forwards}'
        + '@keyframes tcspark{from{opacity:1;transform:translate(0,0) scale(.6)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.5) rotate(var(--r))}}'
        + '.tc-conf{position:absolute;top:-30px;font-size:26px;z-index:20;pointer-events:none;animation:tcfall linear forwards}'
        + '@keyframes tcfall{to{transform:translateY(110vh) rotate(540deg)}}'
        + '.tc-res{text-align:center}'
        + '.tc-res .st{font-size:64px;display:flex;justify-content:center;gap:6px}'
        + '.tc-res .st span{display:inline-block;animation:tcstar .7s cubic-bezier(.2,1.8,.4,1) both}'
        + '.tc-res .st span.off{filter:grayscale(1);opacity:.35}'
        + '@keyframes tcstar{from{transform:scale(0) rotate(-120deg)}to{transform:scale(1) rotate(0)}}'
        + '.tc-chest{font-size:84px;display:block;margin:6px auto;border:none;background:none;animation:tcwob 1s ease-in-out infinite}'
        + '@keyframes tcwob{25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}'
        + '.tc-album{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:8px}'
        + '.tc-sticker{aspect-ratio:1;border-radius:20px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;box-shadow:0 5px 0 rgba(30,20,90,.15)}'
        + '.tc-sticker.lock{background:rgba(255,255,255,.45);filter:grayscale(1) brightness(1.1);opacity:.6;font-size:30px}'
        + '</style>';

    /* ---------- helpers ---------- */
    function h(t) { return esc(t); }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function nm() { return kidName(); }
    function mount() {
        if (root) return;
        root = document.createElement('div');
        root.id = 'teacher';
        document.body.appendChild(root);
    }
    function render(html) { root.innerHTML = css + html; }
    function clouds() { return '<span class="tc-cloud" style="top:70px;left:0">☁️</span><span class="tc-cloud" style="top:230px;animation-duration:60s;animation-delay:-20s;font-size:48px">☁️</span>'; }
    function spark(x, y, em, n) {
        for (var i = 0; i < n; i++) {
            var s = document.createElement('span');
            s.className = 'tc-spark';
            s.textContent = em[i % em.length];
            s.style.left = x + 'px'; s.style.top = y + 'px';
            var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
            s.style.setProperty('--dx', Math.cos(a) * d + 'px');
            s.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
            s.style.setProperty('--r', (Math.random() * 360 - 180) + 'deg');
            root.appendChild(s);
            setTimeout((function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(s), 1000);
        }
    }
    function confetti() {
        var em = ['🎉', '⭐', '🎊', '✨', '💙', '🌟'];
        for (var i = 0; i < 36; i++) {
            var s = document.createElement('span');
            s.className = 'tc-conf';
            s.textContent = em[i % em.length];
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDuration = (2 + Math.random() * 2.2) + 's';
            s.style.animationDelay = (Math.random() * .8) + 's';
            root.appendChild(s);
            setTimeout((function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(s), 5200);
        }
    }
    function sfx(n) { try { SFX.play(n); } catch (e) {} }
    function shAnim(cls) {
        var s = root.querySelector('#sh'); if (!s) return;
        s.classList.remove('jump', 'shake'); void s.offsetWidth; s.classList.add(cls);
        setTimeout(function () { s.classList.remove(cls); }, 800);
    }
    function bubble(en, ar) {
        var b = root.querySelector('#bub'); if (!b) return;
        b.innerHTML = '<div class="en">' + h(en) + '</div>' + (ar ? '<div class="ar">' + h(ar) + '</div>' : '');
        var c = b.cloneNode(true); b.parentNode.replaceChild(c, b);
    }
    function wireShalabi() {
        var s = root.querySelector('#sh');
        if (!s) return;
        s.addEventListener('click', function () {
            sfx('pop'); shAnim('jump');
            var pool = [];
            if (arHas('fuzzy_cheer_1')) pool.push('ar:fuzzy_cheer_1');
            if (arHas('fuzzy_cheer_2')) pool.push('ar:fuzzy_cheer_2');
            if (!pool.length) pool.push(praiseKey());
            say([pick(pool)]);
            var r = rnd(3);
            bubble(['Hehe! That tickles!', 'I love teaching you!', 'Keep going, champ!'][r], ['هههه بتضحكني!', 'بحب أعلمك!', 'كمل يا بطل!'][r]);
        });
    }

    /* ---------- map (the classroom) ---------- */
    function showMap() {
        mount(); stop(); L = null; touchStreak();
        var t = T(), n = doneCount(), pct = Math.round(n / LESSONS.length * 100), ni = nextIdx();
        var html = '<div class="tc-wrap">' + clouds()
            + '<div class="tc-top"><button class="tc-btn" id="tc-back">🏠</button><div class="tc-title">Teacher Shalabi</div>'
            + '<div class="tc-pill">🔥 ' + (t.streak || 0) + '</div></div>'
            + '<div class="tc-scroll">'
            + '<div class="tc-hero"><div id="sh" style="width:150px"><img src="assets/teacher/shalabi_duo.png" alt=""></div>'
            + '<div class="tc-bub" id="bub"></div></div>'
            + '<div class="tc-prog"><div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px"><span>⭐ ' + totalStars() + ' / ' + LESSONS.length * 3 + '</span><span>' + n + ' / ' + LESSONS.length + '</span></div><div class="tc-bar"><i style="width:' + pct + '%"></i></div></div>';
        if (ni >= 0) html += '<button class="tc-go" id="tc-cont">▶ ' + (n === 0 ? 'Start with Shalabi' : 'Next lesson') + '</button>';
        else html += '<button class="tc-go" id="tc-cont">🏆 Play again</button>';
        var lastW = -1;
        LESSONS.forEach(function (l, i) {
            if (l.w !== lastW) {
                lastW = l.w;
                var W2 = WORLDS[l.w];
                html += '<div class="tc-world" style="background:linear-gradient(135deg,' + W2.c1 + ',' + W2.c2 + ')"><span class="e">' + W2.em + '</span><div><div class="t">' + W2.t + '</div><div class="a">' + W2.ar + '</div></div></div><div class="tc-path">';
            }
            var W3 = WORLDS[l.w], ok = unlocked(i), st = t.done[l.id] || 0, now = ok && !st && i === ni;
            html += '<div class="tc-node' + (i % 2 ? ' r' : '') + '"><button class="tc-orb' + (ok ? '' : ' lock') + (now ? ' now' : '') + '" data-i="' + i + '" style="background:linear-gradient(135deg,' + W3.c1 + ',' + W3.c2 + ')">' + (ok ? l.ic : '🔒') + (st ? '<span class="stk">' + l.st + '</span>' : '') + '</button>'
                + '<div class="tc-lab"><b>' + h(l.t) + '</b><small>' + h(l.ar) + '</small><div class="tc-stars">' + (ok ? [1, 2, 3].map(function (k) { return k <= st ? '⭐' : '☆'; }).join('') : '') + '</div></div></div>';
            var nextW = LESSONS[i + 1] ? LESSONS[i + 1].w : -1;
            if (nextW !== l.w) html += '</div>';
        });
        html += '<button class="tc-go sec" id="tc-album" style="margin-top:18px">🎁 My stickers (' + n + ' / ' + LESSONS.length + ')</button></div></div>';
        render(html);
        wireShalabi();
        var greet = n === 0
            ? ['Hi ' + nm() + '! I am Shalabi, your English teacher. Ready to play?', 'أهلاً يا ' + nm() + '! أنا شلبي معلمك. جاهز نلعب؟']
            : (ni >= 0 ? ['Welcome back, ' + nm() + '! Let us play the next game.', 'نورت يا ' + nm() + '! يلا نكمل.'] : ['You finished everything, ' + nm() + '! You are a champion!', 'خلصت كل حاجة يا بطل!']);
        bubble(greet[0], greet[1]);
        say(['sh:map_hello', helloKey()]);
        root.querySelector('#tc-back').onclick = function () { sfx('tap'); close(); };
        root.querySelector('#tc-album').onclick = function () { sfx('tap'); showAlbum(); };
        root.querySelector('#tc-cont').onclick = function () { sfx('tap'); startLesson(ni >= 0 ? ni : 0); };
        root.querySelectorAll('.tc-orb').forEach(function (b) {
            b.onclick = function () {
                var i = Number(b.getAttribute('data-i'));
                if (!unlocked(i)) {
                    sfx('buzz'); b.style.animation = 'tcshake .4s';
                    bubble('Finish the game before this one to unlock it!', 'خلّص اللي قبلها الأول عشان تفتح دي!');
                    return;
                }
                sfx('tap'); startLesson(i);
            };
        });
        var sc = root.querySelector('.tc-scroll');
        var now = root.querySelector('.tc-orb.now');
        if (now && n > 0) setTimeout(function () { try { sc.scrollTop = Math.max(0, now.offsetTop - 220); } catch (e) {} }, 60);
    }
    function showAlbum() {
        stop();
        var t = T(), html = '<div class="tc-wrap">' + clouds() + '<div class="tc-top"><button class="tc-btn" id="tc-back">←</button><div class="tc-title">My Stickers</div><div class="tc-pill">🎁 ' + doneCount() + '</div></div><div class="tc-scroll"><div class="tc-prog" style="text-align:center;font-weight:900">Finish games to collect every sticker!<div style="font-size:13px;color:#7a6fb0;direction:rtl">كمّل الألعاب عشان تجمع كل الاستيكرز</div></div><div class="tc-album">';
        LESSONS.forEach(function (l) { html += '<div class="tc-sticker' + (t.done[l.id] ? '' : ' lock') + '">' + (t.done[l.id] ? l.st : '❔') + '</div>'; });
        html += '</div></div></div>';
        render(html);
        root.querySelector('#tc-back').onclick = function () { sfx('tap'); showMap(); };
    }
    function close() {
        stop();
        if (root && root.parentNode) root.parentNode.removeChild(root);
        root = null; L = null;
        if (window.KLGame) { try { KLGame.scene.start('home'); } catch (e) {} }
    }

    /* ---------- lesson engine ---------- */
    function pickN(arr, n, not) { return shuffle(arr.filter(function (x) { return x !== not; })).slice(0, n); }
    function buildSteps(l) {
        var steps = [], qs = [];
        if (l.kind === 'letters') {
            var ls = l.letters.length > 8 ? shuffle(l.letters).slice(0, 6) : l.letters;
            if (l.letters.length <= 8) ls.forEach(function (c) { steps.push({ t: 'learnL', c: c }); });
            else steps.push({ t: 'intro' });
            var all = LETTERS_ALL(), types = ['name', 'sound', 'start'];
            var n = l.letters.length > 8 ? 8 : 7;
            for (var i = 0; i < n; i++) {
                var c = ls[i % ls.length], ty = types[i % 3];
                if (ty === 'start' && LET[c][0].charAt(0).toUpperCase() !== c) ty = i % 2 ? 'name' : 'sound';
                qs.push({ t: 'pickL', c: c, ty: ty, opts: shuffle([c].concat(pickN(l.letters.length >= 4 ? l.letters : all, 2, c))) });
            }
        } else if (l.kind === 'words') {
            l.words.forEach(function (w) { steps.push({ t: 'learnW', w: w }); });
            var ws = shuffle(l.words);
            for (var j = 0; j < 7; j++) {
                var w = ws[j % ws.length], ty2 = ['hear', 'see', 'spell'][j % 3];
                if (ty2 === 'spell' && w[0].length > 5) ty2 = 'hear';
                var others = pickN(l.words, 2, w);
                qs.push({ t: 'pickW', w: w, ty: ty2, opts: shuffle([w].concat(others)) });
            }
        } else {
            l.sents.forEach(function (s) { steps.push({ t: 'learnS', s: s }); });
            var ss = shuffle(l.sents);
            for (var k = 0; k < Math.max(4, ss.length); k++) {
                var s2 = ss[k % ss.length], ty3 = k % 2 ? 'listen' : 'build';
                qs.push({ t: 'sent', s: s2, ty: ty3, opts: shuffle([s2].concat(pickN(l.sents, 2, s2))) });
            }
        }
        return steps.concat(qs);
    }
    function startLesson(i) {
        var l = LESSONS[i];
        seenSh = {};
        L = { i: i, l: l, steps: buildSteps(l), p: 0, miss: 0, combo: 0, best: 0, tries: 0 };
        touchStreak();
        showStep();
    }
    function frame(inner, bubEn, bubAr) {
        var segs = '';
        for (var k = 0; k < L.steps.length; k++) segs += '<i class="' + (k < L.p ? 'on' : (k === L.p ? 'cur' : '')) + '"></i>';
        return '<div class="tc-wrap">' + clouds()
            + '<div class="tc-top"><button class="tc-btn" id="tc-x">✕</button><div class="tc-seg">' + segs + '</div><div class="tc-pill">🔥 ' + L.combo + '</div></div>'
            + '<div class="tc-stage">' + inner + '</div>'
            + '<div class="tc-foot"><div id="sh"><img src="assets/teacher/shalabi_duo.png" alt=""></div><div class="tc-bub" id="bub"><div class="en">' + h(bubEn || '') + '</div>' + (bubAr ? '<div class="ar">' + h(bubAr) + '</div>' : '') + '</div></div></div>';
    }
    function wireCommon() {
        root.querySelector('#tc-x').onclick = function () { sfx('tap'); showMap(); };
        wireShalabi();
    }
    function nextStep() { L.p++; L.tries = 0; if (L.p >= L.steps.length) showResult(); else showStep(); }
    function showStep() {
        var s = L.steps[L.p];
        ({ intro: stepIntro, learnL: stepLearnL, learnW: stepLearnW, learnS: stepLearnS, pickL: stepPickL, pickW: stepPickW, sent: stepSent })[s.t](s);
    }
    function nextBtn(label) { return '<button class="tc-go" id="tc-next" style="margin-top:14px">' + (label || 'Next ➡️') + '</button>'; }
    function hearBtn() { return '<button class="tc-hear" id="tc-hear">🔊 Hear it</button>'; }

    function stepIntro() {
        render(frame('<div class="tc-card"><div class="tc-big" style="font-size:72px">ABC</div><div style="font-weight:900;font-size:22px">Alphabet party!</div>' + nextBtn("Let's go! 🎉") + '</div>',
            'Pop the right bubbles and show me all the letters!', 'فرقع الفقاعات الصح وورّيني كل الحروف!'));
        wireCommon();
        say(['sh:letters_party']);
        root.querySelector('#tc-next').onclick = function () { sfx('tap'); nextStep(); };
    }
    function hl(word, c) {
        var out = '';
        word.split('').forEach(function (ch) { out += (ch.toUpperCase() === c ? '<b>' + ch + '</b>' : ch); });
        return out;
    }
    function stepLearnL(s) {
        var c = s.c, w = LET[c][0], e = LET[c][1];
        render(frame('<div class="tc-card"><div class="tc-big" id="tc-big">' + c + c.toLowerCase() + '</div>'
            + '<div class="tc-emo" id="tc-emo" style="font-size:72px">' + e + '</div><div class="tc-word" style="font-size:36px">' + hl(w, c) + '</div>'
            + hearBtn() + nextBtn() + '</div>',
            'This is ' + c + '! Listen and say it with me.', 'ده حرف ' + c + '! اسمع وقول معايا.'));
        wireCommon();
        var play = function () {
            say(['sh:letter_listen', 'letter_' + c.toLowerCase(), 'ph_' + c.toLowerCase(), wkey(w) || '']);
            var big = root.querySelector('#tc-big'); if (big) { big.style.animation = 'none'; void big.offsetWidth; big.style.animation = ''; }
        };
        play();
        root.querySelector('#tc-hear').onclick = function () { sfx('pop'); play(); };
        root.querySelector('#tc-big').onclick = function () { sfx('pop'); say(['letter_' + c.toLowerCase()]); };
        root.querySelector('#tc-emo').onclick = function () { sfx('pop'); say([wkey(w) || '']); spark(innerWidth / 2, innerHeight / 3, ['✨', e], 6); };
        root.querySelector('#tc-next').onclick = function () { sfx('tap'); nextStep(); };
    }
    function stepLearnW(s) {
        var w = s.w[0], e = s.w[1];
        render(frame('<div class="tc-card"><div class="tc-emo" id="tc-emo">' + e + '</div><div class="tc-word" id="tc-w">' + h(w) + '</div>' + hearBtn() + nextBtn() + '</div>',
            'This is a ' + w + '. Say it with me: ' + w + '!', 'ده ' + w + '. قول معايا: ' + w + '!'));
        wireCommon();
        var play = function () { say(['sh:word_listen', wkey(w) || '']); spark(innerWidth / 2, innerHeight / 3, ['✨', '⭐'], 6); };
        play();
        root.querySelector('#tc-hear').onclick = function () { sfx('pop'); play(); };
        root.querySelector('#tc-emo').onclick = function () { sfx('pop'); say([wkey(w) || '']); };
        root.querySelector('#tc-next').onclick = function () { sfx('tap'); nextStep(); };
    }
    function sentHtml(words, cls) {
        return '<div class="tc-sent" id="tc-sent">' + words.map(function (w, i) { return '<span class="tc-tk ' + (cls || '') + '" data-k="' + i + '" style="pointer-events:none">' + h(i === 0 ? cap(w) : w) + '</span>'; }).join('') + '</div>';
    }
    function readSentence(words, done) {
        var keys = words.map(function (w) { return wkey(w) || ''; });
        say(keys, function (i) {
            root.querySelectorAll('#tc-sent .tc-tk').forEach(function (t, k) { t.classList[k === i ? 'add' : 'remove']('hl'); });
        }, function () {
            root.querySelectorAll('#tc-sent .tc-tk').forEach(function (t) { t.classList.remove('hl'); });
            if (done) done();
        });
    }
    function stepLearnS(s) {
        var words = s.s[0].split(' ');
        render(frame('<div class="tc-card"><div class="tc-emo">' + s.s[1] + '</div>' + sentHtml(words) + hearBtn() + nextBtn() + '</div>',
            'Listen to the sentence, then say it with me!', 'اسمع الجملة وقولها معايا!'));
        wireCommon();
        var play = function () { say(['sh:sent_listen'], null, function () { readSentence(words); }); };
        play();
        root.querySelector('#tc-hear').onclick = function () { sfx('pop'); readSentence(words); };
        root.querySelector('#tc-next').onclick = function () { sfx('tap'); nextStep(); };
    }

    /* questions */
    function correct(el, after) {
        L.combo++; if (L.combo > L.best) L.best = L.combo;
        sfx('chime'); shAnim('jump');
        var r = el.getBoundingClientRect();
        spark(r.left + r.width / 2, r.top + r.height / 2, ['⭐', '✨', '💙', '🎉'], 10);
        var pills = root.querySelectorAll('.tc-pill'); if (pills[0]) pills[0].textContent = '🔥 ' + L.combo;
        var cb = L.combo >= 3 ? [['Combo x' + L.combo + '! You are on fire!', 'كومبو ×' + L.combo + '! نار يا بطل!']] : null;
        var pr = [['Great job, ' + nm() + '!', 'برافو يا ' + nm() + '!'], ['Yes! You got it!', 'ايوه! صح!'], ['Wow, super smart!', 'يا سلام! شاطر!'], ['That is right! High five!', 'صح! هاتها!']];
        var m = cb ? cb[0] : pick(pr);
        bubble(m[0], m[1]);
        say([praiseKey()], null, after);
        if (L.combo === 3 || L.combo === 5) confetti();
    }
    function wrong(el, hintKeys) {
        L.miss++; L.tries++; L.combo = 0;
        sfx('buzz'); shAnim('shake');
        el.classList.add('no'); setTimeout(function () { el.classList.remove('no'); }, 500);
        var pills = root.querySelectorAll('.tc-pill'); if (pills[0]) pills[0].textContent = '🔥 0';
        var m = pick([['Almost! Try again, you can do it!', 'قربت! جرب تاني!'], ['Oops! Listen again with me.', 'أوبس! اسمع تاني معايا.'], ['No problem! Let us try once more.', 'عادي! نجرب مرة كمان.']]);
        bubble(m[0], m[1]);
        say(['sh:try_again'].concat(hintKeys || []));
    }
    function stepPickL(s) {
        var c = s.c, e = LET[c][1], w = LET[c][0], q, qa, prompt, hint;
        if (s.ty === 'name') { prompt = '<div class="tc-big" style="font-size:64px">🔊 ?</div>'; q = 'Which letter did I say? Pop it!'; qa = 'قلت أنهي حرف؟ فرقعه!'; hint = ['letter_' + c.toLowerCase()]; }
        else if (s.ty === 'sound') { prompt = '<div class="tc-big" style="font-size:64px">👂 ?</div>'; q = 'Which letter makes this sound?'; qa = 'أنهي حرف صوته كده؟'; hint = ['ph_' + c.toLowerCase()]; }
        else { prompt = '<div class="tc-emo">' + e + '</div><div class="tc-word" style="font-size:34px">' + h(w) + '</div>'; q = cap(w) + ' starts with...?'; qa = cap(w) + ' بيبدأ بحرف إيه؟'; hint = [wkey(w) || '', 'letter_' + c.toLowerCase()]; }
        render(frame('<div class="tc-card">' + prompt + hearBtn() + '<div class="tc-opts">' + s.opts.map(function (o) { return '<button class="tc-opt" data-o="' + o + '">' + o + '</button>'; }).join('') + '</div></div>', q, qa));
        wireCommon();
        var ask = function () { say(['sh:pick_letter'].concat(s.ty === 'start' ? [wkey(w) || ''] : hint)); };
        ask();
        root.querySelector('#tc-hear').onclick = function () { sfx('pop'); say(hint); };
        root.querySelectorAll('.tc-opt').forEach(function (b) {
            b.onclick = function () {
                if (b.classList.contains('pop')) return;
                if (b.getAttribute('data-o') === c) {
                    root.querySelectorAll('.tc-opt').forEach(function (x) { x.style.pointerEvents = 'none'; });
                    b.classList.add('pop'); correct(b, null);
                    setTimeout(nextStep, 1700);
                } else wrong(b, hint);
            };
        });
    }
    function stepPickW(s) {
        var w = s.w[0], e = s.w[1], ty = s.ty, inner, q, qa;
        if (ty === 'hear') {
            inner = '<div class="tc-big" style="font-size:64px">🔊 ?</div>' + hearBtn() + '<div class="tc-opts">' + s.opts.map(function (o) { return '<button class="tc-opt" data-o="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
            q = 'Which one did I say? Pop it!'; qa = 'قلت أنهي واحدة؟ فرقعها!';
        } else if (ty === 'see') {
            inner = '<div class="tc-emo">' + e + '</div>' + hearBtn() + '<div class="tc-opts">' + s.opts.map(function (o) { return '<button class="tc-opt txt" data-o="' + o[0] + '">' + h(o[0]) + '</button>'; }).join('') + '</div>';
            q = 'What is this? Pop the right word!'; qa = 'ده إيه؟ فرقع الكلمة الصح!';
        } else {
            var letters = w.toUpperCase().split(''), pool = shuffle(letters.concat(pickN('AEIOURSTLNMDP'.split(''), 2, '')));
            inner = '<div class="tc-emo" style="font-size:72px">' + e + '</div>' + hearBtn() + '<div class="tc-slots" id="slots">' + letters.map(function () { return '<div class="tc-slot"></div>'; }).join('') + '</div><div class="tc-tiles" id="tiles">' + pool.map(function (c, i) { return '<button class="tc-tk" data-c="' + c + '" data-n="' + i + '">' + c + '</button>'; }).join('') + '</div>';
            q = 'Spell ' + w + ' with me! Tap the letters in order.'; qa = 'يلا نهجي ' + w + '! دوس الحروف بالترتيب.';
        }
        render(frame('<div class="tc-card">' + inner + '</div>', q, qa));
        wireCommon();
        var key = wkey(w) || '';
        say(['sh:pick_word', key]);
        root.querySelector('#tc-hear').onclick = function () { sfx('pop'); say([key]); };
        if (ty !== 'spell') {
            root.querySelectorAll('.tc-opt').forEach(function (b) {
                b.onclick = function () {
                    if (b.getAttribute('data-o') === w) {
                        root.querySelectorAll('.tc-opt').forEach(function (x) { x.style.pointerEvents = 'none'; });
                        b.classList.add('pop'); correct(b, null);
                        setTimeout(nextStep, 1700);
                    } else {
                        wrong(b, [wkey(b.getAttribute('data-o')) || '']);
                    }
                };
            });
        } else {
            var slots = root.querySelectorAll('.tc-slot'), pos = 0, placed = [];
            var letters2 = w.toUpperCase().split('');
            root.querySelectorAll('#tiles .tc-tk').forEach(function (b) {
                b.onclick = function () {
                    if (pos >= letters2.length) return;
                    var c = b.getAttribute('data-c');
                    if (c === letters2[pos]) {
                        sfx('tap');
                        slots[pos].textContent = c; slots[pos].classList.add('f', 'ok');
                        b.classList.add('used'); placed.push(b);
                        say(['letter_' + c.toLowerCase()]);
                        pos++;
                        if (pos === letters2.length) {
                            setTimeout(function () { correct(slots[0], null); say([praiseKey(), key]); setTimeout(nextStep, 2300); }, 450);
                        }
                    } else wrong(b, ['letter_' + letters2[pos].toLowerCase()]);
                };
            });
        }
    }
    function stepSent(s) {
        var words = s.s[0].split(' '), e = s.s[1], key = words.map(function (w) { return wkey(w) || ''; });
        if (s.ty === 'listen') {
            render(frame('<div class="tc-card"><div class="tc-big" style="font-size:56px">🔊 ?</div>' + hearBtn() + '<div class="tc-opts">' + s.opts.map(function (o) { return '<button class="tc-opt" data-o="' + h(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div></div>',
                'Listen to the sentence. Which picture is it?', 'اسمع الجملة. دي أنهي صورة؟'));
            wireCommon();
            var play = function () { say(['sh:sent_pick'].concat(key)); };
            play();
            root.querySelector('#tc-hear').onclick = function () { sfx('pop'); say(key); };
            root.querySelectorAll('.tc-opt').forEach(function (b) {
                b.onclick = function () {
                    if (b.getAttribute('data-o') === s.s[0]) {
                        root.querySelectorAll('.tc-opt').forEach(function (x) { x.style.pointerEvents = 'none'; });
                        b.classList.add('pop'); correct(b, null);
                        setTimeout(nextStep, 1800);
                    } else wrong(b, key);
                };
            });
        } else {
            var pool = shuffle(words.map(function (w, i) { return { w: w, i: i }; }));
            render(frame('<div class="tc-card"><div class="tc-emo" style="font-size:80px">' + e + '</div>' + hearBtn()
                + '<div class="tc-slots" id="slots">' + words.map(function () { return '<div class="tc-slot" style="min-width:60px"></div>'; }).join('') + '</div>'
                + '<div class="tc-tiles" id="tiles">' + pool.map(function (p) { return '<button class="tc-tk" data-w="' + h(p.w) + '" data-i="' + p.i + '">' + h(p.w) + '</button>'; }).join('') + '</div></div>',
                'Build the sentence! Tap the words in order.', 'ركّب الجملة! دوس الكلمات بالترتيب.'));
            wireCommon();
            say(['sh:sent_build'].concat(key));
            root.querySelector('#tc-hear').onclick = function () { sfx('pop'); say(key); };
            var slots = root.querySelectorAll('.tc-slot'), pos = 0;
            root.querySelectorAll('#tiles .tc-tk').forEach(function (b) {
                b.onclick = function () {
                    if (pos >= words.length) return;
                    var wd = b.getAttribute('data-w');
                    if (wd === words[pos] || (wd.toLowerCase() === words[pos].toLowerCase())) {
                        sfx('tap');
                        slots[pos].textContent = pos === 0 ? cap(wd) : wd; slots[pos].classList.add('f', 'ok');
                        b.classList.add('used');
                        say([wkey(wd) || '']);
                        pos++;
                        if (pos === words.length) {
                            setTimeout(function () {
                                correct(slots[0], null);
                                setTimeout(function () { say(key); }, 1500);
                                setTimeout(nextStep, 1500 + 450 * words.length + 900);
                            }, 450);
                        }
                    } else wrong(b, [wkey(words[pos]) || '']);
                };
            });
        }
    }

    /* ---------- result ---------- */
    function showResult() {
        var l = L.l, stars = L.miss <= 1 ? 3 : (L.miss <= 4 ? 2 : 1), t = T(), first = !t.done[l.id];
        var prev = t.done[l.id] || 0;
        if (stars > prev) { t.xp = (t.xp || 0) + (stars - prev) * 10; state.stars = (state.stars || 0) + (stars - prev); }
        t.done[l.id] = Math.max(prev, stars);
        save();
        var ni = nextIdx(), more = ni >= 0;
        var msg = stars === 3 ? ['Perfect, ' + nm() + '! Three stars!', 'ممتاز يا ' + nm() + '! تلات نجوم!'] : (stars === 2 ? ['Great work! Two stars!', 'شغل حلو! نجمتين!'] : ['Good try! You can get more stars next time!', 'محاولة حلوة! المرة الجاية نجوم أكتر!']);
        render('<div class="tc-wrap">' + clouds() + '<div class="tc-top"><button class="tc-btn" id="tc-x">✕</button><div class="tc-title">' + h(l.t) + '</div><div class="tc-pill">🔥 ' + (t.streak || 0) + '</div></div>'
            + '<div class="tc-stage"><div class="tc-card tc-res"><div class="st">' + [1, 2, 3].map(function (k) { return '<span class="' + (k <= stars ? '' : 'off') + '" style="animation-delay:' + (k * .35) + 's">⭐</span>'; }).join('') + '</div>'
            + '<div style="font-weight:900;font-size:24px;margin-top:6px">' + (first ? 'New sticker!' : 'Level complete!') + '</div>'
            + '<div style="font-size:78px;margin:2px 0" class="tc-emo">' + l.st + '</div>'
            + '<div style="font-weight:800;font-size:15px;color:#7a6fb0">🔥 Best combo: ' + L.best + ' &nbsp; ⭐ +' + Math.max(0, stars - prev) + '</div>'
            + (stars === 3 && first ? '<button class="tc-chest" id="tc-chest">🎁</button><div style="font-weight:900;font-size:14px;color:#ff6b6b">Tap the gift!</div>' : '')
            + '<button class="tc-go" id="tc-n" style="margin-top:10px">' + (more ? '▶ Next game' : '🏆 Finish') + '</button><button class="tc-go sec" id="tc-m" style="margin:0">🗺️ Map</button></div></div>'
            + '<div class="tc-foot"><div id="sh"><img src="assets/teacher/shalabi_duo.png" alt=""></div><div class="tc-bub" id="bub"><div class="en">' + h(msg[0]) + '</div><div class="ar">' + h(msg[1]) + '</div></div></div></div>');
        wireShalabi();
        confetti(); sfx('cheer'); shAnim('jump');
        setTimeout(function () { say(['sh:lesson_done', hypeKey()]); }, 500);
        root.querySelector('#tc-x').onclick = function () { sfx('tap'); showMap(); };
        root.querySelector('#tc-m').onclick = function () { sfx('tap'); showMap(); };
        root.querySelector('#tc-n').onclick = function () { sfx('tap'); if (more) startLesson(ni); else showMap(); };
        var ch = root.querySelector('#tc-chest');
        if (ch) ch.onclick = function () {
            ch.onclick = null; sfx('cheer');
            var r = ch.getBoundingClientRect();
            spark(r.left + r.width / 2, r.top + r.height / 2, ['⭐', '💎', '✨', '🎉'], 16);
            ch.textContent = '⭐ +3'; ch.style.animation = 'tcbounce 1s ease-in-out infinite'; ch.style.fontSize = '60px';
            state.stars = (state.stars || 0) + 3; save();
            bubble('Bonus stars for you, ' + nm() + '!', 'نجوم زيادة ليك يا ' + nm() + '!');
            say([praiseKey()]);
        };
    }

    return { open: showMap, close: close, lessons: LESSONS, progress: function () { return { done: doneCount(), total: LESSONS.length }; } };
})();
