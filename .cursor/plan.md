# Cursor experiment — project plan

## Purpose

Use this repo as a hands-on Cypress workspace against the public demo app [Sauce Demo](https://www.saucedemo.com) (`baseUrl` in `cypress.config.js`). Goals: practice reliable selectors, custom commands, fixtures, and end-to-end flows without maintaining a local backend.

## Scope

- **In scope:** E2E specs under `cypress/e2e/`, shared helpers in `cypress/support/`, data in `cypress/fixtures/`, and Cypress configuration tuned for stability (timeouts, no video in CI/local unless needed).
- **Out of scope for now:** Production deployments, real credentials, and component tests unless a local React app is added later (component block in config is placeholder).

## Test map (specs)

| Area            | Spec                         | Focus                                      |
|-----------------|------------------------------|--------------------------------------------|
| Login           | `01-login.cy.js`             | Form, happy path, validation, locked user |
| Inventory       | `02-inventory.cy.js`         | List, layout, navigation                   |
| Product detail  | `03-product-detail.cy.js`    | Item page, back navigation                 |
| Cart            | `04-cart.cy.js`              | Add/remove, cart state                     |
| Checkout        | `05-checkout.cy.js`        | Step-one/two flow, overview                |
| Sort / filter   | `06-sorting-filtering.cy.js` | Sort options, behavior                     |
| Journeys        | `07-user-scenarios.cy.js`    | Cross-cutting user scenarios               |

## Conventions

- Prefer `data-test` attributes where the app exposes them; fall back to stable class/text only when necessary.
- Reuse `cy.login` / `cy.loginAs` from `cypress/support/commands.js` instead of duplicating login steps.
- Keep fixtures as the single source for usernames/passwords (`cypress/fixtures/users.json`).

## Next steps (optional)

- Add a minimal `README.md` at repo root with `npm install`, `npm run test:open`, and link to Sauce Demo.
- Enable video or artifacts only in CI via env-based config if GitHub Actions is added later.
- Expand scenarios for `problem_user` / `performance_glitch` if testing edge-case UX is a learning goal.
