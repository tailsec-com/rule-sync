# Tailsec Rule Sync Service

Automatically updates Tailsec rule databases with the latest CVE and vulnerability data.

## Data Sources

- **NVD** (National Vulnerability Database) - CVE feeds
- **OSV.dev** - Open Source Vulnerability format
- **GitHub Security Advisories** - GHSA database
- **Snyk** - Vulnerability Database

## Synced Rules

| Scanner | Update Frequency | Data |
|---------|-----------------|------|
| scan-deps | Weekly | Latest critical/high CVEs |
| scan-license | Weekly | SPDX license list updates |

## Running Locally

```bash
npm run sync           # Run all syncs
npm run sync:deps      # Sync dependency rules only
npm run sync:license   # Sync license rules only
```

## Environment Variables

- `GITHUB_TOKEN` - Required for GitHub GraphQL API access
- `SNYK_TOKEN` - Required for Snyk Vulnerability Database access

## Architecture

```
src/
  sources/     # Data source integrations (NVD, OSV, GHSA, Snyk)
  updaters/   # Scanner-specific rule update logic
  storage.ts   # JSON file persistence
  scheduler.ts # Cron-based scheduling
```