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

    function tts(text) {
        if (!ttsOK || !text) return;
        try {
            var u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US'; u.rate = 0.78; u.pitch = 1.28;
            if (ttsVoice) u.voice = ttsVoice;
            speechSynthesis.speak(u);
        } catch (e) {}
    }

    function lineText(key) {
        var l = VO_MANIFEST.lines[key];
        return l ? l.t : null;
    }

    function playNext() {
        if (playing) return;
        var key = queue.shift();
        if (key == null) return;
        if (state && state.muted) { playNext(); return; }
        playing = true;
        var done = function () { playing = false; setTimeout(playNext, 90); };
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
        oops: function () { this.say('oops_' + (1 + rnd(3))); },
        mini: function () { this.say('mini_' + (1 + rnd(3))); },
        stop: stopAll
    };
})();
