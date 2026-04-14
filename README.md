# testmcpcursor

Learning workspace: **Test MCP** in Cursor against a small real project, plus Cypress end-to-end tests against [Sauce Demo](https://www.saucedemo.com).

## Test MCP

Use this repository when you want a predictable codebase to try **Model Context Protocol (MCP)** integrations in Cursor (custom tools, servers, and agent workflows). The Cypress suite and config give the agent concrete files to read, run, and extend without a local app server.

- Open the repo in Cursor and attach or configure MCP servers as you normally would.
- Run tests from the repo root to confirm the environment (`npm test` or `npm run test:open`).
- Project notes and direction live in [`.cursor/plan.md`](.cursor/plan.md).

## Cypress tests

See **[`cypress/README.md`](cypress/README.md)** for folder layout, npm scripts, and custom commands.

## Quick start

```bash
npm install
npm run test:open
```

## Repository

https://github.com/vipulddafada/testmcpcursor
