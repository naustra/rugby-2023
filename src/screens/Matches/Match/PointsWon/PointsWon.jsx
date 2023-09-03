import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import './PointsWon.scss'

const PointsWon = ({ pointsWon, scores }) => {
  if (!scores) return null

  return (
    <div className="points-won-container">
      {
        <Typography variant="h3" style={{ fontWeight: 'bold' }}>
          {pointsWon || 0} pts
        </Typography>
      }
    </div>
  )
}

PointsWon.propTypes = {
  pointsWon: PropTypes.number,
  scores: PropTypes.shape({
    A: PropTypes.number.isRequired,
    B: PropTypes.number.isRequired,
  }),
  // odds: PropTypes.objectOf(PropTypes.number),
}

export default PointsWon
