import Tooltip from '@mui/material/Tooltip'
import PropTypes from 'prop-types'
import './InformationMatch.scss'

// https://docs.google.com/spreadsheets/d/1ZioOtyCblJtJf0WAaRxVWmnibqOeC7eDcJYDVEYRqng/edit?usp=sharing
const getPhaseText = (phase) =>
  ({
    0: 'Côtes normales',
    4: 'Côtes multipliées par 2',
    3: 'Côtes multipliées par 6',
    2: 'Côtes multipliées par 4',
    1: 'Côtes multipliées par 8',
  }[phase])

const getPhaseAff = (phase) =>
  ({
    4: '4rts',
    3: '3eme place',
    2: 'Demi',
    1: 'Fin.',
  }[phase])

const InformationMatch = ({ phase, group }) => {
  return (
    <Tooltip title={getPhaseText(phase)} placement="top" enterTouchDelay={0}>
      <div className="text-xs text-gray-500">
        {phase !== '0' ? getPhaseAff(phase) : `Groupe ${group}`}
      </div>
    </Tooltip>
  )
}

InformationMatch.propTypes = {
  phase: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
}

export default InformationMatch
