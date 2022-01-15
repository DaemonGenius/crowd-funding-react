import React, { Component } from 'react'
import factory from '../ethereum/factory'
import { Container, Button, Card } from 'semantic-ui-react'
import Layout from '../components/layout'
import { Link } from '../routes'

class ProjectIndex extends Component {
  static async getInitialProps() {
    const projects = await factory.methods.getDeployedProjects().call()
    return { projects }
  }

  renderProjects() {
    const items = this.props.projects.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/projects/${address}`}>
            <a> View Projects</a>
          </Link>
        ),
        fluid: true,
      }
    })

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Projects</h3>
          <Link route="/projects/new">
            <a>
              <Button
                floated="right"
                basic
                content="Create Project"
                icon="add circle"
                labelPosition="right"
                primary
              />
            </a>
          </Link>

          {this.renderProjects()}
        </div>
      </Layout>
    )
  }
}

export default ProjectIndex
