import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import QRCode from 'qrcode';

import { fetchPackageById } from '../lib/api';

const main = async () => {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: bun qr <id>');
    process.exit(1);
  }

  console.log(`Fetching package ${id}...`);
  const pkg = await fetchPackageById(id);

  const payload = {
    packageId: String(pkg.id),
    senderName: pkg.sender_name,
    generatedAt: new Date().toISOString(),
  };

  const outputPath = resolve(`./assets/qr-${String(id)}.png`);
  mkdirSync(dirname(outputPath), { recursive: true });

  await QRCode.toFile(outputPath, JSON.stringify(payload), {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    scale: 8,
  });

  console.log(`Saved: ${outputPath}`);
  console.log('Payload:');
  console.log(JSON.stringify(payload, null, 2));
};

main().catch((error) => {
  console.error('Failed to generate QR code:', error.message ?? error);
  process.exit(1);
});
