# Security Review Rules

## Review posture

- Assume hostile input.
- Assume attackers will chain small gaps into a major breach path.
- Prioritize exploitability, blast radius, and business impact.
- Do not inflate the score.
- Do not hide critical findings behind soft language.

## Evidence rules

- Score only from code, config, commands, or observable behavior.
- If a control is claimed but not shown, mark it UNVERIFIED.
- If the repo and live app disagree, call it CONFIG DRIFT.
- If a secret appears committed, treat it as compromised until rotated.

## Highest-priority attack paths

Review these first:
- authentication and authorization
- admin and back-office routes
- file upload and export flows
- webhooks and callback handlers
- secrets and environment handling
- AI tool execution and prompt injection exposure
- tenant isolation
- CI/CD secrets and deploy controls
- public cloud exposure
- logging and incident response gaps

## Output standards

Every finding must include:
- severity
- affected asset
- exploit path
- business impact
- proof
- exact fix
- retest steps

## Investor framing

Use this language:
- defense in depth
- least privilege
- zero trust access
- encrypted in transit and at rest
- breach detection and containment
- supply-chain visibility
- remediation roadmap
- residual risk

Avoid this language:
- impossible to breach
- fully secure
- guaranteed safe
- military grade
- unhackable
