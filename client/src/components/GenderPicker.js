import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import withAll from '../utils/with'

class GenderPicker extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.items = [
      {
        value: 'woman',
        label: props.t('profile:Woman')
      },
      {
        value: 'man',
        label: props.t('profile:Man')
      },
      {
        value: 'other',
        label: props.t('profile:Other')
      }
    ]
  }

  renderItem = ({ label, value }) => (
    <FormControlLabel
      key={value}
      label={label}
      value={value}
      control={<Radio />}
    />
  )

  render () {
    const { value, onChange } = this.props
    return (
      <div>
        <FormLabel component='legend'>Gender</FormLabel>
        <RadioGroup value={value} onChange={onChange}>
          {this.items.map(this.renderItem)}
        </RadioGroup>
      </div>
    )
  }
}

export default withAll(GenderPicker, {
  withIntl: true
})
