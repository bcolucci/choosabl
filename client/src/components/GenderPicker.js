import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import { withIntl } from '../utils/combinedWith'

export default withIntl(
  class extends PureComponent {
    static propTypes = {
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired
    }

    constructor (props) {
      super(props)
      this.items = [
        {
          label: props.t('woman'),
          value: 'woman'
        },
        {
          label: props.t('man'),
          value: 'man'
        },
        {
          label: props.t('other'),
          value: 'other'
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
      return (
        <div>
          <FormLabel component='legend'>Gender</FormLabel>
          <RadioGroup {...this.props}>
            {this.items.map(this.renderItem)}
          </RadioGroup>
        </div>
      )
    }
  }
)
