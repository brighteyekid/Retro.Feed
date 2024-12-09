import { createCanvas } from "canvas";
import fs from "fs";

const sizes = [16, 32, 64, 192, 512];

function generateIcon(size: number) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#1a1a2e"); // retro-dark
  gradient.addColorStop(1, "#0a0a0a"); // retro-black
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Terminal frame with neon glow
  ctx.shadowColor = "#4DEEEA"; // neon-blue
  ctx.shadowBlur = size / 16;
  ctx.strokeStyle = "#4DEEEA";
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.strokeRect(size * 0.15, size * 0.15, size * 0.7, size * 0.7);

  // "RF" text (RETRO.FEED initials)
  ctx.font = `bold ${size * 0.3}px "Press Start 2P"`;
  ctx.fillStyle = "#39FF14"; // neon-green
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RF", size * 0.5, size * 0.5);

  // Add scanline effect
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < size; i += 2) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, i, size, 1);
  }

  // Add subtle noise texture
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < size * 0.1; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const pixelSize = Math.max(1, size / 64);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }

  return canvas.toBuffer("image/png");
}

// Generate icons
console.log("Generating icons...");
sizes.forEach((size) => {
  const buffer = generateIcon(size);
  const filePath = `public/logo${size}.png`;
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${filePath}`);
});

// Generate favicon.ico (16x16)
const faviconBuffer = generateIcon(16);
fs.writeFileSync("public/favicon.ico", faviconBuffer);
console.log("Generated public/favicon.ico");

console.log("Icon generation complete!");
