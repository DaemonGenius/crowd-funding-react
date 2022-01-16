import React, { Component } from 'react'
import { Form, Button, Input, Message, Card, Grid } from 'semantic-ui-react'
import Layout from '../../components/layout'
import { Router, Link } from '../../routes'
import ContributeForm from '../../components/contributeForm'

import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import CrowdFund from '../../ethereum/project'

class Show extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false,
  }

  static async getInitialProps(props) {
    const project = CrowdFund(props.query.address)
    const summary = await project.methods.getSummary().call()

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    }
  }

  renderProjects() {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount,
    } = this.props

    const items = [
      {
        header: manager,
        description: 'The manager created this Project',
        meta: 'Address of Manager',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        description: 'Minimum Contribution (Wei).',
        meta: 'You must contribute at least this much wei',
      },
      {
        header: requestCount,
        description: 'A requestr tries to withdraw money from the contract',
        meta: 'Number of Requests',
      },
      {
        header: approversCount,
        description: 'Number of people who approved the Request',
        meta: 'Number of Approvers',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        description: 'How much Ether is left to spend',
        meta: 'Project Balance (Ether)',
      },
    ]

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Show Project</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderProjects()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Column>
            <Grid.Row>
              <Link route={`/projects/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Layout>
    )
  }
}

export default Show
