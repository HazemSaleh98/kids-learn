'use strict';
/* ================= DOM screens: setup / parents / photo (Arabic UI) ================= */
var DOMScreens = (function () {
    var dom = function () { return document.getElementById('dom'); };
    var css = '<style>'
        + '#dom{background:linear-gradient(180deg,#2ea8f0,#6ecdf5 55%,#8ed06e);padding:max(14px,env(safe-area-inset-top)) 16px 26px;font-family:inherit}'
        + '.dc{background:#fff;border-radius:28px;border:4px solid #e6dfff;box-shadow:0 8px 0 rgba(60,40,120,.14);padding:18px;max-width:420px;margin:0 auto;direction:rtl}'
        + '.dh1{font-size:28px;font-weight:900;color:#3b2a5e;text-align:center;margin-bottom:4px}'
        + '.dn{color:#7a7194;font-weight:700;font-size:14px;text-align:center;margin:6px 0 12px;line-height:1.7}'
        + '.dl{display:block;font-weight:900;color:#3b2a5e;margin:12px 0 6px;font-size:16px}'
        + '.di{width:100%;border:3px solid #d9d2f0;border-radius:18px;padding:13px 15px;font-size:19px;font-weight:800;color:#3b2a5e;background:#f8f6ff;outline:none;font-family:inherit}'
        + '.dcta{display:block;width:100%;border:none;border-radius:22px;margin-top:14px;padding:15px;font-size:20px;font-weight:900;color:#5b3b00;background:linear-gradient(135deg,#ffd93d,#ffb03d);box-shadow:0 6px 0 #d98e1f;font-family:inherit}'
        + '.dgh{display:block;width:100%;border-radius:18px;margin-top:10px;padding:12px;background:#f1eeff;border:3px solid #d9d2f0;color:#5b4b8a;font-weight:900;font-size:16px;font-family:inherit}'
        + '.ddg{background:#fff1f1;border-color:#ffc9c9;color:#c92a2a}'
        + '.dwn{margin-top:12px;background:#fff7e6;border-radius:16px;padding:12px 14px;font-size:13px;font-weight:700;color:#9a5b00;line-height:1.7}'
        + '.dth{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}'
        + '.dtb{border:3px solid #d9d2f0;background:#f8f6ff;border-radius:20px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:inherit}'
        + '.dtb img{width:60px;height:60px;object-fit:contain}'
        + '.dtb .tn{font-weight:900;color:#3b2a5e;font-size:15px}'
        + '.dtb.on{border-color:#ffb03d;background:#fff6df;box-shadow:0 4px 0 #ffd93d}'
        + '.dkg{background:#f5f3ff;border-radius:14px;padding:10px 12px;margin-bottom:8px}'
        + '.dkr{display:flex;justify-content:space-between;align-items:center;padding-top:6px;font-weight:800;color:#2d2340;font-size:14px}'
        + '.dkc{background:#ffd93d;color:#4a2c00;border-radius:999px;padding:2px 10px;font-size:12px;white-space:nowrap}'
        + '.dkd{font-size:12.5px;color:#6b6480;font-weight:700;text-align:right;padding:2px 0 4px}'
        + '.dsl{width:100%;accent-color:#7c5cff;margin:4px 0 10px}'
        + '.dst{width:240px;margin:10px auto;touch-action:none;border-radius:28px;background:linear-gradient(160deg,#f5f3ff,#e0f2fe);padding:14px;box-shadow:inset 0 0 0 3px rgba(124,92,255,.25);position:relative;direction:ltr}'
        + '.dst .base{width:100%;display:block}'
        + '.dfc{position:absolute;aspect-ratio:1;border-radius:50%;overflow:hidden;transform:translate(-50%,-50%);background:#ffe9c9;box-shadow:0 0 0 3px rgba(255,255,255,.9)}'
        + '.dfc img{width:100%;height:100%;object-fit:cover}'
        + '.dx{position:absolute;top:10px;left:12px;width:44px;height:44px;border-radius:14px;border:3px solid #e6dfff;background:#fff;font-size:20px;box-shadow:0 4px 0 rgba(60,40,120,.18);z-index:3}'
        + '</style>';

    function open(html) { var d = dom(); d.innerHTML = css + html; d.style.display = 'block'; }
    function close() { var d = dom(); d.style.display = 'none'; d.innerHTML = ''; }

    function themeBtns(sel, attr) {
        var h = '<div class="dth">';
        Object.keys(THEMES).forEach(function (k) {
            var t = THEMES[k];
            h += '<button type="button" class="dtb' + (sel === k ? ' on' : '') + '" data-' + attr + '="' + k + '"><img src="assets/' + t.img + '" alt=""><span class="tn">' + esc(t.ar) + '</span></button>';
        });
        return h + '</div>';
    }
    function kgBtns(sel, attr) {
        var h = '<div class="dth" style="grid-template-columns:1fr 1fr">';
        ['kg1', 'kg2'].forEach(function (k) {
            h += '<button type="button" class="dtb' + (sel === k ? ' on' : '') + '" data-' + attr + '="' + k + '"><span class="tn" style="font-size:19px">' + (k === 'kg1' ? 'KG1 🌱' : 'KG2 🚀') + '</span><span class="tn" style="font-size:12px;font-weight:700">' + (k === 'kg1' ? 'تأسيس أول (٤-٥ سنين)' : 'تأسيس تاني (٥-٦ سنين)') + '</span></button>';
        });
        return h + '</div>';
    }
    function bindTheme(attr, apply) {
        document.querySelectorAll('[data-' + attr + ']').forEach(function (b) {
            b.addEventListener('click', function () {
                var nEl = document.getElementById('su-name'), cEl = document.getElementById('su-char');
                if (nEl) setupSel.name = nEl.value;
                if (cEl) setupSel.char = cEl.value;
                apply(b.getAttribute('data-' + attr));
            });
        });
    }

    function showSetup(onDone) {
        var h = '<div class="dc">'
            + '<div class="dh1">أهلًا! 👋</div>'
            + '<div class="dn">صفحة الأهل — ظبطوا اللعبة لطفلكم في دقيقة. المحتوى التعليمي بالإنجليزي.</div>'
            + '<label class="dl">اسم الطفل (هيتنطق في اللعبة)</label>'
            + '<input class="di" id="su-name" dir="ltr" placeholder="Malik" value="' + esc(setupSel.name) + '">'
            + '<label class="dl">الشخصية المفضلة (اسمها هيتقال في التشجيع)</label>'
            + '<input class="di" id="su-char" dir="ltr" placeholder="Spider-Man" value="' + esc(setupSel.char) + '">'
            + '<label class="dl">اختاروا صديق اللعب</label>' + themeBtns(setupSel.theme, 'theme')
            + '<label class="dl">المرحلة</label>' + kgBtns(setupSel.kg, 'kg')
            + '<button type="button" class="dgh" id="d-photo">📸 صورة الطفل في الشخصية (اختياري)</button>'
            + '<button type="button" class="dcta" id="d-start">يلا نبدأ! 🎉</button>'
            + '<div class="dwn">⚠️ البيانات بتتحفظ على الجهاز ده بس. مسح أيقونة التطبيق من الشاشة الرئيسية بيمسح تقدم الطفل.</div>'
            + '</div>';
        open(h);
        bindTheme('theme', function (k) { setupSel.theme = k; showSetup(onDone); });
        bindTheme('kg', function (k) { setupSel.kg = k; showSetup(onDone); });
        document.getElementById('d-photo').addEventListener('click', function () {
            var nEl = document.getElementById('su-name'), cEl = document.getElementById('su-char');
            setupSel.name = nEl ? nEl.value : setupSel.name;
            setupSel.char = cEl ? cEl.value : setupSel.char;
            showPhoto(function () { showSetup(onDone); });
        });
        document.getElementById('d-start').addEventListener('click', function () {
            var nm = (document.getElementById('su-name').value || '').trim();
            var ch = (document.getElementById('su-char').value || '').trim();
            if (!nm) return;
            state = { name: nm, charName: ch || THEMES[setupSel.theme].charDef, theme: setupSel.theme, kg: setupSel.kg, stars: 0, levels: {}, streaks: {}, photo: setupSel.photo || null, faceTf: setupSel.faceTf || null };
            save();
            close();
            if (onDone) onDone();
        });
    }

    function showParents() {
        var h = '<button class="dx" id="d-close">🏠</button><div class="dc">'
            + '<div class="dh1">⚙️ الأهل</div>'
            + '<label class="dl">اسم الطفل</label>'
            + '<input class="di" id="pa-name" dir="ltr" value="' + esc(state.name || '') + '">'
            + '<label class="dl">الشخصية المفضلة</label>'
            + '<input class="di" id="pa-char" dir="ltr" value="' + esc(state.charName || '') + '">'
            + '<label class="dl">صديق اللعب</label>' + themeBtns(state.theme, 'ptheme')
            + '<label class="dl">المرحلة (الأهل بيختاروها)</label>' + kgBtns(state.kg || 'kg1', 'pkg')
            + '<label class="dl">منهج المرحلة الحالية</label><div class="dkg">';
        Object.keys(GAMES).forEach(function (id) {
            var g2 = GAMES[id];
            var lv2 = (state.levels && state.levels[id]) || 1;
            h += '<div class="dkr"><span>' + g2.em + ' ' + esc(g2.title) + '</span><span class="dkc">' + (state.kg === 'kg2' ? 'KG2' : 'KG1') + ' · L' + lv2 + '</span></div>';
            h += '<div class="dkd">' + esc(g2.kg[state.kg === 'kg2' ? 'kg2' : 'kg1']) + '</div>';
        });
        h += '</div><div class="dn">المستوى (L) بيترفع لوحده كل ما الطفل يجاوب صح جوه المرحلة.</div>'
            + '<button type="button" class="dcta" id="d-photo2" style="background:linear-gradient(135deg,#38bdf8,#6366f1);color:#fff;box-shadow:0 6px 0 #4338ca">صورة الطفل جوه الشخصية 📸</button>'
            + '<div class="dwn" style="background:#ecfeff;color:#155e75">🔊 صوت اللعبة (Miss Lily) مسجل بصوت دافئ وواضح للأطفال، وشغال أوفلاين. لو مقطع ناقص بيستخدم صوت الجهاز مؤقتًا. زرار 🔊 في اللعبة بيسكت الصوت والمؤثرات.</div>'
            + '<button type="button" class="dcta" id="d-save">حفظ ✅</button>'
            + '<button type="button" class="dgh" id="d-backup">نسخ البيانات 📋</button>'
            + '<button type="button" class="dgh ddg" id="d-reset">مسح التقدم 🗑️</button>'
            + '<button type="button" class="dgh ddg" id="d-newkid">طفل جديد / البدء من الأول 🆕</button>'
            + '<div class="dwn">⚠️ البيانات محفوظة على الجهاز ده بس (مش على الإنترنت). لو أيقونة التطبيق اتمسحت من الشاشة الرئيسية، التقدم والنجوم هيتمسحوا معاها.</div>'
            + '<div class="dn" id="d-msg" style="font-weight:800"></div></div>';
        open(h);
        var msg = function (t) { var m = document.getElementById('d-msg'); if (m) m.textContent = t; };
        document.getElementById('d-close').addEventListener('click', function () { close(); if (window.KLGame) KLGame.scene.start('home'); });
        bindTheme('ptheme', function (k) { state.theme = k; save(); showParents(); });
        bindTheme('pkg', function (k) { state.kg = k; save(); showParents(); });
        document.getElementById('d-save').addEventListener('click', function () {
            state.name = (document.getElementById('pa-name').value || '').trim() || state.name;
            state.charName = (document.getElementById('pa-char').value || '').trim() || theme().charDef;
            save(); msg('اتحفظ ✅');
        });
        document.getElementById('d-photo2').addEventListener('click', function () { showPhoto(showParents); });
        document.getElementById('d-backup').addEventListener('click', function () {
            var txt = JSON.stringify(state);
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg('اتنسخ ✅ احتفظوا بيها في ملاحظة'); });
            else msg(txt);
        });
        document.getElementById('d-reset').addEventListener('click', function () {
            var b = this;
            if (b.dataset.armed) { state.stars = 0; state.levels = {}; state.streaks = {}; save(); msg('اتمسح 🗑️'); b.dataset.armed = ''; b.textContent = 'مسح التقدم 🗑️'; }
            else { b.dataset.armed = '1'; b.textContent = 'متأكدين؟ دوسوا تاني للمسح'; }
        });
        document.getElementById('d-newkid').addEventListener('click', function () {
            var b = this;
            if (b.dataset.armed) {
                try { localStorage.removeItem(KEY); } catch (e) {}
                state = null; setupSel = { theme: 'bear', name: '', char: '', kg: 'kg1' };
                close(); showSetup(function () { if (window.KLGame) KLGame.scene.start('home'); });
            } else { b.dataset.armed = '1'; b.textContent = 'متأكدين؟ ده هيمسح كل حاجة - دوسوا تاني'; }
        });
    }

    /* photo editor: face composited on the theme animal */
    var editTf = null;
    function tfCss(tf) { return 'transform:translate(' + tf.x + '%,' + tf.y + '%) scale(' + tf.s + ') rotate(' + tf.r + 'deg)'; }
    function costumeDom(tk) {
        var t = THEMES[tk] || THEMES.bear;
        var store = state || setupSel;
        var tf = editTf || store.faceTf || { x: 0, y: 0, s: 1, r: 0 };
        var h = '<img class="base" src="assets/' + t.img + '" alt="">';
        if (store.photo) h += '<div class="dfc" style="left:' + t.fx + '%;top:' + t.fy + '%;width:' + t.fr + '%"><img id="face-img" src="' + store.photo + '" style="' + tfCss(tf) + '" draggable="false"></div>';
        return h;
    }
    function showPhoto(back) {
        var store = state || setupSel;
        editTf = Object.assign({ x: 0, y: 0, s: 1, r: 0 }, store.faceTf || {});
        var h = '<button class="dx" id="d-pdone">✔️</button><div class="dc">'
            + '<div class="dn">الصورة بتتحفظ على الجهاز ده بس — مش بتترفع لأي مكان على الإنترنت 🔒</div>'
            + '<div class="dst" id="face-stage">' + costumeDom((state && state.theme) || setupSel.theme) + '</div>';
        if (store.photo) {
            h += '<label class="dl">التكبير</label><input type="range" class="dsl" id="fc-s" min="0.4" max="3" step="0.02" value="' + editTf.s + '" dir="ltr">'
                + '<label class="dl">اللف</label><input type="range" class="dsl" id="fc-r" min="-60" max="60" step="1" value="' + editTf.r + '" dir="ltr">'
                + '<div class="dn">حركوا الصورة بصباع واحد — صباعين للتكبير واللف</div>'
                + '<button type="button" class="dcta" id="d-pchoose">تغيير الصورة 🔄</button>'
                + '<button type="button" class="dgh ddg" id="d-pclear">مسح الصورة 🗑️</button>';
        } else {
            h += '<div class="dn">لسه مفيش صورة — اختاروا صورة وش الطفل من الاستوديو</div>'
                + '<button type="button" class="dcta" id="d-pchoose">اختاروا صورة 📷</button>';
        }
        h += '<input type="file" id="face-file" accept="image/*" style="display:none"></div>';
        open(h);
        var applyTf = function () { var im = document.getElementById('face-img'); if (im) im.style.cssText = tfCss(editTf); };
        document.getElementById('d-pdone').addEventListener('click', function () {
            store.faceTf = editTf; if (state) save(); back();
        });
        var choose = document.getElementById('d-pchoose');
        if (choose) choose.addEventListener('click', function () { document.getElementById('face-file').click(); });
        var clr = document.getElementById('d-pclear');
        if (clr) clr.addEventListener('click', function () { store.photo = null; store.faceTf = { x: 0, y: 0, s: 1, r: 0 }; if (state) save(); showPhoto(back); });
        document.getElementById('face-file').addEventListener('change', function () {
            var f = this.files && this.files[0];
            if (!f) return;
            var rd = new FileReader();
            rd.onload = function () {
                var img = new Image();
                img.onload = function () {
                    var m = Math.min(1, 320 / Math.max(img.width || 1, img.height || 1));
                    var cv = document.createElement('canvas');
                    cv.width = Math.max(1, Math.round(img.width * m));
                    cv.height = Math.max(1, Math.round(img.height * m));
                    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
                    store.photo = cv.toDataURL('image/jpeg', 0.85);
                    editTf = { x: 0, y: 0, s: 1, r: 0 };
                    store.faceTf = editTf;
                    if (state) save();
                    showPhoto(back);
                };
                img.src = rd.result;
            };
            rd.readAsDataURL(f);
        });
        /* drag + pinch */
        var stg = document.getElementById('face-stage');
        var pts = {}, last1 = null, g0 = null;
        var pair = function () {
            var ks = Object.keys(pts), a = pts[ks[0]], b = pts[ks[1]];
            var dx = b.x - a.x, dy = b.y - a.y;
            return { d: Math.sqrt(dx * dx + dy * dy), a: Math.atan2(dy, dx) * 180 / Math.PI };
        };
        var sync = function () { var s = document.getElementById('fc-s'), r = document.getElementById('fc-r'); if (s) s.value = editTf.s; if (r) r.value = editTf.r; };
        stg.addEventListener('pointerdown', function (e) {
            try { stg.setPointerCapture(e.pointerId); } catch (er) {}
            pts[e.pointerId] = { x: e.clientX, y: e.clientY };
            if (Object.keys(pts).length === 1) last1 = { x: e.clientX, y: e.clientY };
            if (Object.keys(pts).length === 2) { var m = pair(); g0 = { d: m.d, a: m.a, s: editTf.s, r: editTf.r }; }
        });
        stg.addEventListener('pointermove', function (e) {
            if (!pts[e.pointerId]) return;
            pts[e.pointerId] = { x: e.clientX, y: e.clientY };
            var n = Object.keys(pts).length;
            var k = 100 / Math.max(1, stg.clientWidth);
            if (n === 1 && last1) { editTf.x += (e.clientX - last1.x) * k; editTf.y += (e.clientY - last1.y) * k; last1 = { x: e.clientX, y: e.clientY }; }
            else if (n === 2 && g0) { var m = pair(); if (g0.d > 0) editTf.s = Math.min(3, Math.max(0.4, g0.s * m.d / g0.d)); editTf.r = Math.min(180, Math.max(-180, g0.r + (m.a - g0.a))); }
            applyTf(); sync();
        });
        var upFn = function (e) { delete pts[e.pointerId]; var ks = Object.keys(pts); if (ks.length === 1) { last1 = { x: pts[ks[0]].x, y: pts[ks[0]].y }; g0 = null; } };
        stg.addEventListener('pointerup', upFn);
        stg.addEventListener('pointercancel', upFn);
        var sS = document.getElementById('fc-s'), sR = document.getElementById('fc-r');
        if (sS) sS.addEventListener('input', function () { editTf.s = Number(sS.value); applyTf(); });
        if (sR) sR.addEventListener('input', function () { editTf.r = Number(sR.value); applyTf(); });
    }

    return { showSetup: showSetup, showParents: showParents, showPhoto: showPhoto, close: close };
})();
