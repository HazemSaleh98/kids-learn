var CACHE = 'kidslearn-v7';
var ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'lib/phaser.min.js', 'js/app.js', 'js/data.js', 'js/dom-screens.js', 'js/games.js', 'js/scenes.js', 'js/vo-manifest.js', 'js/vo.js', 'assets/ui/btn_blue.png', 'assets/ui/btn_green.png', 'assets/ui/btn_grey.png', 'assets/ui/btn_red.png', 'assets/ui/btn_yellow.png', 'assets/ships/blue.png', 'assets/ships/green.png', 'assets/ships/orange.png', 'assets/ships/red.png', 'assets/bunny/bunny1_hurt.png', 'assets/bunny/bunny1_jump.png', 'assets/bunny/bunny1_ready.png', 'assets/bunny/bunny1_stand.png', 'assets/bunny/bunny1_walk1.png', 'assets/bunny/bunny1_walk2.png', 'assets/monsters/blue_cheer.png', 'assets/monsters/blue_stand.png', 'assets/monsters/caped_cheer.png', 'assets/monsters/caped_stand.png', 'assets/monsters/fairy_cheer.png', 'assets/monsters/fairy_stand.png', 'assets/monsters/green_cheer.png', 'assets/monsters/green_stand.png', 'assets/monsters/hero_cheer.png', 'assets/monsters/hero_stand.png', 'assets/monsters/princess_cheer.png', 'assets/monsters/princess_stand.png', 'assets/shapes/blue_circle.png', 'assets/shapes/blue_rhombus.png', 'assets/shapes/blue_square.png', 'assets/shapes/blue_squircle.png', 'assets/shapes/face_a.png', 'assets/shapes/face_b.png', 'assets/shapes/face_c.png', 'assets/shapes/face_d.png', 'assets/shapes/face_e.png', 'assets/shapes/green_circle.png', 'assets/shapes/green_rhombus.png', 'assets/shapes/green_square.png', 'assets/shapes/green_squircle.png', 'assets/shapes/pink_circle.png', 'assets/shapes/pink_rhombus.png', 'assets/shapes/pink_square.png', 'assets/shapes/pink_squircle.png', 'assets/shapes/red_circle.png', 'assets/shapes/red_rhombus.png', 'assets/shapes/red_square.png', 'assets/shapes/red_squircle.png', 'assets/animals/bear.png', 'assets/animals/dog.png', 'assets/animals/duck.png', 'assets/animals/frog.png', 'assets/animals/monkey.png', 'assets/animals/owl.png', 'assets/animals/panda.png', 'assets/animals/rabbit.png', 'assets/fx/bubble.png', 'assets/food/cake.png', 'assets/food/carrot.png', 'assets/food/carrot_gold.png', 'assets/food/donut1.png', 'assets/food/donut2.png', 'assets/food/donut3.png', 'assets/food/fish.png', 'assets/food/fish2.png', 'assets/bg/bush1.png', 'assets/bg/bush2.png', 'assets/bg/cloud1.png', 'assets/bg/cloud3.png', 'assets/bg/cloud4.png', 'assets/bg/grass.png', 'assets/bg/space.png', 'assets/bg/sun.png', 'assets/bg/tree.png', 'assets/bg/treePine.png', 'assets/tiles/heart.png', 'assets/tiles/star.png', 'assets/tiles/tile0.png', 'assets/tiles/tile1.png', 'assets/tiles/tile2.png', 'assets/tiles/tile3.png', 'assets/tiles/tile4.png', 'assets/tiles/tile5.png', 'assets/tiles/tile6.png', 'assets/tiles/tile7.png', 'assets/tiles/tile8.png', 'assets/tiles/tile9.png', 'assets/tiles/tileA.png', 'assets/tiles/tileB.png', 'assets/tiles/tileC.png', 'assets/tiles/tileD.png', 'assets/tiles/tileE.png', 'assets/tiles/tileF.png', 'assets/tiles/tileG.png', 'assets/tiles/tileH.png', 'assets/tiles/tileI.png', 'assets/tiles/tileJ.png', 'assets/tiles/tileK.png', 'assets/tiles/tileL.png', 'assets/tiles/tileM.png', 'assets/tiles/tileN.png', 'assets/tiles/tileO.png', 'assets/tiles/tileP.png', 'assets/tiles/tileQ.png', 'assets/tiles/tileR.png', 'assets/tiles/tileS.png', 'assets/tiles/tileT.png', 'assets/tiles/tileU.png', 'assets/tiles/tileV.png', 'assets/tiles/tileW.png', 'assets/tiles/tileX.png', 'assets/tiles/tileY.png', 'assets/tiles/tileZ.png'];
self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
            if (hit) return hit;
            return fetch(e.request).then(function (resp) {
                if (resp.ok && new URL(e.request.url).origin === location.origin) {
                    var copy = resp.clone();
                    caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
                }
                return resp;
            }).catch(function () {
                if (e.request.mode === 'navigate') return caches.match('index.html');
            });
        })
    );
});
