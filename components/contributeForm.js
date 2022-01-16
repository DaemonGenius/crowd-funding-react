import React, { Component } from 'react'
import { Form, Button, Input, Message, Grid } from 'semantic-ui-react'
import Layout from './layout'
import { Router } from '../routes'

import factory from '../ethereum/factory'
import web3 from '../ethereum/web3'
import Project from '../ethereum/project'

class contributeForm extends Component {
  state = {
    value: '',
    minimumContribution: '',
    errorMessage: '',
    loading: false,
  }

  onSubmit = async (event) => {
    event.preventDefault()

    this.setState({ loading: true })
    const project = Project(this.props.address)

    try {
      this.setState({ errorMessage: '' })
      const accounts = await web3.eth.getAccounts()

      await project.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      })

      Router.replaceRoute(`/projects/${this.props.address}`)
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false })
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) =>
              this.setState({ value: event.target.value })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute
        </Button>
      </Form>
    )
  }
}

export default contributeForm
