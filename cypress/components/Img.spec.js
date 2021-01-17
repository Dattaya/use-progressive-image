
/// <reference types="cypress" />
import * as React from 'react'
import { mount } from '@cypress/react'
import Img from '../../components/Img'

let imgKey = 0

describe('Test `img` prop', () => {
  beforeEach(() => {
    mount(<Img imgKey={++imgKey} />)
  })

  it('Loads image', () => {
    cy.get('#messages').should('have.text', 'loading-not loading')
    cy.get('#error').should('not.have.text', 'error')
    cy.get('#numOfRerenders').then(($num) => {
      const num = Number($num.text())
      expect(num).to.be.lessThan(10)
    })
  })

  it('Loading is `false` when image is already in cache', () => {
    // const img = new Image()
    // img.src = `/img.png?${imgKey}`
    cy.wait(50) // TODO Fifure out how to get rid of this hack
    mount(<Img imgKey={imgKey} />)
    cy.get('#messages').should('have.text', 'not loading')
    cy.get('#error').should('not.have.text', 'error')
  })

  it('Returns error event when image failed to load', () => {
    mount(<Img path="no-image.png" />)
    cy.get('#error').should('have.text', 'error')
  })
})
