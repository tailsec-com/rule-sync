import cron from 'node-cron';

export function scheduleSync(): void {
    cron.schedule('0 2 * * 0', async () => {
        console.log('Starting weekly rule sync...');
        const { syncDepsRules } = await import('./updaters/scan-deps');
        await syncDepsRules();
        console.log('Weekly rule sync complete.');
    });
}