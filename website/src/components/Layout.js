import React, { Component } from 'react'
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav'
import { Container } from './Framework'
import Nav from './Nav'
import NavButtons from './NavButtons'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import SEO from './SEO'
import CSS from '../css'

class Layout extends Component {
  state = {
    isNavOpen: false,
  }

  openNav = () => {
    this.setState({ isNavOpen: true })
  }

  closeNav = () => {
    this.setState({ isNavOpen: false })
  }

  render() {
    const { isNavOpen } = this.state
    const { children, pageContext } = this.props
    return (
      <>
        <CSS />
        <SEO pageContext={pageContext} />
        <SkipNavLink />
        <Main>
          <Header
            openNav={this.openNav}
            isNavOpen={isNavOpen}
            pageIndex={pageContext.frontmatter.index}
          />
          <Nav isOpen={isNavOpen} close={this.closeNav} />
          <SkipNavContent>
            <Container>
              <h2>{pageContext.frontmatter.title}</h2>
              {children}
              <NavButtons next={pageContext.frontmatter.index + 1} />
            </Container>
          </SkipNavContent>
          <Footer>© {new Date().getFullYear()} - MIT License</Footer>
        </Main>
      </>
    )
  }
}

export default Layout
