import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!!user) {
        return <Component {...props} user={user} />
      }
      return <Redirect to={{
        pathname: '/',
        state: {
          from: props.location
        }
      }} />
    }}
  />
)
