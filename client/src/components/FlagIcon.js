import React from 'react'
import Flag from 'react-flags'

export default ({ value }) => {
  if (!value) {
    return null
  }
  return (
    <Flag
      basePath=''
      format='png'
      pngSize={32}
      name={value.substr(-2)}
      className='lang_flag'
    />
  )
}
