/// <reference types="cypress" />

let imgParam = 0

context('Test img with placeholder', () => {
  beforeEach(() => {
    cy.visit(`/img`, { qs: { img: ++imgParam } })
  })

  it('Does not throw error in SSR', () => {
    // cy.visit(`/img`, { qs: { img: imgParam, ssr: 1 } })
    cy.get('#img').should('have.attr', 'src', `/img.png`)
  })
})
