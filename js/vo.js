'use strict';
/* ================= voice-over runtime =================
   Plays pre-rendered clips from assets/audio; falls back to device TTS
   (silent if neither works). */
var VO = (function () {
    var cur = null, queue = [], playing = false;
    /* base path for clips; a future second bundle (e.g. Egyptian-Arabic banter)
       can live at assets/audio/ar/<key>.mp3 and be switched on per line set. */
    var base = 'assets/audio/';

    /* TTS fallback (kept from v4 patch) */
    var ttsOK = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
    var FEMALE = ['Samantha', 'Ava', 'Allison', 'Zoe', 'Susan', 'Tessa', 'Karen', 'Moira', 'Fiona', 'Victoria', 'Google US English', 'Microsoft Zira', 'Microsoft Jenny', 'Microsoft Aria'];
    var ttsVoice = null;
    function score(v) {
        var s = 0;
        if (/enhanced|premium/i.test(v.name)) s += 100;
        var idx = -1;
        for (var i = 0; i < FEMALE.length; i++) { if (v.name.indexOf(FEMALE[i]) === 0) { idx = i; break; } }
        if (idx >= 0) s += 60 - idx; else if (/female/i.test(v.name)) s += 20;
        if (v.localService) s += 10;
        return s;
    }
    function pickTts() {
        if (!ttsOK) return;
        var vs = speechSynthesis.getVoices();
        var best = null, bs = -1;
        for (var i = 0; i < vs.length; i++) {
            var v = vs[i];
            if (v.lang.toLowerCase().indexOf('en') !== 0) continue;
            var sc = score(v);
            if (sc > bs) { bs = sc; best = v; }
        }
        ttsVoice = best;
    }
    if (ttsOK) { pickTts(); try { speechSynthesis.onvoiceschanged = pickTts; } catch (e) {} }

    function tts(text, lang) {
        if (!ttsOK || !text) return;
        try {
            var u = new SpeechSynthesisUtterance(text);
            u.lang = lang || 'en-US'; u.rate = lang === 'ar-EG' ? 0.85 : 0.78; u.pitch = 1.28;
            if (!lang && ttsVoice) u.voice = ttsVoice;
            speechSynthesis.speak(u);
        } catch (e) {}
    }

    function lineText(key) {
        var l = VO_MANIFEST.lines[key];
        return l ? l.t : null;
    }

    /* buddy id for the Arabic banter bundle */
    var AR_BUDDY = { monster_blue: 'fuzzy', monster_green: 'blinky', hero: 'captain', caped: 'luna', princess: 'princess', fairy: 'fairy' };
    function buddyId() { return (state && state.theme && AR_BUDDY[state.theme]) || null; }
    function kidSlug() { return state && state.name ? String(state.name).toLowerCase().replace(/[^a-z0-9]/g, '') : null; }

    function playNext() {
        if (playing) return;
        var key = queue.shift();
        if (key == null) return;
        if (state && state.muted) { playNext(); return; }
        playing = true;
        var done = function () { playing = false; setTimeout(playNext, 90); };
        /* Arabic buddy banter clips: 'ar:<key>' from assets/audio/ar/; missing = skip quietly */
        if (key.indexOf('ar:') === 0) {
            var ak = key.slice(3);
            if (typeof VO_AR_FILES !== 'undefined' && VO_AR_FILES[ak]) {
                try {
                    cur = new Audio('assets/audio/ar/' + ak + '.mp3');
                    cur.onended = done;
                    cur.onerror = done;
                    var ap = cur.play();
                    if (ap && ap.catch) ap.catch(done);
                    return;
                } catch (e) {}
            }
            playing = false; setTimeout(playNext, 40);
            return;
        }
        if (VO_FILES[key]) {
            try {
                cur = new Audio(base + key + '.mp3');
                cur.onended = done;
                cur.onerror = function () { tts(lineText(key)); playing = false; setTimeout(playNext, 60); };
                var p = cur.play();
                if (p && p.catch) p.catch(function () { tts(lineText(key)); playing = false; setTimeout(playNext, 60); });
                return;
            } catch (e) {}
        }
        tts(lineText(key));
        /* TTS is fire-and-forget; estimate a beat before next clip */
        setTimeout(done, Math.min(4000, 700 + (lineText(key) || '').length * 75));
    }

    function stopAll() {
        queue = [];
        if (cur) { try { cur.pause(); } catch (e) {} cur = null; }
        if (ttsOK) { try { speechSynthesis.cancel(); } catch (e) {} }
        playing = false;
    }

    return {
        /* switch clip bundle (e.g. 'assets/audio/ar/'); resets to default when omitted */
        setBase: function (b) { base = b || 'assets/audio/'; },
        /* home greeting: buddy's Arabic hello (name variant when available), then the English welcome */
        hello: function () {
            var b = buddyId(), slug = kidSlug(), keys = [];
            if (b && typeof VO_AR_FILES !== 'undefined') {
                var named = b + '_hello__' + slug;
                if (slug && VO_AR_FILES[named]) keys.push('ar:' + named);
                else if (VO_AR_FILES[b + '_hello']) keys.push('ar:' + b + '_hello');
            }
            keys.push('instr_welcome');
            this.say.apply(this, keys);
        },
        /* win cheer: mixes English teacher cheers with the buddy's Arabic cheers;
           named clips (either language) favored, both voices heard over time */
        cheerMixed: function () {
            var extra = Array.prototype.slice.call(arguments);
            var n = 1 + rnd(6), slug = kidSlug();
            var enNamed = slug ? 'cheer_' + n + '__' + slug : null;
            var pool = [];
            var b = buddyId();
            if (enNamed && VO_FILES[enNamed]) pool.push(enNamed, enNamed);
            if (b && slug && typeof VO_AR_FILES !== 'undefined' && VO_AR_FILES[b + '_cheer__' + slug]) pool.push('ar:' + b + '_cheer__' + slug, 'ar:' + b + '_cheer__' + slug);
            if (b && typeof VO_AR_FILES !== 'undefined') {
                if (VO_AR_FILES[b + '_cheer_1']) pool.push('ar:' + b + '_cheer_1');
                if (VO_AR_FILES[b + '_cheer_2']) pool.push('ar:' + b + '_cheer_2');
            }
            pool.push('cheer_' + n);
            var keys = [pick(pool)].concat(extra);
            this.say.apply(this, keys);
        },
        /* queue one or more keys */
        say: function () {
            stopAll();
            for (var i = 0; i < arguments.length; i++) queue.push(arguments[i]);
            playNext();
        },
        cheer: function () {
            var n = 1 + rnd(6);
            var named = state && state.name ? 'cheer_' + n + '__' + String(state.name).toLowerCase().replace(/[^a-z0-9]/g, '') : null;
            if (named && VO_FILES[named]) this.say(named);
            else this.say('cheer_' + n);
        },
        speak: function (text, lang) { stopAll(); tts(text, lang); },
        hasClip: function (key) { return typeof VO_FILES !== 'undefined' && !!VO_FILES[key]; },
        hasArClip: function (key) { return typeof VO_AR_FILES !== 'undefined' && !!VO_AR_FILES[key]; },
        oops: function () { this.say('oops_' + (1 + rnd(3))); },
        mini: function () { this.say('mini_' + (1 + rnd(3))); },
        stop: stopAll
    };
})();
