'use strict';
/* ================= voice-over line manifest =================
   Every spoken line in the game. Generated audio files live in assets/audio/<key>.mp3.
   Name-bearing cheer lines are generated per child name later as cheer_N__<name>.mp3;
   until then the nameless cheer_N files below are used, with device TTS as last fallback. */
var VO_MANIFEST = {
    voice: 'Sulafat',
    instructions: 'A warm, patient kindergarten teacher talking to one 4-5 year old: slow pace, very clear pronunciation, gentle and encouraging, with a smile in the voice. Short sentences. American English.',
    lines: {}
};
(function () {
    var L = VO_MANIFEST.lines;
    /* letters + phonics */
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (c) {
        L['letter_' + c.toLowerCase()] = { t: c };
    });
    var SOUNDS = { A: 'ah', B: 'buh', C: 'kuh', D: 'duh', E: 'eh', F: 'fff', G: 'guh', H: 'huh', I: 'ih', J: 'juh', K: 'kuh', L: 'lll', M: 'mmm', N: 'nnn', O: 'oh', P: 'puh', Q: 'kwuh', R: 'rrr', S: 'sss', T: 'tuh', U: 'uh', V: 'vvv', W: 'wuh', X: 'ks', Y: 'yuh', Z: 'zzz' };
    Object.keys(SOUNDS).forEach(function (c) {
        L['ph_' + c.toLowerCase()] = { t: SOUNDS[c], i: 'Say only this letter sound, slowly and clearly, like phonics practice with a young child.' };
    });
    /* numbers 1-20 */
    ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'].forEach(function (w, i) {
        L['num_' + (i + 1)] = { t: w.charAt(0).toUpperCase() + w.slice(1) + '!' };
    });
    /* picture words */
    ['dog', 'sun', 'owl', 'fish', 'cake', 'duck', 'frog', 'star', 'bear', 'tree', 'panda', 'rabbit', 'monkey', 'donut', 'heart', 'cloud', 'carrot'].forEach(function (w) {
        L['word_' + w] = { t: w.charAt(0).toUpperCase() + w.slice(1) + '!' };
    });
    /* sight words */
    ['the', 'and', 'you', 'is', 'it', 'in', 'on', 'we', 'he', 'she', 'my', 'to', 'go', 'up', 'at', 'am', 'can', 'see', 'like', 'play'].forEach(function (w) {
        L['sight_' + w] = { t: w };
    });
    /* instruction lines (some are sequenced around unit clips) */
    var instr = {
        welcome: 'Hi there! Let’s play and learn!',
        letters_1: 'Pop every',
        letters_2: 'bubble!',
        letters_phonics: 'Pop the letter that says…',
        feed_1: 'Yummy yummy! I want the…',
        feed_no: 'No no! I want the…',
        train_1: 'Let’s build the word!',
        count_1: 'I’m so hungry! Give me…',
        count_2: 'pieces! Tap them, one by one!',
        math_1: 'What is…',
        math_plus: 'plus',
        math_minus: 'minus',
        math_2: 'Launch the right rocket!',
        sort_shape: 'Sort the shapes! Put every shape in its home!',
        sort_color: 'Sort by color! Put every piece in the matching color!',
        sort_combo: 'Match the shape, and the color!',
        levelup: 'Level up! You’re amazing!'
    };
    Object.keys(instr).forEach(function (k) { L['instr_' + k] = { t: instr[k] }; });
    /* cheers (nameless generic; per-name versions slot in as cheer_N__name) */
    ['Great job!', 'You did it!', 'Amazing!', 'Wow! You’re so smart!', 'Fantastic!', 'High five!'].forEach(function (t, i) {
        L['cheer_' + (i + 1)] = { t: t, i: 'Genuinely delighted praise for a small child, warm and bright.' };
    });
    ['Try again! You can do it!', 'Almost! One more try!', 'Oops! Let’s try again!'].forEach(function (t, i) {
        L['oops_' + (i + 1)] = { t: t, i: 'Gentle encouragement after a mistake, patient and kind, never disappointed.' };
    });
    ['Yes!', 'Nice!', 'Perfect!'].forEach(function (t, i) {
        L['mini_' + (i + 1)] = { t: t };
    });
})();
/* files that actually exist in assets/audio (filled in as generations land) */
var VO_FILES = {};
