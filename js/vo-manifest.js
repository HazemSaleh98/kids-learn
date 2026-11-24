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
var VO_FILES = {
    "cheer_1": true,
    "cheer_1__aseel": true,
    "cheer_1__malik": true,
    "cheer_2": true,
    "cheer_2__aseel": true,
    "cheer_2__malik": true,
    "cheer_3": true,
    "cheer_3__aseel": true,
    "cheer_3__malik": true,
    "cheer_4": true,
    "cheer_4__aseel": true,
    "cheer_4__malik": true,
    "cheer_5": true,
    "cheer_5__aseel": true,
    "cheer_5__malik": true,
    "cheer_6": true,
    "cheer_6__aseel": true,
    "cheer_6__malik": true,
    "instr_count_1": true,
    "instr_count_2": true,
    "instr_feed_1": true,
    "instr_feed_no": true,
    "instr_letters_1": true,
    "instr_letters_2": true,
    "instr_letters_phonics": true,
    "instr_levelup": true,
    "instr_math_1": true,
    "instr_math_2": true,
    "instr_math_minus": true,
    "instr_math_plus": true,
    "instr_sort_color": true,
    "instr_sort_combo": true,
    "instr_sort_shape": true,
    "instr_train_1": true,
    "instr_welcome": true,
    "letter_a": true,
    "letter_b": true,
    "letter_c": true,
    "letter_d": true,
    "letter_e": true,
    "letter_f": true,
    "letter_g": true,
    "letter_h": true,
    "letter_i": true,
    "letter_j": true,
    "letter_k": true,
    "letter_l": true,
    "letter_m": true,
    "letter_n": true,
    "letter_o": true,
    "letter_p": true,
    "letter_q": true,
    "letter_r": true,
    "letter_s": true,
    "letter_t": true,
    "letter_u": true,
    "letter_v": true,
    "letter_w": true,
    "letter_x": true,
    "letter_y": true,
    "letter_z": true,
    "mini_1": true,
    "mini_2": true,
    "mini_3": true,
    "num_1": true,
    "num_10": true,
    "num_11": true,
    "num_12": true,
    "num_13": true,
    "num_14": true,
    "num_15": true,
    "num_16": true,
    "num_17": true,
    "num_18": true,
    "num_19": true,
    "num_2": true,
    "num_20": true,
    "num_3": true,
    "num_4": true,
    "num_5": true,
    "num_6": true,
    "num_7": true,
    "num_8": true,
    "num_9": true,
    "oops_1": true,
    "oops_2": true,
    "oops_3": true,
    "ph_a": true,
    "ph_b": true,
    "ph_c": true,
    "ph_d": true,
    "ph_e": true,
    "ph_f": true,
    "ph_g": true,
    "ph_h": true,
    "ph_i": true,
    "ph_j": true,
    "ph_k": true,
    "ph_l": true,
    "ph_m": true,
    "ph_n": true,
    "ph_o": true,
    "ph_p": true,
    "ph_q": true,
    "ph_r": true,
    "ph_s": true,
    "ph_t": true,
    "ph_u": true,
    "ph_v": true,
    "ph_w": true,
    "ph_x": true,
    "ph_y": true,
    "ph_z": true,
    "sight_am": true,
    "sight_and": true,
    "sight_at": true,
    "sight_can": true,
    "sight_go": true,
    "sight_he": true,
    "sight_in": true,
    "sight_is": true,
    "sight_it": true,
    "sight_like": true,
    "sight_my": true,
    "sight_on": true,
    "sight_play": true,
    "sight_see": true,
    "sight_she": true,
    "sight_the": true,
    "sight_to": true,
    "sight_up": true,
    "sight_we": true,
    "sight_you": true,
    "word_bear": true,
    "word_cake": true,
    "word_carrot": true,
    "word_cloud": true,
    "word_dog": true,
    "word_donut": true,
    "word_duck": true,
    "word_fish": true,
    "word_frog": true,
    "word_heart": true,
    "word_monkey": true,
    "word_owl": true,
    "word_panda": true,
    "word_rabbit": true,
    "word_star": true,
    "word_sun": true,
    "word_tree": true
};

/* Egyptian-Arabic buddy banter bundle: assets/audio/ar/<key>.mp3 */
var VO_AR_FILES = {
    "blinky_cheer_1": true,
    "blinky_cheer_2": true,
    "blinky_cheer__aseel": true,
    "blinky_cheer__malik": true,
    "blinky_hello": true,
    "blinky_hello__aseel": true,
    "blinky_hello__malik": true,
    "captain_cheer_1": true,
    "captain_cheer_2": true,
    "captain_cheer__aseel": true,
    "captain_cheer__malik": true,
    "captain_hello": true,
    "captain_hello__aseel": true,
    "captain_hello__malik": true,
    "fairy_cheer_1": true,
    "fairy_cheer_2": true,
    "fairy_cheer__aseel": true,
    "fairy_cheer__malik": true,
    "fairy_hello": true,
    "fairy_hello__aseel": true,
    "fairy_hello__malik": true,
    "fuzzy_cheer_1": true,
    "fuzzy_cheer_2": true,
    "fuzzy_cheer__aseel": true,
    "fuzzy_cheer__malik": true,
    "fuzzy_hello": true,
    "fuzzy_hello__aseel": true,
    "fuzzy_hello__malik": true,
    "luna_cheer_1": true,
    "luna_cheer_2": true,
    "luna_cheer__aseel": true,
    "luna_cheer__malik": true,
    "luna_hello": true,
    "luna_hello__aseel": true,
    "luna_hello__malik": true,
    "princess_cheer_1": true,
    "princess_cheer_2": true,
    "princess_cheer__aseel": true,
    "princess_cheer__malik": true,
    "princess_hello": true,
    "princess_hello__aseel": true,
    "princess_hello__malik": true
};
