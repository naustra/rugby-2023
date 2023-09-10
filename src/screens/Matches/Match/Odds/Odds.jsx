import isNumber from 'lodash/isNumber'

const Odds = ({ past, betTeamA, betTeamB, scores, odds }) => {
  const oddToFocus = past
    ? scores?.A > scores?.B
      ? 'PA'
      : scores?.A < scores?.B
      ? 'PB'
      : 'PN'
    : !isNumber(betTeamA) || !isNumber(betTeamB)
    ? null
    : betTeamA > betTeamB
    ? 'PA'
    : betTeamA < betTeamB
    ? 'PB'
    : 'PN'

  return (
    <div className="flex justify-between">
      <p
        className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
          oddToFocus === 'PA' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PA}
      </p>
      <p
        className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
          oddToFocus === 'PN' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PN}
      </p>
      <p
        className={`rounded border px-1.5 py-1 text-xs bg-gray-100 ${
          oddToFocus === 'PB' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PB}
      </p>
    </div>
  )
}

export default Odds
