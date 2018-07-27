import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Input, Button } from 'react-materialize'

export default class extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired
  }

  state = {
    email: '',
    password: '',
    error: ''
  }

  handleOnChange = field => ({ target }) => {
    this.setState({ [field]: target.value })
  }

  handleOnSubmit = async () => {
    const { email, password } = this.state
    try {
      await this.props.onSubmit(email, password)
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render () {
    const { email, password, error } = this.state
    return (
      <Row>
        {!!error &&
          <Col s={12}>
            <p>Error: {error}</p>
          </Col>}
        <Input
          s={12}
          type='email'
          label='Email'
          onChange={this.handleOnChange('email')}
          value={email}
        />
        <Input
          s={12}
          type='password'
          label='Password'
          onChange={this.handleOnChange('password')}
          value={password}
        />
        <Col s={12}>
          <Button onClick={this.handleOnSubmit}>
            {this.props.buttonLabel}
          </Button>
        </Col>
      </Row>
    )
  }
}
