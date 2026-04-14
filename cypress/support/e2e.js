import './commands'

// SauceDemo throws uncaught JS exceptions (e.g. during auth-guard redirects and
// React state updates on protected pages). Returning false prevents Cypress from
// failing tests due to application-level errors that are not part of what we are testing.
Cypress.on('uncaught:exception', () => false)
