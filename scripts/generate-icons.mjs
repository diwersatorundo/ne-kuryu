import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const OUT = 'assets';

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function encodePng(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

const STOPS = [
  { at: 0, color: [233, 255, 246], alpha: 0.98 },
  { at: 0.35, color: [155, 247, 208], alpha: 0.9 },
  { at: 0.65, color: [94, 223, 192], alpha: 0.72 },
  { at: 0.86, color: [63, 143, 160], alpha: 0.34 },
  { at: 1, color: [47, 95, 112], alpha: 0 },
];

function sampleOrb(t) {
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t <= b.at) {
      const local = (t - a.at) / (b.at - a.at);
      return {
        color: mix(a.color, b.color, local),
        alpha: a.alpha + (b.alpha - a.alpha) * local,
      };
    }
  }
  const last = STOPS[STOPS.length - 1];
  return { color: last.color, alpha: last.alpha };
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = Buffer.alloc(width * height * 4);
  }

  over(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height || a <= 0) {
      return;
    }
    const index = (y * this.width + x) * 4;
    const dstA = this.pixels[index + 3] / 255;
    const outA = a + dstA * (1 - a);
    if (outA <= 0) {
      this.pixels[index + 3] = 0;
      return;
    }
    this.pixels[index] = Math.round(
      (r * a + this.pixels[index] * dstA * (1 - a)) / outA,
    );
    this.pixels[index + 1] = Math.round(
      (g * a + this.pixels[index + 1] * dstA * (1 - a)) / outA,
    );
    this.pixels[index + 2] = Math.round(
      (b * a + this.pixels[index + 2] * dstA * (1 - a)) / outA,
    );
    this.pixels[index + 3] = Math.round(outA * 255);
  }

  fillBackground() {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.42;
    const radius = this.width * 0.85;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const dx = x - centerX;
        const dy = y - centerY;
        const t = Math.min(1, Math.sqrt(dx * dx + dy * dy) / radius);
        const color = mix([15, 21, 30], [6, 8, 11], smoothstep(0, 1, t));
        this.over(x, y, color[0], color[1], color[2], 1);
      }
    }
  }

  glow(cx, cy, radius, color, strength) {
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
        const dx = (x - cx) / radius;
        const dy = (y - cy) / radius;
        const t = Math.sqrt(dx * dx + dy * dy);
        if (t > 1) {
          continue;
        }
        const alpha = Math.pow(1 - t, 2.2) * strength;
        this.over(x, y, color[0], color[1], color[2], alpha);
      }
    }
  }

  orb(cx, cy, radius, monochrome = false, cutout = null) {
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
        const dx = (x - cx) / radius;
        const dy = (y - cy) / radius;
        const t = Math.sqrt(dx * dx + dy * dy);
        if (t > 1) {
          continue;
        }
        let cut = 1;
        if (cutout) {
          const cdx = x - cutout.cx;
          const cdy = y - cutout.cy;
          const distance = Math.sqrt(cdx * cdx + cdy * cdy);
          cut = smoothstep(cutout.radius * 0.82, cutout.radius, distance);
        }
        if (monochrome) {
          const alpha = (1 - smoothstep(0.72, 1, t)) * cut;
          this.over(x, y, 255, 255, 255, alpha);
        } else {
          const sample = sampleOrb(t);
          this.over(
            x,
            y,
            sample.color[0],
            sample.color[1],
            sample.color[2],
            sample.alpha * cut,
          );
        }
      }
    }

    if (!monochrome) {
      this.glow(
        cx - radius * 0.28,
        cy - radius * 0.32,
        radius * 0.62,
        [255, 255, 255],
        0.24,
      );
      this.glow(
        cx + radius * 0.34,
        cy + radius * 0.38,
        radius * 0.74,
        [156, 140, 255],
        0.16,
      );
    }
  }

  dot(cx, cy, radius, monochrome = false) {
    this.glow(
      cx,
      cy,
      radius * 2.4,
      monochrome ? [255, 255, 255] : [138, 240, 196],
      monochrome ? 0.18 : 0.3,
    );
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
        const dx = (x - cx) / radius;
        const dy = (y - cy) / radius;
        const t = Math.sqrt(dx * dx + dy * dy);
        if (t > 1) {
          continue;
        }
        const alpha = 1 - smoothstep(0.72, 1, t);
        const color = monochrome
          ? [255, 255, 255]
          : mix([220, 255, 241], [138, 240, 196], t);
        this.over(x, y, color[0], color[1], color[2], alpha);
      }
    }
  }

  toFile(file) {
    writeFileSync(file, encodePng(this.width, this.height, this.pixels));
  }
}

function makeMark(size, { background, orbRatio, mono, safeRatio = 0.9 }) {
  const canvas = new Canvas(size, size);
  if (background) {
    canvas.fillBackground();
  }
  const cx = size * 0.5;
  const cy = size * 0.48;
  const radius = size * orbRatio * safeRatio;
  if (background && !mono) {
    canvas.glow(cx, cy, radius * 1.8, [94, 200, 180], 0.12);
  }
  canvas.orb(cx, cy, radius, mono, {
    cx: cx + radius * 0.52,
    cy: cy - radius * 0.44,
    radius: radius * 0.6,
  });
  canvas.dot(cx + radius * 0.8, cy + radius * 0.84, radius * 0.17, mono);
  return canvas;
}

makeMark(1024, { background: true, orbRatio: 0.34, mono: false }).toFile(
  `${OUT}/icon.png`,
);
makeMark(1024, { background: false, orbRatio: 0.3, mono: false }).toFile(
  `${OUT}/android-icon-foreground.png`,
);
makeMark(1024, { background: false, orbRatio: 0.3, mono: true }).toFile(
  `${OUT}/android-icon-monochrome.png`,
);
makeMark(1024, { background: false, orbRatio: 0.32, mono: false }).toFile(
  `${OUT}/splash-icon.png`,
);
makeMark(64, { background: true, orbRatio: 0.36, mono: false }).toFile(
  `${OUT}/favicon.png`,
);

console.log('Generated Nicotiny icon assets.');
