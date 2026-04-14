describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Page structure', () => {
    it('displays the login form elements', () => {
      cy.get('[data-test="username"]').should('be.visible')
      cy.get('[data-test="password"]').should('be.visible')
      cy.get('[data-test="login-button"]').should('be.visible').and('have.value', 'Login')
      cy.get('.login_logo').should('contain.text', 'Swag Labs')
    })

    it('displays accepted usernames and password hint', () => {
      cy.get('#login_credentials').should('be.visible').and('contain.text', 'standard_user')
      cy.get('.login_password').should('be.visible').and('contain.text', 'secret_sauce')
    })
  })

  context('Happy path', () => {
    it('logs in successfully with standard_user credentials', () => {
      cy.fixture('users').then((users) => {
        cy.login(users.standardUser.username, users.standardUser.password)
      })
      cy.url().should('include', '/inventory.html')
      cy.get('.inventory_list').should('be.visible')
    })

    it('shows the app header after successful login', () => {
      cy.loginAs('standardUser')
      cy.get('.app_logo').should('contain.text', 'Swag Labs')
      cy.get('.shopping_cart_link').should('be.visible')
    })
  })

  context('Validation errors', () => {
    it('shows error when username is empty', () => {
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'Username is required')
    })

    it('shows error when password is empty', () => {
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'Password is required')
    })

    it('shows error when both fields are empty', () => {
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'Username is required')
    })

    it('shows error for wrong credentials', () => {
      cy.fixture('users').then((users) => {
        cy.login(users.invalidUser.username, users.invalidUser.password)
      })
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain.text', 'Username and password do not match')
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
    })

    it('adds error class to input fields on failed login', () => {
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="username"]').should('have.class', 'error')
      cy.get('[data-test="password"]').should('have.class', 'error')
    })

    it('dismisses the error message when X button is clicked', () => {
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible')
      cy.get('[data-test="error"] button.error-button').click()
      cy.get('[data-test="error"]').should('not.exist')
    })
  })

  context('Locked out user', () => {
    it('shows locked out error for locked_out_user', () => {
      cy.loginAs('lockedOutUser')
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain.text', 'Sorry, this user has been locked out')
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
    })
  })

  context('Session protection', () => {
    it('blocks access to inventory page without a session', () => {
      // SauceDemo returns 404 for protected pages when no session exists.
      // failOnStatusCode: false lets Cypress load the response so we can assert
      // that the inventory content is not accessible regardless of status code.
      cy.visit('/inventory.html', { failOnStatusCode: false })
      cy.get('.inventory_list').should('not.exist')
    })
  })
})
