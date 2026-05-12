import { z } from 'zod';

const GHSASchema = z.object({
    data: z.object({
        securityAdvisories: z.object({
            nodes: z.array(z.object({
                ghsaId: z.string(),
                summary: z.string(),
                description: z.string(),
                severity: z.string(),
                publishedAt: z.string(),
                vulnerabilities: z.array(z.object({
                    package: z.object({
                        name: z.string(),
                        ecosystem: z.string()
                    }),
                    severity: z.string(),
                    vulnerableVersionRange: z.string()
                }))
            }))
        })
    })
});

type GHSANode = z.infer<typeof GHSASchema>['data']['securityAdvisories']['nodes'][number];

export async function fetchGHSACVEs(ecosystem: string = 'npm', severity: string = 'CRITICAL'): Promise<GHSANode[]> {
    const query = `
      query {
        securityAdvisories(first: 100, orderBy: { field: PUBLISHED_AT, direction: DESC }, filter: { severity: ${severity}, ecosystem: ${ecosystem} }) {
          nodes {
            ghsaId
            summary
            description
            severity
            publishedAt
            vulnerabilities(first: 5) {
              nodes {
                package { name ecosystem }
                severity
                vulnerableVersionRange
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return GHSASchema.parse(data).data.securityAdvisories.nodes;
}