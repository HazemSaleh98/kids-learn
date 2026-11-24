'use strict';
/* ================= synthesized sound effects (WebAudio, no assets) ================= */
var SFX = (function () {
    var ac = null;
    function ctx() {
        if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
        if (ac && ac.state === 'suspended') { try { ac.resume(); } catch (e) { } }
        return ac;
    }
    function env(g, t0, peak, dur) {
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    }
    function tone(type, f0, f1, dur, peak, delay) {
        var a = ctx(); if (!a) return;
        var t0 = a.currentTime + (delay || 0);
        var o = a.createOscillator(), g = a.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f0, t0);
        if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur * 0.9);
        env(g, t0, peak || .25, dur);
        o.connect(g); g.connect(a.destination);
        o.start(t0); o.stop(t0 + dur + .05);
    }
    function noise(dur, peak, fLo, fHi, delay) {
        var a = ctx(); if (!a) return;
        var t0 = a.currentTime + (delay || 0);
        var len = Math.max(1, Math.floor(a.sampleRate * dur));
        var buf = a.createBuffer(1, len, a.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        var src = a.createBufferSource(); src.buffer = buf;
        var f = a.createBiquadFilter(); f.type = 'bandpass';
        f.frequency.setValueAtTime(fLo || 800, t0);
        if (fHi) f.frequency.exponentialRampToValueAtTime(fHi, t0 + dur);
        f.Q.value = 1.1;
        var g = a.createGain(); env(g, t0, peak || .3, dur);
        src.connect(f); f.connect(g); g.connect(a.destination);
        src.start(t0);
    }
    var lib = {
        pop: function () { tone('sine', 620, 180, .12, .35); noise(.07, .18, 2400, 900); },
        tap: function () { tone('triangle', 900, 700, .05, .14); },
        chime: function () { tone('sine', 880, 880, .16, .22); tone('sine', 1318, 1318, .22, .2, .09); },
        buzz: function () { tone('square', 160, 110, .22, .12); },
        whoosh: function () { noise(.5, .32, 300, 2600); tone('sine', 220, 660, .5, .1); },
        boing: function () { tone('sine', 180, 520, .14, .28); tone('sine', 520, 240, .16, .2, .12); },
        munch: function () { noise(.09, .3, 500, 300); noise(.09, .26, 420, 260, .1); },
        flip: function () { noise(.12, .2, 1200, 500); tone('triangle', 500, 750, .08, .1); },
        note: function (i) { var scale = [523, 587, 659, 784, 880, 1046, 1175, 1318]; tone('triangle', scale[i % scale.length], scale[i % scale.length], .18, .24); },
        sparkle: function () { var s = [659, 784, 988, 1318, 1568]; for (var i = 0; i < s.length; i++) tone('sine', s[i], s[i], .22, .2, i * .07); },
        cheer: function () { tone('sine', 523, 523, .14, .22); tone('sine', 659, 659, .14, .22, .1); tone('sine', 784, 784, .3, .24, .2); noise(.4, .12, 3000, 5000, .2); }
    };
    return {
        /* warm the context inside a user gesture */
        unlock: function () { ctx(); },
        play: function (name, arg) {
            if (typeof state !== 'undefined' && state && state.muted) return;
            try { if (lib[name]) lib[name](arg); } catch (e) { }
        }
    };
})();
