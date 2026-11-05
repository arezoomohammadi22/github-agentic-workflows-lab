# Validation notes — 2026-11-05

## Verified locally

- Node.js v22.16.0: `npm run check` passed.
- `npm test`: all seven unit/API tests passed.
- `npm run coverage`: completed and generated built-in Node.js coverage report.
- `npm run build`: built `dist/`.
- `npm run smoke`: passed HTTP requests against code loaded from `dist/`.
- YAML frontmatter / CI workflow YAML parsed successfully with PyYAML.
- Fault injection: changing `>= 5_000` to `> 5_000` caused the expected shipping-threshold unit test to fail (exit 1); restored source and verified green tests.

## Not verified in this isolated environment

- `gh aw compile`: GitHub CLI (`gh`) and gh-aw are not installed, and this environment cannot download external packages. The generated `.lock.yml` files MUST be created by running `gh aw compile` after extraction.
- GitHub-hosted Copilot runs and PR comments: require your GitHub repository, billing/access, authentication and Actions permissions.
- `docker build`: Docker is not available locally here; the CI workflow defines the actual Docker build step for a GitHub-hosted Linux runner.
- GHCR publish and Kubernetes apply: require a configured GitHub repository and deployment environment. No external deployment was performed.

These limitations matter: this is a tested application and documented workflow *source* project, not a claim that the agentic integration was exercised against GitHub.
