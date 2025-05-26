const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 📅 データ
const holidays = [
  { date: '07/21/2025 (Sun)', name: 'Marine Day!' },
  { date: '09/15/2025 (Mon)', name: 'Respect for the Aged Day!' },
  { date: '09/23/2025 (Tue)', name: 'Autumnal Equinox Day!' },
];

// 🔧 スケーリング係数
const scale = 2;

const lineHeight = 20;
const topPadding = 12;
const bottomPadding = 6;
const leftPadding = 12;
const width = 600;
const height = topPadding + holidays.length * lineHeight + bottomPadding;

const canvas = createCanvas(width * scale, height * scale);
const ctx = canvas.getContext('2d');

ctx.scale(scale, scale);

// 背景（白）
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);

// フォントと文字色
ctx.font = '14px "monospace"';
ctx.fillStyle = '#000000';
ctx.textBaseline = 'top';

// 🖋 テキスト描画
holidays.forEach((item, i) => {
  const y = topPadding + i * lineHeight;
  ctx.fillText(`${item.date} ${item.name}`, leftPadding, y);
});

// 🔲 オレンジ色の枠線を描く
ctx.strokeStyle = '#e7721c';
ctx.lineWidth = 2;
ctx.strokeRect(1, 1, width - 2, height - 2); // 少し内側に描くことで線が途切れない

// 💾 保存
const buffer = canvas.toBuffer('image/png');
const outPath = path.join(__dirname, 'public/holiday_notice.png');

sharp(buffer)
  .resize(width, height)
  .toFile(outPath)
  .then(() => console.log(`✅ Sharp image saved: ${outPath}`))
  .catch(console.error);
