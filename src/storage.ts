import { writeFile, mkdir } from 'fs/promises';

export async function saveRules(scanner: string, rules: any[]): Promise<void> {
    const dir = `./rules/${scanner}`;
    await mkdir(dir, { recursive: true });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${dir}/${scanner}-${timestamp}.json`;
    await writeFile(filename, JSON.stringify({ rules, updated: new Date().toISOString() }, null, 2));

    await writeFile(`${dir}/latest.json`, JSON.stringify({ rules, updated: new Date().toISOString() }, null, 2));
}