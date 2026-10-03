import os
HERE=os.path.dirname(os.path.abspath(__file__)); APP=os.path.join(HERE,'..','src','app.html')
s=open(APP).read(); js=open(os.path.join(HERE,'house.js')).read(); data=open(os.path.join(HERE,'house.json')).read()
js=js.replace('const HOUSE=/*HOUSE*/{};','const HOUSE='+data+';')
a=s.index('/*<house>*/'); b=s.index('/*</house>*/')
s=s[:a]+'/*<house>*/\n'+js+'\n'+s[b:]
open(APP,'w').write(s); print('injected', len(js), 'chars; app', len(s))
