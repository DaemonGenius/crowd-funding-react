import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'
import { Router, Link } from '../routes'

import web3 from '../ethereum/web3'
import CrowdFund from '../ethereum/project'

class RequestRow extends Component {
  state = {
    loading: false,
    errorMessage: ''
  }

  onApprove = async () => {
    this.setState({ loading: true })
    try {
      this.setState({ errorMessage: '' })

      this.setState({ loading: false })

      const project = CrowdFund(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await project.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      })

      Router.pushRoute('/')
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
  }

  onFinalize = async () => {
    this.setState({ loading: true })
    try {
      this.setState({ errorMessage: '' })
      this.setState({ loading: false })
      const project = CrowdFund(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await project.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      })

      Router.pushRoute('/')
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
  }

  render() {
    const { Row, Cell } = Table

    const { id, request, approversCount } = this.props
    const readyToFinalize = request.approvalCount > approversCount / 2

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="green"
              basic
              onClick={this.onApprove}
              loading={this.state.loading}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="teal"
              basic
              onClick={this.onFinalize}
              loading={this.state.loading}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    )
  }
}

export default RequestRow
