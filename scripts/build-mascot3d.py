"""Build the app's Muggo 3D assets from the supplied PNGs.

Usage: python3 scripts/build-mascot3d.py <dir-with-muggo-3d-*.png>
Writes transparent 640 px WebP files to assets/mascot3d/ (about 40 KB each, down from ~850 KB).
"""
import os
import sys
from PIL import Image

SIZE = 640
QUALITY = 85

src = sys.argv[1]
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'mascot3d')
os.makedirs(out, exist_ok=True)
total = 0
for name in sorted(os.listdir(src)):
    if not (name.startswith('muggo-3d-') and name.endswith('.png')):
        continue
    pose = name[len('muggo-3d-'):-len('.png')]
    im = Image.open(os.path.join(src, name)).convert('RGBA').resize((SIZE, SIZE), Image.LANCZOS)
    dest = os.path.join(out, pose + '.webp')
    im.save(dest, 'WEBP', quality=QUALITY, method=4)
    total += os.path.getsize(dest)
    print(f'{pose}: {os.path.getsize(dest) // 1024} KB')
print(f'total {total // 1024} KB')
