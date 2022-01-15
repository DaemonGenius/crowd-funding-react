import React, { Component } from 'react'
import factory from '../ethereum/factory'

class ProjectIndex extends Component {
  static async getInitialProps() {
    const projects = await factory.methods.getDeployedProjects().call()
    return { projects }
  }

  render() {
    return <div>{ this.props.projects[0] }</div>
  }
}

export default ProjectIndex
