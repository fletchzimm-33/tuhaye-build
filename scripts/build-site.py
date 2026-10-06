# Builds the public page (index.html at the repo root) from src/app.html.
# src/app.html is the same page as the Claude artifact: a body fragment that its host wraps. This adds the document shell,
# the phone viewport, link-preview tags and icons.  Run from anywhere:  python3 scripts/build-site.py
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src=open(os.path.join(ROOT,'src','app.html')).read()
cut=src.index('</style>')+len('</style>')
head, body=src[:cut], src[cut:].lstrip('\n')
SITE='https://ridgeline-residence-3d-walkthrough.vercel.app/'
desc='Ridgeline Residence: an interactive, to-scale 3D walkthrough built from the architectural plans. Tour the exterior, walk every room on both levels, try furniture layouts, finishes and lighting.'
meta=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#f1f1ec" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16191c" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:title" content="Ridgeline Residence · Interactive 3D walkthrough">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}">
<meta property="og:image" content="{SITE}preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="icon-64.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
'''
extra='<style>body{margin:0} @supports (height:100dvh){ html,body{height:100dvh} }</style>\n'
html=meta+head+'\n'+extra+'</head>\n<body>\n'+body.rstrip()+'\n</body>\n</html>\n'
open(os.path.join(ROOT,'index.html'),'w').write(html)
print('wrote index.html', len(html), 'bytes')
