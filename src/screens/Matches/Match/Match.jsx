import conformsTo from 'lodash/conformsTo'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useBet } from '../../../hooks/bets'
import { useTeam } from '../../../hooks/teams'
import InformationMatch from './InformationMatch'
import './Match.scss'
import MatchInfos from './MatchInfos'
import ValidIcon from './ValidIcon'
import Flag from '../../../components/Flag'
import PointsWon from './PointsWon/PointsWon'

const empty = {}

const Match = ({ matchSnapshot }) => {
  const [bet, saveBet] = useBet(matchSnapshot.id)
  const [currentBet, setCurrentBet] = useState(bet)

  const match = matchSnapshot.data()
  const teamA = useTeam(match.teamA)
  const teamB = useTeam(match.teamB)

  const past = match.dateTime.toMillis() <= Date.now()

  const isBetValid = (updatedBet) => {
    const scoreValidator = (score) => isNumber(score) && score >= 0

    return conformsTo(updatedBet, {
      betTeamA: scoreValidator,
      betTeamB: scoreValidator,
    })
  }

  const handleChange =
    (team) =>
    ({ target: { value } }) => {
      const updatedBet = {
        ...currentBet,
        [`betTeam${team}`]: Number(value),
      }
      setCurrentBet(updatedBet)
      saveBetIfValid(updatedBet)
    }

  const handleTeamAChange = handleChange('A')
  const handleTeamBChange = handleChange('B')

  const saveBetIfValid = (updatedBet) => {
    if (isBetValid(updatedBet)) {
      saveBet(updatedBet)
    }
  }

  const betSaved = () =>
    isBetValid(currentBet) &&
    currentBet.betTeamA === bet?.betTeamA &&
    currentBet.betTeamB === bet?.betTeamB &&
    currentBet.betWinner === bet?.betWinner

  return (
    match.display && (
      <div className="rounded-xl border w-full p-2 gap-4 max-w-lg text-gray-800 bg-white space-y-2">
        <div className="text-center">
          <InformationMatch phase={match.phase} group={teamA.group} />
        </div>

        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center justify-center gap-2 mt-1 w-24">
            <div>
              <Flag country={teamA.code} className="h-10"></Flag>
            </div>
            <p className="font-sans">{teamA.name}</p>
          </div>

          <div className="text-[#19194B] text-center w-36 space-y-2">
            <div className="flex justify-center gap-2 items-center">
              <input
                type="text"
                placeholder="..."
                className="w-16 text-4xl font-sans text-right"
                id={`betValue${teamA.code}`}
                error={
                  currentBet?.betTeamA < 0 ||
                  [1, 2, 4].includes(currentBet?.betTeamA)
                }
                inputMode="numeric"
                pattern="[0-9]*"
                value={
                  !past
                    ? currentBet?.betTeamA >= 0
                      ? currentBet?.betTeamA
                      : ''
                    : match.scores.A
                }
                onChange={handleTeamAChange}
                disabled={past}
              />
              {past ? (
                <PointsWon {...match} {...currentBet} />
              ) : (
                <ValidIcon valid={betSaved()} />
              )}
              <input
                type="text"
                placeholder="..."
                className="w-16 text-4xl font-sans text-left"
                id={`betValue${teamB.code}`}
                error={
                  currentBet?.betTeamB < 0 ||
                  [1, 2, 4].includes(currentBet?.betTeamA)
                }
                inputMode="numeric"
                pattern="[0-9]*"
                value={
                  !past
                    ? currentBet?.betTeamB >= 0
                      ? currentBet?.betTeamB
                      : ''
                    : match.scores.B
                }
                onChange={handleTeamBChange}
                disabled={past}
              />
            </div>
            <div className="flex justify-between">
              <p
                className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
                  currentBet?.betTeamA > currentBet?.betTeamB
                    ? 'border-[#19194B]'
                    : 'text-gray-500'
                }`}
              >
                {match.odds.PA}
              </p>
              <p
                className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
                  currentBet?.betTeamA &&
                  currentBet?.betTeamA === currentBet?.betTeamB
                    ? 'border-[#19194B]'
                    : 'text-gray-500'
                }`}
              >
                {match.odds.PN}
              </p>
              <p
                className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
                  currentBet?.betTeamA < currentBet?.betTeamB
                    ? 'border-[#19194B]'
                    : 'text-gray-500'
                }`}
              >
                {match.odds.PB}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-1 w-24">
            <div>
              <Flag country={teamB.code} className="h-10"></Flag>
            </div>
            <p className="font-sans">{teamB.name}</p>
          </div>
        </div>

        <div className="col-span-3">
          <MatchInfos match={match} />
        </div>
      </div>
    )
  )
}

Match.defaultProps = {
  match: empty,
  bet: empty,
}

Match.propTypes = {
  match: PropTypes.shape({
    dateTime: PropTypes.shape({
      toDate: PropTypes.func.isRequired,
    }).isRequired,
    phase: PropTypes.string.isRequired,
    scores: PropTypes.shape({}),
  }),
}

export default Match
