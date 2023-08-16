import { Fragment } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '@mui/material/Tooltip'
import padStart from 'lodash/padStart'

import './Odds.scss'

const toHex = (number) =>
  padStart(Math.min(Math.round(Math.abs(number)), 255).toString(16), 2, '0')

const getColor = (value) => {
  const r = (128 / 13) * (value + 1)
  const g = (-128 / 11) * (value - 12)
  return `#${toHex(r)}${toHex(g)}00`
}

const Odds = ({ A, B, N, teamA, teamB }) => {
  const oddBasis = (
    <div className="odds-container">
      <Tooltip
        placement="right"
        title={`Cote de victoire de l'équipe: ${teamA.name}`}
        enterTouchDelay={0}
      >
        <div className="odd" style={{ backgroundColor: getColor(A) }}>
          {A}
        </div>
      </Tooltip>
      {N !== 0 ? (
        <Tooltip placement="top" title="Cote du match nul" enterTouchDelay={0}>
          <div className="odd" style={{ backgroundColor: getColor(N) }}>
            {N}
          </div>
        </Tooltip>
      ) : (
        <div></div>
      )}
      <Tooltip
        placement="left"
        title={`Cote de victoire de l'équipe: ${teamB.name}`}
        enterTouchDelay={0}
      >
        <div className="odd" style={{ backgroundColor: getColor(B) }}>
          {B}
        </div>
      </Tooltip>
    </div>
  )

  return oddBasis
}

Odds.propTypes = {
  A: PropTypes.number,
  B: PropTypes.number,
  N: PropTypes.number,
  teamA: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  teamB: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default Odds
