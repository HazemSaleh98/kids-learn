'use strict';
var KLGame = null;
var __klStarted = false;
function startKL() {
    if (__klStarted) return;
    __klStarted = true;
    KLGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
    backgroundColor: '#6ecdf5',
    scene: [BootScene, HomeScene, LettersScene, FeedScene, TrainScene, CountScene, RocketScene, SortScene, PatternScene, MemoryScene, BalloonScene, RunScene, TraceScene, HopScene, BuildScene, MachineScene, StoryScene],
    input: { activePointers: 2 },
    disableContextMenu: true
    });
}
if (document.fonts && document.fonts.load) {
    Promise.all([
        document.fonts.load('800 24px "Baloo 2"', 'Aa'),
        document.fonts.load('700 24px "Baloo Bhaijaan 2"', '\u0645')
    ]).then(startKL, startKL);
    setTimeout(startKL, 1800);
} else startKL();
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
