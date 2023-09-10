import PropTypes from 'prop-types'
import { useBet } from '../../../hooks/bets'
import { useTeam } from '../../../hooks/teams'
import InformationMatch from './InformationMatch'
import './Match.scss'
import MatchInfos from './MatchInfos'
import Odds from '../components/Odds'
import Flag from '../../../components/Flag'
import PointsWon from './PointsWon/PointsWon'

const empty = {}

const Match = ({ matchSnapshot }) => {
  const currentBet = useBet(matchSnapshot.id)

  const match = matchSnapshot.data()
  const teamA = useTeam(match.teamA)
  const teamB = useTeam(match.teamB)

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
                value={match.scores.A}
                disabled={true}
              />
              <PointsWon {...match} {...currentBet} />
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
                value={match.scores.B}
                disabled={true}
              />
            </div>
            <Odds
              {...match}
              scoreA={match?.scores?.A}
              scoreB={match?.scores?.B}
            />
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
