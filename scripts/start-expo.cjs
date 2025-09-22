// makes sure dev client starts on my 192 ip and not on 127.

#!/usr/bin/env node
const os = require('os');
const { spawn } = require('child_process');

function pickLanIPv4(addresses) {
  const priorities = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[0-1])\./];
  for (const pattern of priorities) {
    const match = addresses.find((addr) => pattern.test(addr.address));
    if (match) {
      return match;
    }
  }
  return addresses[0] ?? null;
}

function collectAddresses() {
  const interfaces = os.networkInterfaces();
  const results = [];
  for (const [name, entries] of Object.entries(interfaces)) {
    for (const entry of entries ?? []) {
      if (!entry || entry.internal || entry.family !== 'IPv4') {
        continue;
      }
      results.push({ interface: name, address: entry.address });
    }
  }
  return results;
}

const env = { ...process.env };
let chosenHost = env.EXPO_PACKAGER_HOSTNAME || env.REACT_NATIVE_PACKAGER_HOSTNAME;

if (!chosenHost) {
  const addresses = collectAddresses();
  const selected = pickLanIPv4(addresses);
  if (selected) {
    chosenHost = selected.address;
    console.log(`Detected LAN IPv4 ${chosenHost} on ${selected.interface}`);
  } else {
    console.warn('Could not detect a non-loopback IPv4 address; Expo will pick a host automatically.');
  }
}

if (chosenHost) {
  env.EXPO_PACKAGER_HOSTNAME = chosenHost;
  env.REACT_NATIVE_PACKAGER_HOSTNAME = chosenHost;
}

const extraArgs = process.argv.slice(2).filter((arg) => arg !== '--');
const expoArgs = ['expo', 'start', '--dev-client', '--host', 'lan', ...extraArgs];

const spawnOptions = {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
};

const command = process.platform === 'win32' ? 'bunx' : 'bunx';
const child = spawn(command, expoArgs, spawnOptions);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

child.on('error', (error) => {
  console.error('Failed to launch Expo CLI:', error);
  process.exit(typeof error.code === 'number' ? error.code : 1);
});
