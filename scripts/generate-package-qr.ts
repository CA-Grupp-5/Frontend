#!/usr/bin/env bun

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import QRCode from 'qrcode';

type CliOptions = {
  id?: string;
  recipient?: string;
  address?: string;
  notes?: string;
  out?: string;
};

const parseArgs = (): CliOptions => {
  const params = process.argv.slice(2);
  const opts: CliOptions = {};

  for (let i = 0; i < params.length; i += 1) {
    const key = params[i];
    if (!key.startsWith('--')) continue;

    const value = params[i + 1];
    switch (key) {
      case '--id':
        opts.id = value;
        break;
      case '--recipient':
        opts.recipient = value;
        break;
      case '--address':
        opts.address = value;
        break;
      case '--notes':
        opts.notes = value;
        break;
      case '--out':
        opts.out = value;
        break;
      default:
        break;
    }
  }
  return opts;
};

const usage = () => {
  console.log('Usage: bun scripts/generate-package-qr.ts --id PKG123 [--recipient "John Doe"] [--address "123 Main St"] [--notes "Leave at door"] [--out path/to/file.png]');
};

const main = async () => {
  const { id, recipient, address, notes, out } = parseArgs();

  if (!id) {
    console.error('Missing required --id option.\n');
    usage();
    process.exit(1);
    return;
  }

  const payload = {
    packageId: id,
    recipient,
    address,
    notes,
    generatedAt: new Date().toISOString(),
  };

  const outputPath = resolve(out ?? './assets/generated-package-qr.png');
  mkdirSync(dirname(outputPath), { recursive: true });

  await QRCode.toFile(outputPath, JSON.stringify(payload), {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    scale: 8,
  });

  console.log(`QR code saved to: ${outputPath}`);
  console.log('Payload:');
  console.log(JSON.stringify(payload, null, 2));
};

main().catch((error) => {
  console.error('Failed to generate QR code:', error);
  process.exit(1);
});
