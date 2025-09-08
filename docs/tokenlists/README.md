# ARCx Token List

This folder contains the Uniswap-compatible token list for ARCx on Base.

- Canonical list: `docs/tokenlists/arcx.tokenlist.json`
- Canonical logo: `docs/assets/logos/arcx_logo.svg` (vector)
- logoURI used in the list (both list-level and token-level):
  - [raw GitHub SVG](https://raw.githubusercontent.com/Artifact-Virtual/arc_ecosystem/main/docs/assets/logos/arcx_logo.svg)


Validation checklist:

- JSON schema valid per tokenlists.org
- Checksummed address: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437` (Base, 8453)
- decimals: 18
- Unique symbol: ARCX2


Submission options:

- Host this list at the raw GitHub URL above and add it to interfaces that support Token Lists (recommended).
- Optionally submit the list URL to community aggregators (e.g., tokenlists.org registry) for discovery.


Maintenance:

- When updating, bump the `version` and `timestamp` fields.
- Keep the SVG logo path stable to avoid cache churn.
