// Login to SauceDemo with given credentials
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/')
  cy.get('[data-test="username"]').clear().type(username)
  cy.get('[data-test="password"]').clear().type(password)
  cy.get('[data-test="login-button"]').click()
})

// Login using fixture data by user key (e.g. 'standardUser')
Cypress.Commands.add('loginAs', (userKey) => {
  cy.fixture('users').then((users) => {
    const user = users[userKey]
    cy.login(user.username, user.password)
  })
})

// Add a product to cart from the inventory page by product name
Cypress.Commands.add('addToCart', (productName) => {
  cy.contains('.inventory_item_name', productName)
    .parents('.inventory_item')
    .find('[data-test^="add-to-cart"]')
    .click()
})

// Remove a product from the inventory page by product name
Cypress.Commands.add('removeFromCart', (productName) => {
  cy.contains('.inventory_item_name', productName)
    .parents('.inventory_item')
    .find('[data-test^="remove"]')
    .click()
})

// Verify cart badge count
Cypress.Commands.add('assertCartCount', (count) => {
  if (count === 0) {
    cy.get('.shopping_cart_badge').should('not.exist')
  } else {
    cy.get('.shopping_cart_badge').should('have.text', String(count))
  }
})

// Open the burger / side navigation menu
Cypress.Commands.add('openMenu', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('.bm-menu-wrap').should('be.visible')
})

// Reset app state via the side menu (clears cart)
Cypress.Commands.add('resetAppState', () => {
  cy.openMenu()
  cy.get('#reset_sidebar_link').click()
  cy.get('#react-burger-cross-btn').click()
})

// Fill checkout form step 1
Cypress.Commands.add('fillCheckoutInfo', (firstName, lastName, postalCode) => {
  cy.get('[data-test="firstName"]').clear().type(firstName)
  cy.get('[data-test="lastName"]').clear().type(lastName)
  cy.get('[data-test="postalCode"]').clear().type(postalCode)
  cy.get('[data-test="continue"]').click()
})
