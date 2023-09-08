import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import './PointsWon.scss'
import { Tooltip } from '@mui/material'
import isNumber from 'lodash/isNumber'

const getMessage = (betTeamA, betTeamB, pointsWon, maxPoints) => {
  const hasBet = isNumber(betTeamA) && isNumber(betTeamB)

  const scoreBet = `: ${betTeamA} - ${betTeamB}`

  if (!hasBet) return "Vous n'avez pas pronostiqué" + scoreBet
  if (pointsWon == 0) return "Vous n'avez pas marqué de points" + scoreBet
  if (pointsWon === maxPoints)
    return 'Vous avez pronostiqué le score parfait!' + scoreBet

  return 'Vous avez pronostiqué le bon résultat' + scoreBet
}

const PointsWon = ({ betTeamA, betTeamB, pointsWon, scores, odds }) => {
  if (!scores) return null

  // Find odd depending on scores
  const { A, B } = scores
  const oddScore = A > B ? odds.PA : A < B ? odds.PB : odds.PN

  return (
    <Tooltip
      title={getMessage(betTeamA, betTeamB, pointsWon, oddScore)}
      placement="bottom"
      enterTouchDelay={0}
      className="points-won-container"
    >
      <Typography variant="h3" style={{ fontWeight: 'bold' }}>
        {pointsWon || 0} pts
      </Typography>
    </Tooltip>
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
