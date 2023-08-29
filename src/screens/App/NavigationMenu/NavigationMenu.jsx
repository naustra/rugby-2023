import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import PropTypes from 'prop-types'
import { Suspense } from 'react'
import { useNavigate } from 'react-router'
import SideImg from '../../../assets/visuels/rules-281x310.jpg'
import { useIsUserAdmin, useIsUserConnected } from '../../../hooks/user'
import { openPAMTab } from '../../../utils'

const NavigationMenu = ({ closeMenu, menuOpen }) => {
  const isConnected = useIsUserConnected()
  const isAdmin = useIsUserAdmin()
  const navigate = useNavigate()

  const goTo = (to) => () => {
    navigate(to)
    closeMenu()
  }

  return (
    <Drawer open={menuOpen} onClose={closeMenu}>
      <List>
        {/* Route accessibles sans connexion */}
        <ListItemButton onClick={goTo('/')} sx={{ m: -2, mb: -1 }}>
          <img src={SideImg} alt="Accueil" />
        </ListItemButton>
        <Divider />

        {/* Route accessibles sans connexion (Doublon page d'accueil) */}
        <ListItemButton onClick={goTo('/')}>
          <ListItemText primary="Accueil" />
        </ListItemButton>

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/matches')}>
            <ListItemText primary="Pariez" />
          </ListItemButton>
        )}

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/ranking')}>
            <ListItemText primary="Classement" />
          </ListItemButton>
        )}

        {/* Route accessible pour admin seulement */}
        {isAdmin && (
          <ListItemButton onClick={goTo('/matchesvalidation')}>
            <ListItemText primary="Validation des matchs" />
          </ListItemButton>
        )}

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/groups')}>
            <ListItemText primary="Gestion des tribus" />
          </ListItemButton>
        )}

        {/* Route accessible pour admin seulement */}
        {isAdmin && (
          <ListItemButton onClick={goTo('/validinscription')}>
            <ListItemText primary="Valider l'inscription d'un membre" />
          </ListItemButton>
        )}

        {/* Routes accessibles sans connexion */}
        <ListItemButton onClick={goTo('/rules')}>
          <ListItemText primary="Réglement" />
        </ListItemButton>

        {/* Routes accessibles sans connexion */}
        <ListItemButton onClick={goTo('/faq')}>
          <ListItemText primary="FAQ" />
        </ListItemButton>

        {/* Routes accessibles sans connexion */}
        <ListItemButton onClick={openPAMTab}>
          <ListItemText primary="L'association PAM" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

NavigationMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
}

const NavigationMenuSuspense = (props) => {
  return (
    <Suspense fallback="Loading Navigation menu">
      <NavigationMenu {...props} />
    </Suspense>
  )
}

export default NavigationMenuSuspense
