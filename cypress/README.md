# Cypress tests

End-to-end tests for [Sauce Demo](https://www.saucedemo.com). The app URL is set as `baseUrl` in the root `cypress.config.js`, so specs use paths like `cy.visit('/')` instead of full URLs.

## Run from repository root

```bash
npm install
npm run test:open
```

Headless run:

```bash
npm test
# or
npm run test:headless
```

## Layout

| Path | Role |
|------|------|
| `e2e/` | Spec files (`*.cy.js`), roughly ordered by flow (login → inventory → …). |
| `fixtures/` | Static JSON (for example `users.json`, `products.json`) loaded with `cy.fixture()`. |
| `support/e2e.js` | Loads before each spec; import shared behavior here. |
| `support/commands.js` | Custom commands (`cy.login`, `cy.loginAs`, cart helpers, menu, reset). |
| `support/component.*` | Used only if you run component testing (optional). |

## Custom commands

Defined in `support/commands.js`:

- **`cy.login(username, password)`** — Fill login form and submit.
- **`cy.loginAs('standardUser')`** — Login using a key from `fixtures/users.json`.
- **`cy.addToCart` / `cy.removeFromCart`** — Toggle items from the inventory list by product name.
- **`cy.assertCartCount(n)`** — Assert cart badge text or absence when count is 0.
- **`cy.openMenu` / `cy.resetAppState`** — Side menu and “Reset App State” (clears cart).

Prefer **`data-test`** selectors when the demo exposes them; use shared commands instead of duplicating login steps in every spec.
