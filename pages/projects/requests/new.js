import React, { Component } from 'react'
import { Form, Button, Input, Message, Card, Grid } from 'semantic-ui-react'
import Layout from '../../../components/layout'
import { Router, Link } from '../../../routes'
import ContributeForm from '../../../components/contributeForm'

import web3 from '../../../ethereum/web3'
import CrowdFund from '../../../ethereum/project'

class RequestNew extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
    recipient: '',
    description: '',
  }

  static async getInitialProps(props) {
    const { address } = props.query

    return { address }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const project = CrowdFund(this.props.address)
    const { description, value, recipient } = this.state

    this.setState({ loading: true })
    try {
      this.setState({ errorMessage: '' })
      const accounts = await web3.eth.getAccounts()
      await project.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({
          from: accounts[0],
        })

      Router.pushRoute('/')
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false })
  }

  render() {
    return (
      <Layout>
        <h3>Create a Request</h3>
        <Link route={`/projects/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
          label="Ether"
          labelPosition="right"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    )
  }
}

export default RequestNew
