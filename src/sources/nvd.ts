/**
 * @license MIT
 * Copyright (c) 2024 Tailsec
 */

import { z } from 'zod';

const CVESchema = z.object({
    id: z.string(),
    source: z.object({
        name: z.string()
    }),
    published: z.string(),
    summary: z.string(),
    vulnerabilities: z.array(z.object({
        criteria: z.object({
            version: z.string(),
            name: z.string(),
            value: z.string()
        })
    }))
});

type CVE = z.infer<typeof CVESchema>;

export async function fetchCVEData(year: number): Promise<CVE[]> {
    const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0/?pubStartDate=${year}-01-01T00:00:00.000&pubEndDate=${year}-12-31T23:59:59.999`
    );

    if (!response.ok) {
        throw new Error(`NVD API error: ${response.status}`);
    }

    const data = await response.json();
    return CVESchema.array().parse(data.vulnerabilities);
}

export async function fetchCriticalCVEs(severity: 'CRITICAL' | 'HIGH' = 'CRITICAL'): Promise<CVE[]> {
    const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0/?cvssV3Severity=${severity}`
    );

    if (!response.ok) {
        throw new Error(`NVD API error: ${response.status}`);
    }

    const data = await response.json();
    return CVESchema.array().parse(data.vulnerabilities);
}