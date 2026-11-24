'use strict';
var KLGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
    backgroundColor: '#6ecdf5',
    scene: [BootScene, HomeScene, LettersScene, FeedScene, TrainScene, CountScene, RocketScene, SortScene, PatternScene, MemoryScene, BalloonScene, StoryScene],
    input: { activePointers: 2 },
    disableContextMenu: true
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
