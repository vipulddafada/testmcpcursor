describe('Product Sorting', () => {
  beforeEach(() => {
    cy.loginAs('standardUser')
  })

  const getProductNames = () => {
    return cy.get('.inventory_item_name').then(($names) => {
      return Cypress._.map($names, (el) => el.innerText)
    })
  }

  const getProductPrices = () => {
    return cy.get('.inventory_item_price').then(($prices) => {
      return Cypress._.map($prices, (el) => parseFloat(el.innerText.replace('$', '')))
    })
  }

  context('Sort dropdown', () => {
    it('sort dropdown is visible on the inventory page', () => {
      cy.get('[data-test="product_sort_container"]').should('be.visible')
    })

    it('default sort option is "Name (A to Z)"', () => {
      cy.get('[data-test="product_sort_container"]').should('have.value', 'az')
    })

    it('sort dropdown has all 4 options', () => {
      cy.get('[data-test="product_sort_container"] option').should('have.length', 4)
    })
  })

  context('Sort by Name A to Z', () => {
    it('products are sorted alphabetically A to Z by default', () => {
      getProductNames().then((names) => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).to.deep.equal(sorted)
      })
    })

    it('selecting A to Z sorts products alphabetically ascending', () => {
      cy.get('[data-test="product_sort_container"]').select('za')
      cy.get('[data-test="product_sort_container"]').select('az')
      getProductNames().then((names) => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).to.deep.equal(sorted)
      })
    })
  })

  context('Sort by Name Z to A', () => {
    it('selecting Z to A sorts products alphabetically descending', () => {
      cy.get('[data-test="product_sort_container"]').select('za')
      getProductNames().then((names) => {
        const sorted = [...names].sort((a, b) => b.localeCompare(a))
        expect(names).to.deep.equal(sorted)
      })
    })

    it('active sort icon updates when Z to A is selected', () => {
      cy.get('[data-test="product_sort_container"]').select('za')
      cy.get('[data-test="product_sort_container"]').should('have.value', 'za')
    })
  })

  context('Sort by Price Low to High', () => {
    it('selecting Low to High sorts products by price ascending', () => {
      cy.get('[data-test="product_sort_container"]').select('lohi')
      getProductPrices().then((prices) => {
        const sorted = [...prices].sort((a, b) => a - b)
        expect(prices).to.deep.equal(sorted)
      })
    })

    it('first product has lowest price when sorted Low to High', () => {
      cy.get('[data-test="product_sort_container"]').select('lohi')
      getProductPrices().then((prices) => {
        const minPrice = Math.min(...prices)
        expect(prices[0]).to.eq(minPrice)
      })
    })
  })

  context('Sort by Price High to Low', () => {
    it('selecting High to Low sorts products by price descending', () => {
      cy.get('[data-test="product_sort_container"]').select('hilo')
      getProductPrices().then((prices) => {
        const sorted = [...prices].sort((a, b) => b - a)
        expect(prices).to.deep.equal(sorted)
      })
    })

    it('first product has highest price when sorted High to Low', () => {
      cy.get('[data-test="product_sort_container"]').select('hilo')
      getProductPrices().then((prices) => {
        const maxPrice = Math.max(...prices)
        expect(prices[0]).to.eq(maxPrice)
      })
    })
  })

  context('Sort persists across interactions', () => {
    it('sort order is maintained after adding an item to cart', () => {
      cy.get('[data-test="product_sort_container"]').select('hilo')
      cy.get('[data-test^="add-to-cart"]').first().click()
      cy.get('[data-test="product_sort_container"]').should('have.value', 'hilo')
      getProductPrices().then((prices) => {
        const sorted = [...prices].sort((a, b) => b - a)
        expect(prices).to.deep.equal(sorted)
      })
    })
  })
})
