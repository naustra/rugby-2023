import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import map from 'lodash/map'
import { Suspense, useEffect, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches } from '../../hooks/matches'
import MatchBegun from './MatchBegun'
import './User.scss'
import { AppBar, Tab, Tabs } from '@mui/material'

const User = () => {
  const [comparingDate, setComparingDate] = useState(Date.now())

  useEffect(() => {
    const handle = setInterval(() => setComparingDate(Date.now()), 5000)
    return clearInterval(handle)
  })

  const matches = useMatches()

  const filteredMatches = matches
    .filter((match) => {
      const timestamp = match.dateTime?.toMillis()

      return timestamp <= comparingDate
    })
    .reverse()

  const LaunchBetDate = new Date(useCompetitionData().launchBet.seconds * 1000)
  console.log('🚀 ~ file: User.jsx:31 ~ User ~ LaunchBetDate:', LaunchBetDate)

  return isPast(LaunchBetDate) ? (
    <>
      <AppBar position="fixed" className="matches-tab-bar" color="secondary">
        <Tabs centered textColor="inherit" value={0}>
          <Tab label="En cours / Terminé" />
        </Tabs>
      </AppBar>
      <div className="matches-container">
        {map(filteredMatches, (match) => (
          <MatchBegun match={match} key={match.id} />
        ))}
      </div>
    </>
  ) : (
    <Typography variant="h1">
      ⚠ Les pronostics seront accessibles à partir du DATE ! D'ici là, vous
      pouvez créer votre groupe et vous inscrire aux notifications pour être
      prévenu de toutes les actualité du site !
    </Typography>
  )
}

const UserSuspense = (props) => {
  console.log('🚀 ~ file: User.jsx:56 ~ UserSuspense ~ props:', props)
  return (
    <Suspense fallback="Loading matches...">
      <User {...props} />
    </Suspense>
  )
}

export default UserSuspense
