import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import conformsTo from 'lodash/conformsTo'
import isNil from 'lodash/isNil'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useBet } from '../../../hooks/bets'
import { useTeam } from '../../../hooks/teams'
import Bet from './Bet'
import ChoiceWinner from './ChoiceWinner'
import InformationMatch from './InformationMatch'
import InformationResult from './InformationResult'
import './Match.scss'
import MatchInfos from './MatchInfos'
import Odds from './Odds'
import PointsWon from './PointsWon'
import Scores from './Scores'
import ValidIcon from './ValidIcon'
import Flag from '../../../components/Flag'

const empty = {}

const getBackgroundColor = (pointsWon) => {
  // No bet ?
  const hasBet = isNumber(pointsWon)

  if (!hasBet) return 'lightgrey'
  return '#EEAB90'
}

const Match = ({ matchSnapshot }) => {
  const [bet, saveBet] = useBet(matchSnapshot.id)
  const [currentBet, setCurrentBet] = useState(bet)

  const match = matchSnapshot.data()
  const teamA = useTeam(match.teamA)
  const teamB = useTeam(match.teamB)

  const past = match.dateTime.toMillis() <= Date.now()

  const isBetValid = (updatedBet) => {
    const scoreValidator = (score) => isNumber(score) && score >= 0
    const winnerValidator = (winner) =>
      winner && (winner === 'A' || winner === 'B')

    if (
      !conformsTo(updatedBet, {
        betTeamA: scoreValidator,
        betTeamB: scoreValidator,
      })
    )
      return false

    return match.phase === '0'
      ? true
      : updatedBet.betTeamA !== updatedBet.betTeamB ||
          conformsTo(updatedBet, {
            betWinner: winnerValidator,
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

  const handleWinnerChoiceChange = ({ target: { value } }) => {
    const updatedBet = {
      ...currentBet,
      betWinner: value,
    }
    setCurrentBet(updatedBet)
    saveBetIfValid(updatedBet)
  }

  const saveBetIfValid = (updatedBet) => {
    if (isBetValid(updatedBet)) {
      saveBet(updatedBet)
    }
  }

  const displayChoiceWinner = ({ betTeamA, betTeamB }) =>
    !isNil(betTeamA) && !isNil(betTeamB) && betTeamA === betTeamB

  const betSaved = () =>
    isBetValid(currentBet) &&
    currentBet.betTeamA === bet?.betTeamA &&
    currentBet.betTeamB === bet?.betTeamB &&
    currentBet.betWinner === bet?.betWinner

  return (
    match.display && (
      <>
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
                  className="w-16 text-4xl font-sans text-right"
                  id={`betValue${teamA.code}`}
                  error={
                    currentBet?.betTeamA < 0 ||
                    [1, 2, 4].includes(currentBet?.betTeamA)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    currentBet?.betTeamA >= 0 ? currentBet?.betTeamA : '...'
                  }
                  onChange={handleTeamAChange}
                  disabled={past}
                />
                {past ? (
                  <InformationResult {...bet} />
                ) : (
                  <ValidIcon valid={betSaved()} />
                )}
                <input
                  type="text"
                  className="w-16 text-4xl font-sans text-left"
                  id={`betValue${teamB.code}`}
                  error={
                    currentBet?.betTeamB < 0 ||
                    [1, 2, 4].includes(currentBet?.betTeamA)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    currentBet?.betTeamB >= 0 ? currentBet?.betTeamB : '...'
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
        {/* 
        <Card className="match-card" variant="outlined">
          <CardContent
            style={{
              paddingBottom: '15px',
              backgroundColor:
                past &&
                getBackgroundColor(currentBet?.proxi, currentBet?.pointsWon),
            }}
          >
            <div className="flex justify-center">
              {past ? (
                <InformationResult {...bet} />
              ) : (
                <ValidIcon valid={betSaved()} />
              )}
              <InformationMatch phase={match.phase} group={teamA.group} />
            </div>

            <div className="flex justify-around my-4">
              <Bet
                team={teamA}
                betValue={currentBet?.betTeamA}
                onBetValueUpdated={handleTeamAChange}
                past={past}
              />
              <Bet
                team={teamB}
                betValue={currentBet?.betTeamB}
                onBetValueUpdated={handleTeamBChange}
                past={past}
              />
            </div>

            <div className="points-odds-container">
              {!past && (
                <Odds
                  teamA={teamA}
                  teamB={teamB}
                  A={match.odds.PA}
                  N={match.odds.PN}
                  B={match.odds.PB}
                />
              )}
              {past && <Scores {...match} />}
              {past && <PointsWon {...match} {...bet} />}
            </div>
            {match.phase !== '0' && displayChoiceWinner(bet) && (
              <ChoiceWinner
                teamA={teamA}
                teamB={teamB}
                betValue={bet.betWinner}
                onBetValueUpdated={handleWinnerChoiceChange}
                past={past}
              />
            )}

            <MatchInfos match={match} />
          </CardContent>
        </Card> */}
      </>
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
