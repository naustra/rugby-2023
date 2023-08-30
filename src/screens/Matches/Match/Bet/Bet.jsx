import PropTypes from 'prop-types'
import Flag from '../../../../components/Flag'
import './Bet.scss'
import { TextField } from '@mui/material'

const Bet = ({ team, betValue, onBetValueUpdated, past }) => {
  return (
    <div className="bet">
      <div className="bet-title">
        <Flag country={team.code} className="bet-flag" />
        <div className="team-name">{team.name}</div>
      </div>
      <TextField
        id={`betValue${team.code}`}
        error={betValue < 0 || [1, 2, 4].includes(betValue)}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={betValue >= 0 ? betValue : ''}
        onChange={onBetValueUpdated}
        disabled={past}
        margin="dense"
        style={{ width: '58px' }}
      />
    </div>
  )
}

Bet.defaultProps = {
  team: {},
}

Bet.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }),
  onBetValueUpdated: PropTypes.func.isRequired,
  betValue: PropTypes.number,
  past: PropTypes.bool,
}

export default Bet
