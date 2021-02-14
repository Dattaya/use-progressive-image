/// <reference types="cypress" />

context('Test SSR', () => {
  beforeEach(() => {
    cy.visit(`/img`)
  })

  it('Does not throw error in SSR', () => {
    // cy.visit(`/img`, { qs: { img: imgParam, ssr: 1 } })
    cy.get('#img').should('have.attr', 'src', `/img.png`)
  })

  // it('No mismatch between the server and client', () => {
  //   cy.intercept('GET', 'http://localhost:3000/img.png', {
  //     delayMs: 10,
  //   })
  //   cy.visit(`/img`)
  //   cy.get('#img').should('have.attr', 'src', `/img.png`)
  //   cy.get('#messages').should('have.text', 'not loading')
  // })
})
