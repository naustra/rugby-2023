import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import isEmpty from 'lodash/isEmpty'
import { Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGroupsForUserMember } from '../../hooks/groups'
import GroupRanking from './GroupRanking'
import './ranking.scss'
import { useAllOpponents } from '../../hooks/opponents'

const Ranking = () => {
  const [selectedTab, setSelectedTab] = useState(1)
  const groups = useGroupsForUserMember()
  const handleTabChange = (event, value) => {
    setSelectedTab(value)
  }

  const allOpponents = useAllOpponents()

  return isEmpty(groups) ? (
    <>
      <div className="ranking-page-div">
        <p>
          Pour pouvoir visualiser dans le classement, il vous faut tout
          d&apos;abord <Link to="/groups">créer ou rejoindre une tribu</Link>.
        </p>
      </div>
    </>
  ) : (
    <>
      <AppBar position="fixed" className="ranking-tab-bar" color="secondary">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
        >
          <Tab label="Général" />
          {groups.map((group) => (
            <Tab
              key={group.id}
              label={
                group.data().name.length > 10
                  ? `${group.data().name.slice(0, 7)}...`
                  : group.data().name
              }
            />
          ))}
        </Tabs>
      </AppBar>
      <div className="ranking-container">
        {!isEmpty(groups) && selectedTab === 0 ? (
          <GroupRanking
            {...{
              name: 'Général',
              opponentsProvided: allOpponents,
            }}
          />
        ) : (
          <GroupRanking {...groups[selectedTab - 1]?.data()} />
        )}
      </div>
    </>
  )
}

Ranking.propTypes = {}

const RankingWithSuspense = (props) => {
  return (
    <Suspense fallback="Loading groups...">
      <Ranking {...props} />
    </Suspense>
  )
}

export default RankingWithSuspense
