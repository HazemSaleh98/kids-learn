// node build_sh.js -> js/sh-avail.js (which Shalabi variety lines have audio) + assets/audio/sh/new-lines.tsv
const fs = require('fs'); const SHV = require('./js/sh-pools.js');
const dir = 'assets/audio/sh'; const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
const avail = {}; const rows = [];
Object.keys(SHV).forEach((p) => Object.keys(SHV[p]).forEach((id) => {
  rows.push([id, p, SHV[p][id][0]].join('\t'));
  const f = files.find((x) => x === id + '.m4a') || files.find((x) => x === id + '.mp3'); if (f) avail[id] = f.split('.').pop();
}));
fs.writeFileSync('js/sh-avail.js', 'var SH_AVAIL = ' + JSON.stringify(avail) + ';\n');
fs.writeFileSync('new-sh-lines.tsv', 'id\tpool\ttext\n' + rows.join('\n') + '\n');
console.log(rows.length + ' lines, ' + Object.keys(avail).length + ' with audio');
