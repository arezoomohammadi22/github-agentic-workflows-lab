# Instructor demo — reproducing a PR regression

The baseline is green (`npm run check && npm test && npm run build && npm run smoke`).
Before opening any demonstration PR, merge the compiled agentic workflow
`.lock.yml` files into the **default** branch; events will not activate from
Markdown-only source.

## Scenario A — passing code, insufficient new tests

1. Branch from main: `git switch -c demo/new-coupon`.
2. Extend the accepted coupon list and calculation in `src/quote.js` to support
   `SAVE20`, but deliberately do not add a new unit test.
3. Commit and push the branch; open a PR against `main`.
4. The regular CI might still be green. The PR agent should identify the
   missing `SAVE20` cases (amount rounding, validation, shipping interaction)
   rather than treating green CI as sufficient coverage. AI output is
   probabilistic and may miss issues; human review remains necessary.

## Scenario B — an unambiguous red CI

1. Start again from a green main: `git switch main && git switch -c demo/break-threshold`.
2. In `src/quote.js`, deliberately change the shipping condition
   `discountedCents >= 5_000` into `discountedCents > 5_000`.
3. Run `npm test` and observe the test named
   `free shipping includes the exact $50 threshold` fail.
4. Commit and push; open a PR. GitHub CI will fail its test step and the
   CI Doctor workflow should inspect the failed run and report a plausible
   root cause on the matching PR when the event supplies a verifiable PR link.
5. Restore `>=`, commit and push; verify the CI turns green.

## Demonstration boundaries

- Do not merge the deliberately broken branch.
- Do not give agents production credentials, registry passwords or cluster access.
- `publish-image.yml` only publishes an image, it does not deploy to Kubernetes.
- Copilot access, organization policy, GitHub Actions settings and charges need
  to be configured before the agentic workflows run online.
- The `workflow_run` event may not provide a related PR for every run,
  particularly forks. The sample CI Doctor deliberately skips commenting in
  that case rather than guessing a target.
