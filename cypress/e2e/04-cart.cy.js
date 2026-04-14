describe('Cart Page', () => {
  beforeEach(() => {
    cy.loginAs('standardUser')
  })

  context('Empty cart', () => {
    it('cart page shows no items when nothing was added', () => {
      cy.get('.shopping_cart_link').click()
      cy.url().should('include', '/cart.html')
      cy.get('.cart_item').should('not.exist')
    })

    it('cart page has "Continue Shopping" and "Checkout" buttons even when empty', () => {
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="continue-shopping"]').should('be.visible')
      cy.get('[data-test="checkout"]').should('be.visible')
    })
  })

  context('Cart with items', () => {
    beforeEach(() => {
      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
        cy.addToCart(data.products[1].name)
      })
      cy.get('.shopping_cart_link').click()
    })

    it('shows added items in the cart', () => {
      cy.get('.cart_item').should('have.length', 2)
    })

    it('each cart item shows name, description and price', () => {
      cy.get('.cart_item').each(($item) => {
        cy.wrap($item).find('.inventory_item_name').should('not.be.empty')
        cy.wrap($item).find('.inventory_item_desc').should('not.be.empty')
        cy.wrap($item).find('.inventory_item_price').should('not.be.empty')
      })
    })

    it('each cart item has a quantity of 1 by default', () => {
      cy.get('.cart_quantity').each(($qty) => {
        expect($qty.text()).to.eq('1')
      })
    })

    it('each cart item has a "Remove" button', () => {
      cy.get('[data-test^="remove"]').should('have.length', 2)
    })

    it('correct product names appear in the cart', () => {
      cy.fixture('products').then((data) => {
        cy.get('.cart_item .inventory_item_name').eq(0).should('contain.text', data.products[0].name)
        cy.get('.cart_item .inventory_item_name').eq(1).should('contain.text', data.products[1].name)
      })
    })

    it('correct prices appear in the cart', () => {
      cy.fixture('products').then((data) => {
        cy.get('.cart_item .inventory_item_price').eq(0)
          .should('contain.text', data.products[0].price.toFixed(2))
        cy.get('.cart_item .inventory_item_price').eq(1)
          .should('contain.text', data.products[1].price.toFixed(2))
      })
    })
  })

  context('Remove items from cart', () => {
    beforeEach(() => {
      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
        cy.addToCart(data.products[1].name)
      })
      cy.get('.shopping_cart_link').click()
    })

    it('removing an item decreases cart item count', () => {
      cy.get('[data-test^="remove"]').first().click()
      cy.get('.cart_item').should('have.length', 1)
    })

    it('cart badge decrements when item is removed from cart page', () => {
      cy.get('[data-test^="remove"]').first().click()
      cy.assertCartCount(1)
    })

    it('removing all items leaves an empty cart', () => {
      cy.get('[data-test^="remove"]').each(($btn) => {
        cy.wrap($btn).click()
      })
      cy.get('.cart_item').should('not.exist')
      cy.assertCartCount(0)
    })
  })

  context('Navigation buttons', () => {
    it('"Continue Shopping" returns to inventory page', () => {
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="continue-shopping"]').click()
      cy.url().should('include', '/inventory.html')
    })

    it('"Checkout" button navigates to checkout step 1', () => {
      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
      })
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="checkout"]').click()
      cy.url().should('include', '/checkout-step-one.html')
    })

    it('"Checkout" on empty cart still navigates to checkout step 1', () => {
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="checkout"]').click()
      cy.url().should('include', '/checkout-step-one.html')
    })
  })

  context('Cart persistence during session', () => {
    it('cart items persist when navigating back to inventory and returning', () => {
      cy.fixture('products').then((data) => {
        cy.addToCart(data.products[0].name)
      })
      cy.assertCartCount(1)
      cy.get('.shopping_cart_link').click()
      cy.get('[data-test="continue-shopping"]').click()
      cy.assertCartCount(1)
      cy.get('.shopping_cart_link').click()
      cy.get('.cart_item').should('have.length', 1)
    })
  })
})
