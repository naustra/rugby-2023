import Tooltip from '@mui/material/Tooltip'
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fr from 'date-fns/locale/fr'
import PropTypes from 'prop-types'
import './matchInfos.scss'

const MatchInfos = ({ match }) => {
  const dateTime = match.dateTime.toDate()

  return (
    <div className="match-infos-container">
      <Tooltip
        title={format(dateTime, 'PPPppp', { locale: fr })}
        enterTouchDelay={0}
      >
        <div>
          {formatDistanceToNow(dateTime, { locale: fr, addSuffix: true })}
        </div>
      </Tooltip>
      <div>•</div>
      <div>{match.ville}</div>
      <div>•</div>
      <div>{match.streaming}</div>
    </div>
  )
}

MatchInfos.defaultProps = {
  match: {
    dateTime: 0,
  },
}

MatchInfos.propTypes = {
  match: PropTypes.shape({
    dateTime: PropTypes.shape({
      toDate: PropTypes.func.isRequired,
    }).isRequired,
  }),
}

export default MatchInfos
