describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.loginAs('standardUser')
    cy.fixture('products').then((data) => {
      cy.addToCart(data.products[0].name)
      cy.addToCart(data.products[1].name)
    })
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="checkout"]').click()
  })

  context('Step 1 — Customer Information', () => {
    it('lands on checkout step 1', () => {
      cy.url().should('include', '/checkout-step-one.html')
    })

    it('displays first name, last name and postal code fields', () => {
      cy.get('[data-test="firstName"]').should('be.visible')
      cy.get('[data-test="lastName"]').should('be.visible')
      cy.get('[data-test="postalCode"]').should('be.visible')
    })

    it('shows error when all fields are empty and Continue is clicked', () => {
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'First Name is required')
    })

    it('shows error when first name is missing', () => {
      cy.get('[data-test="lastName"]').type('Doe')
      cy.get('[data-test="postalCode"]').type('12345')
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="error"]').should('contain.text', 'First Name is required')
    })

    it('shows error when last name is missing', () => {
      cy.get('[data-test="firstName"]').type('John')
      cy.get('[data-test="postalCode"]').type('12345')
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="error"]').should('contain.text', 'Last Name is required')
    })

    it('shows error when postal code is missing', () => {
      cy.get('[data-test="firstName"]').type('John')
      cy.get('[data-test="lastName"]').type('Doe')
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="error"]').should('contain.text', 'Postal Code is required')
    })

    it('dismisses error message when X button is clicked', () => {
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="error"]').should('be.visible')
      cy.get('[data-test="error"] button.error-button').click()
      cy.get('[data-test="error"]').should('not.exist')
    })

    it('proceeds to step 2 with valid input', () => {
      cy.fixture('products').then((data) => {
        cy.fillCheckoutInfo(
          data.checkoutInfo.firstName,
          data.checkoutInfo.lastName,
          data.checkoutInfo.postalCode
        )
      })
      cy.url().should('include', '/checkout-step-two.html')
    })

    it('"Cancel" returns to the cart page', () => {
      cy.get('[data-test="cancel"]').click()
      cy.url().should('include', '/cart.html')
    })
  })

  context('Step 2 — Order Summary', () => {
    beforeEach(() => {
      cy.fixture('products').then((data) => {
        cy.fillCheckoutInfo(
          data.checkoutInfo.firstName,
          data.checkoutInfo.lastName,
          data.checkoutInfo.postalCode
        )
      })
    })

    it('lands on checkout step 2', () => {
      cy.url().should('include', '/checkout-step-two.html')
    })

    it('displays ordered items in the summary', () => {
      cy.get('.cart_item').should('have.length', 2)
    })

    it('shows item total in the price summary', () => {
      cy.get('.summary_subtotal_label').should('be.visible').and('contain.text', 'Item total:')
    })

    it('shows tax in the price summary', () => {
      cy.get('.summary_tax_label').should('be.visible').and('contain.text', 'Tax:')
    })

    it('shows total in the price summary', () => {
      cy.get('.summary_total_label').should('be.visible').and('contain.text', 'Total:')
    })

    it('item total matches sum of individual product prices', () => {
      cy.fixture('products').then((data) => {
        const expectedSubtotal = data.products[0].price + data.products[1].price
        cy.get('.summary_subtotal_label').should('contain.text', `$${expectedSubtotal.toFixed(2)}`)
      })
    })

    it('grand total equals item total plus tax', () => {
      cy.get('.summary_subtotal_label').invoke('text').then((subtotalText) => {
        cy.get('.summary_tax_label').invoke('text').then((taxText) => {
          cy.get('.summary_total_label').invoke('text').then((totalText) => {
            const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''))
            const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''))
            const total = parseFloat(totalText.replace(/[^0-9.]/g, ''))
            expect(total).to.be.closeTo(subtotal + tax, 0.01)
          })
        })
      })
    })

    it('displays payment and shipping information labels', () => {
      cy.get('.summary_info_label').should('have.length.greaterThan', 0)
    })

    it('"Cancel" returns to inventory page', () => {
      cy.get('[data-test="cancel"]').click()
      cy.url().should('include', '/inventory.html')
    })

    it('"Finish" button is visible', () => {
      cy.get('[data-test="finish"]').should('be.visible')
    })
  })

  context('Step 3 — Order Confirmation', () => {
    beforeEach(() => {
      cy.fixture('products').then((data) => {
        cy.fillCheckoutInfo(
          data.checkoutInfo.firstName,
          data.checkoutInfo.lastName,
          data.checkoutInfo.postalCode
        )
      })
      cy.get('[data-test="finish"]').click()
    })

    it('lands on checkout complete page', () => {
      cy.url().should('include', '/checkout-complete.html')
    })

    it('shows order confirmation success message', () => {
      cy.get('.complete-header').should('be.visible').and('contain.text', 'Thank you for your order!')
    })

    it('shows dispatch confirmation text', () => {
      cy.get('.complete-text').should('be.visible').and('contain.text', 'dispatched')
    })

    it('shows the Pony Express image', () => {
      cy.get('.pony_express').should('be.visible')
    })

    it('"Back Home" button is visible', () => {
      cy.get('[data-test="back-to-products"]').should('be.visible').and('contain.text', 'Back Home')
    })

    it('"Back Home" returns to inventory with empty cart', () => {
      cy.get('[data-test="back-to-products"]').click()
      cy.url().should('include', '/inventory.html')
      cy.assertCartCount(0)
    })
  })
})
