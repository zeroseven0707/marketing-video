# Gabung still QA menjadi lembar kontak: python3 scripts/qa-sheet.py out.png a.png b.png ...
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f) for f in files]
w, h = ims[0].size
cols = min(4, len(ims))
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (w * cols + 8 * (cols - 1), h * rows + 8 * (rows - 1) + 0), 'white')
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * (w + 8), (i // cols) * (h + 8)
    sheet.paste(im, (x, y))
    d.text((x + 6, y + 6), f.split('/')[-1], fill=(255, 0, 0))
sheet.save(out)
