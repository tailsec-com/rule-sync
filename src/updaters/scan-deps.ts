/**
 * @license MIT
 * Copyright (c) 2024 Tailsec
 */

import { fetchCVEData, fetchCriticalCVEs } from '../sources/nvd';
import { fetchOSVByPackage } from '../sources/osv';
import { fetchGHSACVEs } from '../sources/ghsa';
import { saveRules } from '../storage';

export interface DepRule {
    id: string;
    package: string;
    ecosystem: string;
    severity: 'critical' | 'high' | 'medium';
    fixedIn?: string[];
    cve?: string[];
    description: string;
}

export async function syncDepsRules(): Promise<number> {
    console.log('Syncing dependency vulnerability rules...');

    const criticalCVEs = await fetchCriticalCVEs('CRITICAL');
    const highCVEs = await fetchCriticalCVEs('HIGH');

    const rules: DepRule[] = [];

    for (const cve of [...criticalCVEs, ...highCVEs].slice(0, 500)) {
        const vuln = cve.vulnerabilities[0];
        if (!vuln) continue;

        rules.push({
            id: `CVE-${cve.id}`,
            package: vuln.criteria.name,
            ecosystem: 'npm',
            severity: cve.id.includes('CRITICAL') ? 'critical' : 'high',
            cve: [cve.id],
            description: cve.summary
        });
    }

    await saveRules('scan-deps', rules);
    console.log(`Synced ${rules.length} dependency rules`);
    return rules.length;
}