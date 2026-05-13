/**
 * @license MIT
 * Copyright (c) 2024 Tailsec
 */

import { z } from 'zod';

const OSVSchema = z.object({
    id: z.string(),
    summary: z.string(),
    details: z.string(),
    severity: z.array(z.object({
        type: z.string(),
        score: z.string(),
        package: z.object({
            name: z.string(),
            ecosystem: z.string()
        })
    })).optional(),
    affected: z.array(z.object({
        package: z.object({
            name: z.string(),
            ecosystem: z.string()
        }),
        ranges: z.array(z.object({
            type: z.string(),
            events: z.array(z.object({
                introduced: z.string().optional(),
                fixed: z.string().optional()
            }))
        }))
    }))
});

type OSV = z.infer<typeof OSVSchema>;

export async function fetchOSVVulns(ecosystem: string = 'npm'): Promise<OSV[]> {
    const response = await fetch(
        `https://api.osv.dev/v1/query?package=${ecosystem}`
    );

    if (!response.ok) {
        throw new Error(`OSV API error: ${response.status}`);
    }

    const data = await response.json();
    return OSVSchema.array().parse(data.vulns || []);
}

export async function fetchOSVByPackage(pkg: string, ecosystem: string = 'npm'): Promise<OSV[]> {
    const response = await fetch('https://api.osv.dev/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: { name: pkg, ecosystem } })
    });

    if (!response.ok) {
        throw new Error(`OSV API error: ${response.status}`);
    }

    const data = await response.json();
    return OSVSchema.array().parse(data.vulns || []);
}