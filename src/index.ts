import { syncDepsRules } from './updaters/scan-deps';
import { syncLicenseRules } from './updaters/scan-license';
import { scheduleSync } from './scheduler';

const args = process.argv.slice(2);

async function main() {
    if (args.includes('sync')) {
        const scanner = args.find(a => a.startsWith('--scanner='))?.split('=')[1];

        if (!scanner || scanner === 'scan-deps') {
            await syncDepsRules();
        }
        if (!scanner || scanner === 'scan-license') {
            await syncLicenseRules();
        }
    } else {
        scheduleSync();
        console.log('Rule sync service started. Running weekly updates.');
    }
}

main().catch(console.error);