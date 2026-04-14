describe('Product Detail Page', () => {
  beforeEach(() => {
    cy.loginAs('standardUser')
  })

  context('Navigation to product detail', () => {
    it('clicking a product name navigates to its detail page', () => {
      cy.get('.inventory_item_name').first().then(($name) => {
        const productName = $name.text()
        cy.wrap($name).click()
        cy.url().should('include', '/inventory-item.html')
        cy.get('.inventory_details_name').should('contain.text', productName)
      })
    })

    it('clicking a product image navigates to its detail page', () => {
      cy.get('.inventory_item img').first().click()
      cy.url().should('include', '/inventory-item.html')
    })
  })

  context('Product detail page structure', () => {
    beforeEach(() => {
      cy.get('.inventory_item_name').first().click()
    })

    it('displays the product name', () => {
      cy.get('.inventory_details_name').should('be.visible').and('not.be.empty')
    })

    it('displays the product description', () => {
      cy.get('.inventory_details_desc').should('be.visible').and('not.be.empty')
    })

    it('displays the product price with $ prefix', () => {
      cy.get('.inventory_details_price').should('be.visible').and('match', /^\$\d+\.\d{2}$/)
    })

    it('displays a product image', () => {
      cy.get('.inventory_details_img').should('be.visible').and('have.attr', 'src').and('not.be.empty')
    })

    it('displays an "Add to Cart" button', () => {
      cy.get('[data-test^="add-to-cart"]').should('be.visible')
    })

    it('displays a "Back to products" button', () => {
      cy.get('[data-test="back-to-products"]').should('be.visible').and('contain.text', 'Back to products')
    })
  })

  context('"Back to products" navigation', () => {
    it('navigates back to inventory page', () => {
      cy.get('.inventory_item_name').first().click()
      cy.get('[data-test="back-to-products"]').click()
      cy.url().should('include', '/inventory.html')
      cy.get('.inventory_list').should('be.visible')
    })
  })

  context('Add to cart from detail page', () => {
    beforeEach(() => {
      cy.get('.inventory_item_name').first().click()
    })

    it('cart badge increments after adding from detail page', () => {
      cy.assertCartCount(0)
      cy.get('[data-test^="add-to-cart"]').click()
      cy.assertCartCount(1)
    })

    it('"Add to Cart" changes to "Remove" after adding', () => {
      cy.get('[data-test^="add-to-cart"]').click()
      cy.get('[data-test^="remove"]').should('be.visible')
      cy.get('[data-test^="add-to-cart"]').should('not.exist')
    })

    it('removing from detail page decrements cart badge', () => {
      cy.get('[data-test^="add-to-cart"]').click()
      cy.assertCartCount(1)
      cy.get('[data-test^="remove"]').click()
      cy.assertCartCount(0)
      cy.get('[data-test^="add-to-cart"]').should('be.visible')
    })

    it('item added from detail page appears in cart', () => {
      cy.get('.inventory_details_name').invoke('text').then((productName) => {
        cy.get('[data-test^="add-to-cart"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('.cart_item .inventory_item_name').should('contain.text', productName)
      })
    })
  })

  context('Detail page for each product', () => {
    it('can navigate to detail and back for all 6 products', () => {
      cy.get('.inventory_item_name').each(($name, index) => {
        const productName = $name.text()
        cy.get('.inventory_item_name').eq(index).click()
        cy.url().should('include', '/inventory-item.html')
        cy.get('.inventory_details_name').should('contain.text', productName)
        cy.get('[data-test="back-to-products"]').click()
        cy.url().should('include', '/inventory.html')
      })
    })
  })
})
