/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import { getRedirectResult, onAuthStateChanged } from '@firebase/auth'
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import PropTypes from 'prop-types'
import { Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuth, useFirestore, useSigninCheck } from 'reactfire'
import Baniere from '../../assets/visuels/bandeauSignature.jpg'
import BaniereTablette from '../../assets/visuels/baniere_pm.jpg'
import BaniereMobile from '../../assets/visuels/bandeauTitreMobile.png'
import { useNotificationPermission } from '../../hooks/notifications'
import FAQPage from '../FAQ'
import GroupsPage from '../Groups'
import HomePage from '../HomePage'
import UserPage from '../User'
import MatchesPage from '../Matches'
import NotFoundPage from '../NotFoundPage'
import NotificationHandler from '../Notifications/NotificationHandler'
import Profile from '../Profile'
import RankingPage from '../Ranking'
import RulesPage from '../Rules'
import './App.scss'
import ConnectionWidget from './ConnectionWidget'
import NavigationMenu from './NavigationMenu'

/**
 * Mise à jour du profil utilisateur (dans la collection `users` sur une connection)
 */
const updateUserProfile = (firestore, auth) => async (user) => {
  // getRedirectResult ne sera rempli que lors d'un connexion manuelle.
  // Les reconnexions auto et les rafraichissments de token ne donnent pas les `additionalUserInfo`
  const userCredentials = await getRedirectResult(auth)

  let additionalUserInfo = {}
  if (userCredentials?.user) {
    const { providerId, profile } = userCredentials.additionalUserInfo
    if (profile?.picture?.data?.url) {
      user.photoURL = await user.updateProfile({
        photoURL: profile?.picture?.data?.url,
      })
    }

    additionalUserInfo = {
      providerId,
      profile,
    }
  }

  const userCollection = collection(firestore, 'users')
  const userDoc = doc(userCollection, user.uid)
  return setDoc(
    userDoc,
    {
      uid: user.uid,
      avatarUrl:
        additionalUserInfo.profile?.picture?.data?.url ?? user.photoURL,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      providerData: user.providerData,
      lastConnection: serverTimestamp(),
      nbConnections: increment(1),
      ...additionalUserInfo,
    },
    { merge: true },
  )
}

const App = ({ beforeInstallPrompt }) => {
  const { permission } = useNotificationPermission()

  const auth = useAuth()
  const firestore = useFirestore()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await updateUserProfile(firestore, auth)(user)
    }
  })

  const [menuOpen, setMenuOpen] = useState(false)

  const {
    data: { signedIn },
  } = useSigninCheck()
  const {
    data: { signedIn: adminUser },
  } = useSigninCheck({ requiredClaims: { admin: true } })

  return (
    <>
      <AppBar>
        <Toolbar className="app-toolbar">
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <div className="app-toolbar-title">
            <img id="imgDesktop" src={Baniere} alt="Baniere" />
            <img id="imgTablette" src={BaniereTablette} alt="Baniere" />
            <img id="imgMobile" src={BaniereMobile} alt="Baniere" />
          </div>
          <Suspense fallback={null}>
            <ConnectionWidget />
          </Suspense>
        </Toolbar>
      </AppBar>

      <NavigationMenu
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      {signedIn && permission === 'granted' && <NotificationHandler />}

      <div className="app-content">
        <Suspense fallback={<>Loading page...</>}>
          {/* Routes accessibles sans connexion */}
          <Routes>
            <Route
              exact
              path="/"
              element={<HomePage beforeInstallPrompt={beforeInstallPrompt} />}
            />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {signedIn && (
              <>
                {/* Routes accessibles avec connexion */}
                <Route path="/matches/*" element={<MatchesPage />} />
                <Route path="/user/*" element={<UserPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/profile" element={<Profile />} />

                {/* Route accessible pour admin */}
                {adminUser && <></>}
              </>
            )}

            {/* NotFoundPage en dernier choix sinon il est active */}
            <Route element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

App.propTypes = {
  user: PropTypes.object,
}

export default App
