import React, { PureComponent } from 'react'

export default class extends PureComponent {
  render () {
    const { user } = this.props
    return (
      <div>
        <h2>Account</h2>
        <p>{user.email}</p>
      </div>
    )
  }
}
