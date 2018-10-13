import React, { PureComponent } from 'react'
import analytics from '../analytics'

export default () => WrappedComponent => {
  return class extends PureComponent {
    render () {
      return <WrappedComponent {...this.props} analytics={analytics} />
    }
  }
}
