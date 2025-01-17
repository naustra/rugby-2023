import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import find from 'lodash/find'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import Flag from '../../../../components/Flag'
import { useTeams } from '../../../../hooks/teams'
import './FinalWinnerChoice.scss'

const FinalWinnerChoice = ({ userTeam, disabled, onValueChange }) => {
  const teams = useTeams()

  return (
    <div className="winner-choice">
      {FlagDisplay(teams, userTeam)}
      <div className="winner-choice-select-container">
        <Select
          className="winner-choice-select-value"
          value={userTeam ?? ''}
          onChange={onValueChange}
          inputProps={{
            name: 'userTeam',
          }}
          disabled={disabled}
        >
          {map(teams, (team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.data().name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {OddDisplay(teams, userTeam)}
    </div>
  )
}

// Affichage du drapeau du pays choisi
const FlagDisplay = (teams, userTeam) => {
  const teamDisplayed = find(teams, (team) => team.id === userTeam)

  return (
    teamDisplayed && (
      <Flag
        country={teamDisplayed.data().code}
        className="winner-choice-flag"
      />
    )
  )
}

// Affichage de la cote du pays choisi
const OddDisplay = (teams, userTeam) => {
  const teamDisplayed = find(teams, (team) => team.id === userTeam)

  return (
    teamDisplayed && (
      <Tooltip
        title="Cote pour la victoire finale"
        placement="right"
        enterTouchDelay={0}
      >
        <Typography variant="h1" className="winner-choice-odd">
          {teamDisplayed.data().winOdd}
        </Typography>
      </Tooltip>
    )
  )
}

FinalWinnerChoice.defaultProps = {
  teams: [],
}

FinalWinnerChoice.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})),
  userTeam: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
}

export default FinalWinnerChoice
