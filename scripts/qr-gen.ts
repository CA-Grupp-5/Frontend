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
  temperatureC?: number;
  humidity?: number;
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
      case '--temperature':
        opts.temperatureC = value ? Number.parseFloat(value) : undefined;
        break;
      case '--humidity':
        opts.humidity = value ? Number.parseFloat(value) : undefined;
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

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, precision = 1) => {
  const factor = 10 ** precision;
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

const main = async () => {
  const { id, recipient, address, notes, temperatureC, humidity, out } = parseArgs();

  const packageId = id ?? `PKG${String(randomInt(1, 50)).padStart(3, '0')}`;
  const payload = {
    packageId,
    recipient,
    address,
    notes,
    temperatureC: typeof temperatureC === 'number' && Number.isFinite(temperatureC) ? temperatureC : randomFloat(4, 10),
    humidity: typeof humidity === 'number' && Number.isFinite(humidity) ? humidity : randomInt(40, 80),
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
