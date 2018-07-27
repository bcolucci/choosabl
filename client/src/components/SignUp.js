import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from 'firebase'
import SignForm from './SignForm'

export default withRouter(
  class extends PureComponent {
    handleOnSubmit = async (email, password) => {
      await auth().createUserWithEmailAndPassword(email, password)
      this.props.history.push('/')
    }

    render () {
      return (
        <div>
          <h2>Sign Up</h2>
          <SignForm onSubmit={this.handleOnSubmit} buttonLabel='Sign Up' />
        </div>
      )
    }
  }
)
