/**
 * @license MIT
 * Copyright (c) 2024 Tailsec
 */

import { z } from 'zod';

const SnykVulnSchema = z.object({
    id: z.string(),
    title: z.string(),
    severity: z.string(),
    description: z.string(),
    packageName: z.string(),
    packageManager: z.string(),
    fixedIn: z.array(z.string()).optional()
});

type SnykVuln = z.infer<typeof SnykVulnSchema>;

export async function fetchSnykVulns(manager: string = 'npm'): Promise<SnykVuln[]> {
    const response = await fetch(
        `https://api.snyk.io/v1/container/${manager}/vulnerabilities`,
        {
            headers: {
                'Authorization': `token ${process.env.SNYK_TOKEN}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Snyk API error: ${response.status}`);
    }

    const data = await response.json();
    return SnykVulnSchema.array().parse(data.vulnerabilities || []);
}