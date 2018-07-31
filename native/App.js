import React, { PureComponent } from 'react'
import { WebView } from 'react-native'
import RUA from 'random-useragent'

export default class extends PureComponent {
  render () {
    return (
      <WebView
        userAgent={RUA.getRandom()}
        source={{ uri: 'https://choosabl-test.firebaseio.com?webview=1' }}
      />
    )
  }
}
