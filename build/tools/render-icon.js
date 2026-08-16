const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Master: user-provided icon D:\deepseekharness\deepseek.png (431x444, alpha)
const MASTER = path.join(__dirname, '..', '..', '..', 'deepseek.png');
const SIZES = [256, 128, 64, 48, 32, 24, 16];

(async () => {
  // 256 preview used by splash/about UI
  await sharp(MASTER)
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(path.join(__dirname, '..', 'logo-256.png'));

  const entries = [];
  for (const size of SIZES) {
    const buf = await sharp(MASTER)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    entries.push({ size, buf });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  const blobs = [];
  entries.forEach((e, i) => {
    const w = e.size >= 256 ? 0 : e.size;
    dir[i * 16] = w;
    dir[i * 16 + 1] = w;
    dir[i * 16 + 2] = 0;
    dir[i * 16 + 3] = 0;
    dir.writeUInt16LE(1, i * 16 + 4);
    dir.writeUInt16LE(32, i * 16 + 6);
    dir.writeUInt32LE(e.buf.length, i * 16 + 8);
    dir.writeUInt32LE(offset, i * 16 + 12);
    blobs.push(e.buf);
    offset += e.buf.length;
  });

  const ico = Buffer.concat([header, dir, ...blobs]);
  fs.writeFileSync(path.join(__dirname, '..', 'icon.ico'), ico);
  console.log('icon.ico:', ico.length, 'bytes; sizes:', entries.map(e => e.size).join(','));
})();
