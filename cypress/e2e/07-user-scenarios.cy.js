describe('Cross-User Scenarios & Edge Cases', () => {
  context('locked_out_user', () => {
    it('cannot log in and sees a locked-out error', () => {
      cy.loginAs('lockedOutUser')
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain.text', 'Sorry, this user has been locked out')
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
    })

    it('cannot access inventory.html directly — redirected to login', () => {
      cy.visit('/inventory.html')
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
      cy.get('[data-test="error"]').should('be.visible')
    })
  })

  context('performance_glitch_user', () => {
    it('logs in successfully despite the slow response', () => {
      cy.loginAs('performanceGlitchUser')
      // performance_glitch_user triggers a ~5 s delay on the server side,
      // so use an extended timeout for the post-login assertions
      cy.url({ timeout: 15000 }).should('include', '/inventory.html')
      cy.get('.inventory_list', { timeout: 15000 }).should('be.visible')
    })
  })

  context('Session management', () => {
    it('logout clears the session and redirects to login', () => {
      cy.loginAs('standardUser')
      cy.openMenu()
      cy.get('#logout_sidebar_link').click()
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
      cy.get('[data-test="login-button"]').should('be.visible')
    })

    it('cannot access inventory after logout', () => {
      cy.loginAs('standardUser')
      cy.openMenu()
      cy.get('#logout_sidebar_link').click()
      cy.visit('/inventory.html', { failOnStatusCode: false })
      cy.get('.inventory_list').should('not.exist')
    })

    it('cannot access cart after logout', () => {
      cy.loginAs('standardUser')
      cy.openMenu()
      cy.get('#logout_sidebar_link').click()
      cy.visit('/cart.html', { failOnStatusCode: false })
      cy.get('.cart_item').should('not.exist')
    })
  })

  context('Reset App State', () => {
    it('reset app state clears all items from the cart', () => {
      cy.loginAs('standardUser')
      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
        cy.addToCart(data.products[1].name)
        cy.addToCart(data.products[2].name)
      })
      cy.assertCartCount(3)
      cy.resetAppState()
      cy.assertCartCount(0)
    })

    it('after reset, all "Add to cart" buttons are restored on inventory', () => {
      cy.loginAs('standardUser')
      cy.get('[data-test^="add-to-cart"]').each(($btn) => {
        cy.wrap($btn).click()
      })
      cy.assertCartCount(6)
      cy.resetAppState()
      cy.get('[data-test^="add-to-cart"]').should('have.length', 6)
      cy.get('[data-test^="remove"]').should('not.exist')
    })
  })

  context('Full end-to-end purchase flow', () => {
    it('can add multiple items and complete a full checkout', () => {
      cy.loginAs('standardUser')

      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
        cy.addToCart(data.products[2].name)
        cy.addToCart(data.products[4].name)
        cy.assertCartCount(3)

        cy.get('.shopping_cart_link').click()
        cy.get('.cart_item').should('have.length', 3)

        cy.get('[data-test="checkout"]').click()
        cy.url().should('include', '/checkout-step-one.html')

        cy.fillCheckoutInfo(
          data.checkoutInfo.firstName,
          data.checkoutInfo.lastName,
          data.checkoutInfo.postalCode
        )

        cy.url().should('include', '/checkout-step-two.html')
        cy.get('.cart_item').should('have.length', 3)

        const expectedSubtotal =
          data.products[0].price + data.products[2].price + data.products[4].price
        cy.get('.summary_subtotal_label').should('contain.text', `$${expectedSubtotal.toFixed(2)}`)

        cy.get('[data-test="finish"]').click()
        cy.url().should('include', '/checkout-complete.html')
        cy.get('.complete-header').should('contain.text', 'Thank you for your order!')

        cy.get('[data-test="back-to-products"]').click()
        cy.url().should('include', '/inventory.html')
        cy.assertCartCount(0)
      })
    })
  })

  context('problem_user — known UI issues', () => {
    beforeEach(() => {
      cy.loginAs('problemUser')
    })

    it('logs in and lands on inventory page', () => {
      cy.url().should('include', '/inventory.html')
      cy.get('.inventory_list').should('be.visible')
    })

    it('all product images load (or fail gracefully)', () => {
      cy.get('.inventory_item img').should('have.length', 6)
    })
  })

  context('Direct URL access without session', () => {
    const protectedPages = [
      '/inventory.html',
      '/cart.html',
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html',
    ]

    protectedPages.forEach((page) => {
      it(`blocks access to ${page} without a session`, () => {
        // SauceDemo returns 404 for protected pages when unauthenticated.
        // failOnStatusCode: false prevents a test error on 4xx responses.
        cy.visit(page, { failOnStatusCode: false })
        cy.get('.inventory_list').should('not.exist')
      })
    })
  })
})
