import React, { Component } from 'react'
import {
  Form,
  Button,
  Input,
  Message,
  Card,
  Grid,
  Table,
} from 'semantic-ui-react'
import Layout from '../../../components/layout'
import { Router, Link } from '../../../routes'
import ContributeForm from '../../../components/contributeForm'
import RequestRow from '../../../components/RequestRow'

import factory from '../../../ethereum/factory'
import web3 from '../../../ethereum/web3'
import CrowdFund from '../../../ethereum/project'

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query
    const project = CrowdFund(address)
    const requestCount = await project.methods.getRequestsCount().call()

    const approversCount = await project.methods.approversCount().call()

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return project.methods.requests(index).call()
        }),
    )
    return { address, requests, requestCount, approversCount }
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      )
    })
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/projects/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (Ether)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} </div>
      </Layout>
    )
  }
}

export default RequestIndex
