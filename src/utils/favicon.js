// src/utils/favicon.js
export function setCircularFavicon(imageUrl) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Draw circular clipping path
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background with WHITE so dark logo is visible
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 64, 64);

    // Draw logo centered and bigger
    const size = 44;
    const offset = (64 - size) / 2;
    ctx.drawImage(img, offset, offset, size, size);

    // Add green border ring
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.strokeStyle = '#9FE870';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Set as favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  };
  img.src = imageUrl;
}
