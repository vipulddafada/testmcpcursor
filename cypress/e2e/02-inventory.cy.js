describe('Inventory / Products Page', () => {
  beforeEach(() => {
    cy.loginAs('standardUser')
  })

  context('Page structure', () => {
    it('lands on the inventory page after login', () => {
      cy.url().should('include', '/inventory.html')
    })

    it('displays exactly 6 products', () => {
      cy.get('.inventory_item').should('have.length', 6)
    })

    it('each product has a name, description, price and image', () => {
      cy.get('.inventory_item').each(($item) => {
        cy.wrap($item).find('.inventory_item_name').should('not.be.empty')
        cy.wrap($item).find('.inventory_item_desc').should('not.be.empty')
        cy.wrap($item).find('.inventory_item_price').should('not.be.empty')
        cy.wrap($item).find('img.inventory_item_img').should('have.attr', 'src').and('not.be.empty')
      })
    })

    it('each product has an "Add to cart" button', () => {
      cy.get('[data-test^="add-to-cart"]').should('have.length', 6)
    })

    it('product prices are displayed with a $ prefix', () => {
      cy.get('.inventory_item_price').each(($price) => {
        expect($price.text()).to.match(/^\$\d+\.\d{2}$/)
      })
    })
  })

  context('Cart badge interactions', () => {
    it('cart badge is not visible before adding any item', () => {
      cy.assertCartCount(0)
    })

    it('cart badge shows 1 after adding one item', () => {
      cy.get('[data-test^="add-to-cart"]').first().click()
      cy.assertCartCount(1)
    })

    it('cart badge increments correctly when multiple items are added', () => {
      cy.get('[data-test^="add-to-cart"]').eq(0).click()
      cy.assertCartCount(1)
      cy.get('[data-test^="add-to-cart"]').eq(1).click()
      cy.assertCartCount(2)
      cy.get('[data-test^="add-to-cart"]').eq(2).click()
      cy.assertCartCount(3)
    })

    it('"Add to cart" button changes to "Remove" after clicking', () => {
      cy.get('[data-test^="add-to-cart"]').first().click()
      cy.get('[data-test^="remove"]').should('have.length', 1)
    })

    it('"Remove" button reverts to "Add to cart" after removing', () => {
      cy.get('[data-test^="add-to-cart"]').first().click()
      cy.get('[data-test^="remove"]').first().click()
      cy.assertCartCount(0)
      cy.get('[data-test^="add-to-cart"]').should('have.length', 6)
    })
  })

  context('Burger / sidebar menu', () => {
    it('opens the side menu when burger icon is clicked', () => {
      cy.openMenu()
      cy.get('.bm-item-list').should('be.visible')
    })

    it('side menu contains "All Items" link', () => {
      cy.openMenu()
      cy.get('#inventory_sidebar_link').should('be.visible').and('contain.text', 'All Items')
    })

    it('side menu contains "About" link', () => {
      cy.openMenu()
      cy.get('#about_sidebar_link').should('be.visible').and('contain.text', 'About')
    })

    it('side menu contains "Logout" link', () => {
      cy.openMenu()
      cy.get('#logout_sidebar_link').should('be.visible').and('contain.text', 'Logout')
    })

    it('side menu contains "Reset App State" link', () => {
      cy.openMenu()
      cy.get('#reset_sidebar_link').should('be.visible').and('contain.text', 'Reset App State')
    })

    it('closes the side menu when X button is clicked', () => {
      cy.openMenu()
      cy.get('#react-burger-cross-btn').click()
      cy.get('.bm-menu-wrap').should('not.be.visible')
    })

    it('logout via sidebar redirects to login page', () => {
      cy.openMenu()
      cy.get('#logout_sidebar_link').click()
      cy.url().should('eq', Cypress.config('baseUrl') + '/')
      cy.get('[data-test="login-button"]').should('be.visible')
    })

    it('"All Items" link navigates back to inventory', () => {
      cy.get('.shopping_cart_link').click()
      cy.openMenu()
      cy.get('#inventory_sidebar_link').click()
      cy.url().should('include', '/inventory.html')
    })
  })

  context('Cart icon navigation', () => {
    it('clicking cart icon navigates to cart page', () => {
      cy.get('.shopping_cart_link').click()
      cy.url().should('include', '/cart.html')
    })
  })
})
