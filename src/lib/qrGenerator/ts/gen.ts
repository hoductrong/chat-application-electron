import qrcodegen from 'nayuki-qr-code-generator';

export async function doBasicDemo(text: string): Promise<string> {
  const errCorLvl: qrcodegen.QrCode.Ecc = qrcodegen.QrCode.Ecc.MEDIUM; // Error correction level
  const qr: qrcodegen.QrCode = qrcodegen.QrCode.encodeText(text, errCorLvl); // Make the QR Code symbol
  const qrStr = toSvgString(qr, 4, '#FFFFFF', '#000000'); // Output SVG string

  return qrStr;
}

export async function genQrImage(
  text: string,
  scale: number,
  border: number,
): Promise<Uint8Array> {
  const errCorLvl: qrcodegen.QrCode.Ecc = qrcodegen.QrCode.Ecc.LOW; // Error correction level
  const qr: qrcodegen.QrCode = qrcodegen.QrCode.encodeText(text, errCorLvl); // Make the QR Code symbol
  const png = await generateQrCodePng(qr, border, scale, '#FFFFFF', '#000000'); // Output SVG string
  return png;
}

async function generateQrCodePng(
  qr: qrcodegen.QrCode,
  border: number,
  scale: number,
  lightColor: string,
  darkColor: string,
): Promise<Uint8Array> {
  const width: number = (qr.size + border * 2) * scale;
  const canvas = new OffscreenCanvas(width, width);
  const ctx = canvas.getContext('2d')!;

  for (let y = -border; y < qr.size + border; y++) {
    for (let x = -border; x < qr.size + border; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
    }
  }

  const blob = await canvas.convertToBlob({ type: 'image/png', quality: 1 });
  const buffer = await blob.arrayBuffer();

  return new Uint8Array(buffer);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function toSvgString(
  qr: qrcodegen.QrCode,
  border: number,
  lightColor: string,
  darkColor: string,
): string {
  if (border < 0) throw new RangeError('Border must be non-negative');
  const parts: Array<string> = [];
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y))
        parts.push(`M${x + border},${y + border}h1v1h-1z`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${
    qr.size + border * 2
  } ${qr.size + border * 2}" stroke="none">
<rect width="100%" height="100%" fill="${lightColor}"/>
<path d="${parts.join(' ')}" fill="${darkColor}"/>
</svg>
`;
}
