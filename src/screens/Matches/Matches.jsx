import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import map from 'lodash/map'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches } from '../../hooks/matches'
import MatchToBet from './MatchToBet'
import MatchBegun from './MatchBegun'
import './matches.scss'

const Matches = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [comparingDate, setComparingDate] = useState(Date.now())

  const handleTabChange = (event, value) => {
    setSelectedTab(value)
  }

  useEffect(() => {
    const handle = setInterval(() => setComparingDate(Date.now()), 5000)
    return clearInterval(handle)
  })

  const matches = useMatches()

  const filteredMatches = useMemo(
    () =>
      selectedTab === 0
        ? matches.filter((match) => {
            const timestamp = match.get('dateTime').toMillis()

            return timestamp > comparingDate
          })
        : matches
            .filter((match) => {
              const timestamp = match.get('dateTime').toMillis()

              return timestamp <= comparingDate
            })
            .reverse(),
    [comparingDate, matches, selectedTab],
  )

  const LaunchBetDate = new Date(useCompetitionData().launchBet.seconds * 1000)

  return isPast(LaunchBetDate) ? (
    <>
      <AppBar position="fixed" className="matches-tab-bar" color="secondary">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
        >
          <Tab label="À venir" />
          <Tab label="En cours / Terminé" />
        </Tabs>
      </AppBar>
      <div className="matches-container">
        {selectedTab === 0
          ? map(filteredMatches, (documentSnapshot) => (
              <MatchToBet
                matchSnapshot={documentSnapshot}
                key={documentSnapshot.id}
              />
            ))
          : map(filteredMatches, (documentSnapshot) => (
              <MatchBegun
                matchSnapshot={documentSnapshot}
                key={documentSnapshot.id}
              />
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

const MatchesSuspense = (props) => {
  return (
    <Suspense fallback="Loading matches...">
      <Matches {...props} />
    </Suspense>
  )
}

export default MatchesSuspense
