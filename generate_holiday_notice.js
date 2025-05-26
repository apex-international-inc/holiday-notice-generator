require('dotenv').config();
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const https = require('https');

// 💡 APIキーとURL（環境変数で管理するのが安全）
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL + "3";

// 🔧 スケーリング係数やスタイル
const scale = 2;
const lineHeight = 20;
const topPadding = 12;
const bottomPadding = 6;
const leftPadding = 12;
const rightPadding = 12;

// 🧠 JSONをHTTPSで取得
function fetchJson(url) {
  console.log(`🔗 Fetching data from: ${url}`);
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'x-api-key': API_KEY 
        }
      },
      (res) => {
        console.log(`🌐 Response status: ${res.statusCode}`);
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => resolve(JSON.parse(raw)));
      }
    ).on('error', reject);
  });
}

// 🎨 メイン処理
(async () => {
  try {
    const { holidays } = await fetchJson(API_URL);
    console.log(`📅 ${holidays.length} holidays fetched.`);
    // 最大文字幅を計算
    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = '14px "monospace"';
    const textWidths = holidays.map((h) => {
      const dateWidth = tempCtx.measureText(h.date).width;
      const nameWidth = tempCtx.measureText(' ' + h.name).width;
      return dateWidth + nameWidth;
    });
    const maxTextWidth = Math.max(...textWidths);

    // キャンバスサイズ
    const width = Math.ceil(Math.max(480, maxTextWidth + leftPadding + rightPadding));
    const height = topPadding + holidays.length * lineHeight + bottomPadding;

    // キャンバス生成
    const canvas = createCanvas(width * scale, height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'top';

    // 描画
    holidays.forEach((item, i) => {
      const y = topPadding + i * lineHeight;

      ctx.font = 'bold 14px "monospace"';
      ctx.fillStyle = '#000000';
      ctx.fillText(item.date, leftPadding, y);
      const dateWidth = ctx.measureText(item.date).width;

      ctx.font = '14px "monospace"';
      ctx.fillText(' ' + item.name, leftPadding + dateWidth, y);
    });

    // 枠線
    ctx.strokeStyle = '#e7721c';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // 保存
    const buffer = canvas.toBuffer('image/png');
    const outPath = path.join(__dirname, 'public/holiday_notice.png');

    await sharp(buffer).resize(width, height).toFile(outPath);
    console.log(`✅ Image saved: ${outPath}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
