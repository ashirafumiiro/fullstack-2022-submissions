describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notification').should('contain', 'wrong username or password')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.notification').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // log in user here
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      let title = 'A new blogger in town'
      let author = 'Martin A'
      let url = 'http://blogger.com/new-blogger-in-town'
      cy.contains('new blog').click()
      cy.get('#title').type(title)
      cy.get('#author').type(author)
      cy.get('#url').type(url)
      cy.get('#submit-button').click()

      cy.contains('A new blogger in town')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog by cypress',
          author: 'miiro A',
          url: 'http://blogger.com/cypress'
        })
      })

      it('Can like a blog', function () {
        cy.contains('a blog by cypress miiro A')
          .contains('show')
          .click()
        cy.contains('likes 0').contains('like').click()
        cy.contains('likes 1')
      })

      it('Can delete a blog', function () {
        cy.createBlog({
          title: 'a blog to delete',
          author: 'miiro A',
          url: 'http://blogger.com/cypress-delete'
        })

        cy.contains('a blog to delete miiro A')
          .contains('show')
          .click()

        cy.contains('a blog to delete miiro A').parent().find('.delete-button').click()
        cy.contains('deleted \'a blog to delete\'')
        cy.get('html').should('not.contain', 'a blog to delete miiro A')
      })
    })

    describe('and a list of blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog by cypress',
          author: 'miiro A',
          url: 'http://blogger.com/cypress/first'
        })

        cy.createBlog({
          title: 'a second blog by cypress',
          author: 'miiro A',
          url: 'http://blogger.com/cypress/second'
        })

        cy.createBlog({
          title: 'a third blog by cypress',
          author: 'miiro A',
          url: 'http://blogger.com/cypress/third'
        })
      })

      it('blogs are ordered according to likes', function () {
        cy.get('.blog').eq(0).should('contain', 'a blog by cypress miiro A')
        cy.get('.blog').eq(1).should('contain', 'a second blog by cypress miiro A')
        cy.get('.blog').eq(2).should('contain', 'a third blog by cypress miiro A')

        cy.contains('a third blog by cypress miiro A').contains('show').click()
        cy.contains('a third blog by cypress miiro A').parent().find('.like-button').click()
        cy.contains('a third blog by cypress miiro A').parent().contains('likes 1')
        cy.contains('a third blog by cypress miiro A').parent().find('.like-button').click()
        cy.contains('a third blog by cypress miiro A').parent().contains('likes 2')
        cy.contains('a third blog by cypress miiro A').contains('hide').click()
        cy.contains('a second blog by cypress miiro A').contains('show').click()
        cy.contains('a second blog by cypress miiro A').parent().find('.like-button').click()
        cy.contains('a second blog by cypress miiro A').parent().contains('likes 1')

        cy.get('.blog').eq(0).should('contain', 'a third blog by cypress miiro A')
        cy.get('.blog').eq(1).should('contain', 'a second blog by cypress miiro A')
        cy.get('.blog').eq(2).should('contain', 'a blog by cypress miiro A')
      })
    })
  })
})