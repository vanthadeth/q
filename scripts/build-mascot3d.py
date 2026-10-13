"""Build the app's Muggo 3D assets from the supplied PNGs.

Usage: python3 scripts/build-mascot3d.py <dir-with-muggo-3d-*.png>
Writes transparent 640 px WebP files to assets/mascot3d/ (about 45 KB each, down from ~850 KB).

Each pose gets a soft navy drop shadow baked in so the cream limbs stand out on the light
background: a wide ambient shadow for lift and a tight contact shadow for edge definition.
The art is scaled to leave room for the shadow, and it stays subtle on dark.
"""
import os
import sys
from PIL import Image, ImageChops, ImageFilter

SIZE = 640
QUALITY = 85
SCALE = 0.88          # art is scaled down to leave room for the shadow
LIFT = -26            # shift the art up so the shadow has room below (px at source size)
NAVY = (21, 26, 54)   # #151A36, the brand navy

# (offset y, blur radius, strength) at source size (1254 px)
AMBIENT = (32, 36, 0.48)
CONTACT = (9, 8, 0.38)


def shadow(alpha, dy, blur, strength):
    a = ImageChops.offset(alpha, 0, dy).filter(ImageFilter.GaussianBlur(blur))
    a = a.point(lambda v: int(v * strength))
    layer = Image.new('RGBA', alpha.size, NAVY + (0,))
    layer.putalpha(a)
    return layer


def with_shadow(im):
    w, h = im.size
    art = im.resize((int(w * SCALE), int(h * SCALE)), Image.LANCZOS)
    canvas = Image.new('RGBA', im.size, (0, 0, 0, 0))
    canvas.paste(art, ((w - art.width) // 2, (h - art.height) // 2 + LIFT), art)
    alpha = canvas.getchannel('A')
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    out = Image.alpha_composite(out, shadow(alpha, *AMBIENT))
    out = Image.alpha_composite(out, shadow(alpha, *CONTACT))
    return Image.alpha_composite(out, canvas)


src = sys.argv[1]
out_dir = os.path.join(os.path.dirname(__file__), '..', 'assets', 'mascot3d')
os.makedirs(out_dir, exist_ok=True)
total = 0
for name in sorted(os.listdir(src)):
    if not (name.startswith('muggo-3d-') and name.endswith('.png')):
        continue
    pose = name[len('muggo-3d-'):-len('.png')]
    im = Image.open(os.path.join(src, name)).convert('RGBA')
    final = with_shadow(im).resize((SIZE, SIZE), Image.LANCZOS)
    dest = os.path.join(out_dir, pose + '.webp')
    final.save(dest, 'WEBP', quality=QUALITY, method=4)
    total += os.path.getsize(dest)
    print(f'{pose}: {os.path.getsize(dest) // 1024} KB')
print(f'total {total // 1024} KB')
