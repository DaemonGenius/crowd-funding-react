import React from 'react'
import { Container } from 'semantic-ui-react'
import Menu  from './menu'
import 'semantic-ui-css/semantic.min.css'

function layout(props) {
  return (
    <Container>
      <Menu />
      {props.children}
    </Container>
  )
}

export default layout
