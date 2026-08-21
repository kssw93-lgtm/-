"""
data.go.kr 활용신청 '대표 썸네일' 등 서비스 대표 이미지를 생성한다.
외부 API/유료 이미지 생성 서비스를 쓰지 않고 Pillow(로컬)로만 그려서 비용이 들지 않는다.
"""
from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630

FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"
FONT_REG = "C:/Windows/Fonts/malgun.ttf"

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

top = (15, 12, 41)      # #0f0c29
mid = (48, 43, 99)       # #302b63
bottom = (36, 36, 62)    # #24243e
accent = (167, 139, 250)  # violet-400 근사

img = Image.new("RGB", (W, H), top)
draw = ImageDraw.Draw(img)

for y in range(H):
    t = y / H
    if t < 0.5:
        color = lerp(top, mid, t / 0.5)
    else:
        color = lerp(mid, bottom, (t - 0.5) / 0.5)
    draw.line([(0, y), (W, y)], fill=color)

# 은은한 별 장식
import random
random.seed(7)
for _ in range(90):
    x = random.randint(0, W)
    y = random.randint(0, int(H * 0.45))
    r = random.choice([1, 1, 2])
    a = random.randint(90, 200)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255))

# 수정구슬(크리스탈볼) 아이콘
cx, cy, radius = W // 2, 215, 78
glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)
for i in range(40, 0, -1):
    a = int(3 * (40 - i) / 40 * 6)
    glow_draw.ellipse(
        [cx - radius - i, cy - radius - i, cx + radius + i, cy + radius + i],
        outline=(167, 139, 250, a),
        width=2,
    )
img = Image.alpha_composite(img.convert("RGBA"), glow_layer).convert("RGB")
draw = ImageDraw.Draw(img)

draw.ellipse(
    [cx - radius, cy - radius, cx + radius, cy + radius],
    fill=(120, 110, 190),
    outline=(210, 200, 255),
    width=3,
)
# 구슬 안쪽 하이라이트
draw.ellipse(
    [cx - 28, cy - 40, cx + 8, cy - 4],
    fill=(230, 225, 255),
)
# 받침대
draw.polygon(
    [
        (cx - 60, cy + radius + 6),
        (cx + 60, cy + radius + 6),
        (cx + 40, cy + radius + 30),
        (cx - 40, cy + radius + 30),
    ],
    fill=(196, 154, 90),
)

title_font = ImageFont.truetype(FONT_BOLD, 74)
subtitle_font = ImageFont.truetype(FONT_REG, 32)
badge_font = ImageFont.truetype(FONT_BOLD, 26)

def center_text(d, text, font, y, fill):
    bbox = d.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    d.text(((W - w) / 2, y), text, font=font, fill=fill)

center_text(draw, "오늘의 사주", title_font, 340, (245, 243, 255))
center_text(draw, "연애운 · 직업운 무료 사주풀이", subtitle_font, 430, (200, 190, 230))

# 하단 뱃지
badge_text = "24절기 기반 · 무료"
bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
bw = bbox[2] - bbox[0]
bh = bbox[3] - bbox[1]
pad_x, pad_y = 26, 14
bx0 = (W - (bw + pad_x * 2)) / 2
by0 = 500
draw.rounded_rectangle(
    [bx0, by0, bx0 + bw + pad_x * 2, by0 + bh + pad_y * 2],
    radius=28,
    fill=(167, 139, 250),
)
draw.text((bx0 + pad_x, by0 + pad_y - 4), badge_text, font=badge_font, fill=(30, 20, 60))

img.save("public_thumbnail.png")
print("saved public_thumbnail.png", img.size)
