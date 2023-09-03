import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import './InformationResult.scss'

const getMessage = (hasBet, pointsWon, maxPoints) => {
  if (!hasBet) return "Vous n'avez pas pronostiqué"
  if (pointsWon == 0) return "Vous n'avez pas marqué de points"
  if (pointsWon === maxPoints) return 'Vous avez pronostiqué le score parfait!'

  return 'Vous avez pronostiqué le bon résultat'
}

const InformationResult = ({ pointsWon, scores, odds }) => {
  // No bet ?
  const hasBet = isNumber(pointsWon)

  // Find odd depending on scores
  const { A, B } = scores
  const oddScore = A > B ? odds.PA : A < B ? odds.PB : odds.PN

  return (
    <Tooltip
      title={getMessage(hasBet, pointsWon, oddScore)}
      placement="right"
      enterTouchDelay={0}
    >
      <div className="">
        <HelpOutlineIcon></HelpOutlineIcon>
      </div>
    </Tooltip>
  )
}

InformationResult.propTypes = {
  pointsWon: PropTypes.number,
}

export default InformationResult
