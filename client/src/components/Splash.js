import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'

export default () => (
  <div style={{ display: 'block', textAlign: 'center' }}>
    <img
      src='/logo254-crop.png'
      alt='Choosabl logo'
      style={{ marginTop: '25%', marginBottom: '15%' }}
    />
    <br />
    <LinearProgress
      color='secondary'
      style={{
        backgroundColor: '#4574ba',
        width: '60%',
        marginLeft: '20%'
      }}
    />
  </div>
)
