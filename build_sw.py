import re,os,glob
s=open('sw.js').read()
m=re.match(r"var CACHE = 'kidslearn-v(\d+)';",s); v=int(m.group(1))
s=re.sub(r"kidslearn-v\d+","kidslearn-v%d"%(v+1),s,1)
need=['js/sh-pools.js','js/sh-avail.js']+sorted(glob.glob('assets/audio/sh/*.m4a')+glob.glob('assets/audio/sh/*.mp3'))
for f in need:
    if '"%s"'%f not in s:
        s=s.replace('"js/vo-manifest.js"','"%s", "js/vo-manifest.js"'%f,1)
open('sw.js','w').write(s); print('cache v',v+1)
