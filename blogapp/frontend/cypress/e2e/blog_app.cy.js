describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Test User',
      username: 'TestUser',
      password: 'TestPassword',
    }
    const user2 = {
      name: 'Test User2',
      username: 'TestUser2',
      password: 'TestPassword2',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('TestUser')
      cy.get('#password').type('TestPassword')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('TestUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test URL')
      cy.get('#submit').click()
      cy.contains('Test title Test Author')
    })
  })

  describe('and some blogs exists', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
      cy.createBlog({ title: 'Blog1', author: 'Author1', url: 'www.1.fi' })
      cy.createBlog({ title: 'Blog2', author: 'Author2', url: 'www.2.fi' })
      cy.createBlog({ title: 'Blog3', author: 'Author3', url: 'www.3.fi' })
    })

    it('user can like a blog', function () {
      cy.contains('Blog2').parent().as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog').contains('like').click()
      cy.get('@theBlog').should('contain', '1')
    })
  })

  describe('blogs can be removed', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
      cy.createBlog({ title: 'Blog1', author: 'Author1', url: 'www.1.fi' })
      cy.createBlog({ title: 'Blog2', author: 'Author2', url: 'www.2.fi' })
      cy.createBlog({ title: 'Blog3', author: 'Author3', url: 'www.3.fi' })
    })

    it('user can remove a blog', function () {
      cy.contains('Blog2').parent().as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog').contains('remove').click()
      cy.wait(500)
      cy.get('html').should('not.contain', 'Blog2')
    })

    it('user cannot remove a blog of another user', function () {
      cy.contains('logout').click()
      cy.login({ username: 'TestUser2', password: 'TestPassword2' })
      cy.contains('Blog2').parent().as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog')
        .find('button')
        .contains('remove')
        .should('not.be.visible')
    })
  })

  describe('blogs are ordered by number of likes', function () {
    beforeEach(function () {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
      cy.createBlog({ title: 'Blog1', author: 'Author1', url: 'www.1.fi' })
      cy.createBlog({ title: 'Blog2', author: 'Author2', url: 'www.2.fi' })
      cy.createBlog({ title: 'Blog3', author: 'Author3', url: 'www.3.fi' })
    })

    it('blogs are in correct order', function () {
      cy.contains('Blog2').parent().as('theBlog2')
      cy.get('@theBlog2').contains('view').click()
      cy.get('@theBlog2').contains('like').click()

      cy.contains('Blog3').parent().as('theBlog3')
      cy.get('@theBlog3').contains('view').click()
      cy.get('@theBlog3').contains('like').click()
      cy.get('@theBlog3').contains('like').click()
      cy.get('.blog').eq(0).should('contain', 'Blog2')
      cy.get('.blog').eq(1).should('contain', 'Blog3')
      cy.get('.blog').eq(2).should('contain', 'Blog1')
    })
  })
})
