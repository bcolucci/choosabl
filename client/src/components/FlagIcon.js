import React, { PureComponent } from 'react'
import Flag from 'react-flags'

export default class extends PureComponent {
  render () {
    return (
      <Flag
        basePath=''
        format='png'
        pngSize={32}
        name={this.props.value.substr(-2)}
        className='lang_flag'
      />
    )
  }
}
