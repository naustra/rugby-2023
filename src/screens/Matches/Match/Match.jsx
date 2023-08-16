import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import conformsTo from 'lodash/conformsTo'
import isNil from 'lodash/isNil'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setCurrentBet(bet)
  }, [bet])

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
        [`betTeam${team}`]: value,
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
        <Card className="match-card">
          <CardContent
            className="match-content"
            style={{
              backgroundColor:
                past &&
                getBackgroundColor(currentBet.proxi, currentBet.pointsWon),
            }}
          >
            <div className="match-teams">
              <Bet
                team={teamA}
                betValue={currentBet?.betTeamA}
                onBetValueUpdated={handleTeamAChange}
                past={past}
              />
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
              <Bet
                team={teamB}
                betValue={currentBet?.betTeamB}
                onBetValueUpdated={handleTeamBChange}
                past={past}
              />
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
            <Divider />
            <MatchInfos match={match} />
            <InformationMatch phase={match.phase} group={teamA.group} />
            {past ? (
              <InformationResult {...bet} />
            ) : (
              <ValidIcon valid={betSaved()} />
            )}
          </CardContent>
        </Card>
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
