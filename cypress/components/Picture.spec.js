/// <reference types="cypress" />
import * as React from 'react'
import { mount } from '@cypress/react'
import Picture from '../../components/Picture'

let imgKey = 0

describe('Test `sources` prop', () => {
  beforeEach(() => {
    mount(<Picture imgKey={++imgKey} />)
  })

  it('Loads image', () => {
    cy.get('#messages').should('have.text', 'loading-not loading')
    cy.get('#img').invoke('prop', 'currentSrc').should('contain', 'img.avif')
    cy.get('#error').should('not.have.text', 'error')
    cy.get('#numOfRerenders').then(($num) => {
      const num = Number($num.text())
      expect(num).to.be.lessThan(10)
    })
  })

  it('Loading is `false` when image is already in cache', () => {
    cy.wait(50) // TODO Fifure out how to get rid of this hack
    mount(<Picture imgKey={imgKey} />)
    cy.get('#messages').should('have.text', 'not loading')
    cy.get('#img').invoke('prop', 'currentSrc').should('contain', 'img.avif')
    cy.get('#error').should('not.have.text', 'error')
  })

  it('Returns error event when image failed to load', () => {
    mount(<Picture path="no-image.png" />)
    cy.get('#img').invoke('prop', 'currentSrc').should('contain', 'no-image.avif')
    cy.get('#error').should('have.text', 'error')
  })
})
