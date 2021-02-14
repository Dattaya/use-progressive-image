/// <reference types="cypress" />

context('Test SSR', () => {
  it('No mismatch between the server and client', () => {
    cy.intercept('GET', 'http://localhost:3000/img.png', {
      delayMs: 10,
    })
    cy.visit(`/img`)
    cy.get('#img').should('have.attr', 'src', `/img.png`)
    cy.get('#messages').should('have.text', 'not loading')
  })
})
