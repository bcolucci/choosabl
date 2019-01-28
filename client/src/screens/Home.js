import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'

class Home extends PureComponent {
  render () {
    const { classes } = this.props
    const pClass = { fontWeight: 'bold', color: '#666' }
    return (
      <Grid className={classes.whiteBg} container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='h5' color='secondary' gutterBottom>
            Etes-vous sûre de votre photo de profil ?
          </Typography>
          <Typography
            color='primary'
            variant='subtitle1'
            style={{ fontWeight: 'bold' }}
            gutterBottom
          >
            Au travers de votre photo la perception qu'ont les autres influence
            le recrutement, les rendez-vous galants, etc.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img src='/home-woman.png' alt='home woman' />
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant='subtitle1'
            gutterBottom
            style={{
              height: '100%',
              fontWeight: 'bold',
              marginLeft: '-25%',
              backgroundColor: '#fff',
              opacity: 0.7,
              padding: '3% 10%',
              fontSize: '110%',
              lineHeight: '180%'
            }}
          >
            Elle compte pour beaucoup, pourtant vous ne faites pas le bon choix
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            Plusieurs études démontrent que vous choisirez une photo qui vous
            désavantage.
          </Typography>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            Sur 2, 3 ou 4 photos de votre profil, soyez assurés que les autres
            auront une préférence pour une photo différente de votre propre
            choix.
          </Typography>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            C'est ainsi !<br />
            Notre perception fausse notre jugement...
          </Typography>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            Il existe une solution très simple pour vous aider :<br />
            CHOOSABL
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Typography
            color='primary'
            variant='subtitle1'
            style={{ fontWeight: 'bold' }}
            gutterBottom
          >
            Demandez qu'on choisisse pour vous ; Et vous aurez l'assurance
            d'être mieux perçu.
          </Typography>
          <img src='/home-people.png' alt='home people' />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            Soumettez au vote 2 photos et les autres vous diront celle qui vous
            gratifie le mieux.
          </Typography>
          <Typography variant='subtitle1' style={pClass} gutterBottom>
            Un échange de bons procédés :<br />
            vous votez pour aider les autres et en retour vous obtenez des
            votes.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.spaced}
          style={{ textAlign: 'center' }}
        >
          <Typography
            variant='h5'
            color='secondary'
            gutterBottom
            style={{
              fontSize: '120%',
              fontWeight: 'bold'
            }}
          >
            C'est gratuit et parfaitement anonyme
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.spaced}
          style={{ paddingLeft: '5%' }}
        >
          <img src='/logo-bulle.png' alt='home logo bulle' />
          <Typography
            color='primary'
            variant='subtitle1'
            style={{ fontWeight: 'bold', paddingLeft: 10 }}
            gutterBottom
          >
            L'app sociale qui vous aide à choisir
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withAll(Home, {
  // withIntl: true,
  withStyles: true
})
