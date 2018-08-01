import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { auth } from 'firebase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { SocialIcon } from 'react-social-icons'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends PureComponent {
    static propTypes = {
      open: PropTypes.bool,
      onClose: PropTypes.func
    }

    handleSignInWithProvider = async provider => {
      try {
        await auth().signInWithPopup(provider)
        window.location.replace('/')
      } catch (err) {
        window.alert(err.message)
      }
    }

    render () {
      const { t, open, onClose } = this.props
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Sign In</DialogTitle>
          <div>
            <List>
              <ListItem
                button
                onClick={() =>
                  this.handleSignInWithProvider(new auth.GoogleAuthProvider())
                }
              >
                <ListItemAvatar>
                  <SocialIcon url='https://google.com' />
                </ListItemAvatar>
                <ListItemText
                  primary={t('sign-in-with-provider', {
                    provider: 'Google'
                  })}
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  this.handleSignInWithProvider(new auth.FacebookAuthProvider())
                }
              >
                <ListItemAvatar>
                  <SocialIcon url='https://facebook.com' />
                </ListItemAvatar>
                <ListItemText
                  primary={t('sign-in-with-provider', {
                    provider: 'Facebook'
                  })}
                />
              </ListItem>
            </List>
          </div>
        </Dialog>
      )
    }
  }
)
