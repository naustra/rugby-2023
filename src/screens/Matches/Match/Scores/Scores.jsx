import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import './Scores.scss'

const Scores = ({ scores }) => {
  if (!scores) return null
  const { A, B } = scores
  const realResult = findResult(A, B)
  return (
    <div className="scores-container">
      <Tooltip title="Score final" placement="top" enterTouchDelay={0}>
        <Typography variant="body2">
          <span className={realResult === 'A' ? 'winner' : ''}>{A}</span>
          &nbsp;-&nbsp;
          <span className={realResult === 'B' ? 'winner' : ''}>{B}</span>
        </Typography>
      </Tooltip>
    </div>
  )
}

const findResult = (score1, score2) => {
  if (score1 > score2) return 'A'
  if (score1 === score2) return 'N'
  return 'B'
}

Scores.propTypes = {
  scores: PropTypes.shape({
    A: PropTypes.number.isRequired,
    B: PropTypes.number.isRequired,
    winner: PropTypes.oneOf(['A', 'B', 'N']),
  }),
}

export default Scores
