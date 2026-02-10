// src/utils/favicon.js
export function setCircularFavicon(imageUrl) {
  const size = 128;
  const center = size / 2;
  const radius = 60;
  const logoSize = 100;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const offset = (size - logoSize) / 2;
    ctx.drawImage(img, offset, offset, logoSize, logoSize);

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#9FE870';
    ctx.lineWidth = 4;
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
