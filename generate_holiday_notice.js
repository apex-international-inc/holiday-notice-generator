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

// 🔧 スケーリング係数（高くするほどシャープ、4などもOK）
const scale = 2;

const lineHeight = 20;
const topPadding = 0;
const bottomPadding = 0;
const leftPadding = 2;
const width = 480;
const height = topPadding + holidays.length * lineHeight + bottomPadding;

// 📐 高解像度キャンバス作成
const canvas = createCanvas(width * scale, height * scale);
const ctx = canvas.getContext('2d');

// スケーリング適用（描画のスケールを調整）
ctx.scale(scale, scale);

// 背景（白）
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);

// フォント設定（サイズは scale に合わせて変えなくてOK）
ctx.font = '14px "monospace"';
ctx.fillStyle = '#000000';
ctx.textBaseline = 'top';

// 🖋 テキスト描画
holidays.forEach((item, i) => {
  const y = topPadding + i * lineHeight;
  ctx.fillText(`${item.date} ${item.name}`, leftPadding, y);
});

// 💾 画像をsharpでリサイズして保存
const buffer = canvas.toBuffer('image/png');
const outPath = path.join(__dirname, 'public/holiday_notice.png');

sharp(buffer)
  .resize(width, height) // ← ここでピクセル数を元サイズに戻す
  .toFile(outPath)
  .then(() => console.log(`✅ Sharp image saved: ${outPath}`))
  .catch(console.error);