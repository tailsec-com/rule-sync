/**
 * @license MIT
 * Copyright (c) 2024 Tailsec
 */

import { fetch } from 'fs/promises';
import { saveRules } from '../storage';

export interface LicenseRule {
    id: string;
    name: string;
    spdxId: string;
    category: 'permissions' | 'constraints' | 'prohibited';
    description: string;
}

export async function syncLicenseRules(): Promise<number> {
    console.log('Syncing license rules...');

    const response = await fetch('https://raw.githubusercontent.com/spdx/license-list-data/main/json/details.json');
    const data = await response.json();

    const rules: LicenseRule[] = Object.entries(data).map(([id, info]: [string, any]) => ({
        id,
        name: info.name,
        spdxId: id,
        category: mapLicenseCategory(info),
        description: info.description || ''
    }));

    await saveRules('scan-license', rules);
    console.log(`Synced ${rules.length} license rules`);
    return rules.length;
}

function mapLicenseCategory(info: any): 'permissions' | 'constraints' | 'prohibited' {
    if (info.isDeprecatedLicenseId) return 'prohibited';
    if (info.licenseText?.includes('NO WARRANTY')) return 'constraints';
    return 'permissions';
}