const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { EU_WEST_3 } = require('./constants')

const db = admin.firestore()

const facteurMultiplicateurPhase = {
  0: 1,
  4: 2,
  2: 4,
  3: 6,
  1: 8,
}

const round = (value, decimals) =>
  Number(`${Math.round(`${value}e${decimals}`)}${`e-${decimals}`}`)

const min = (a, b) => (a < b ? a : b)

exports.updateScore = functions
  .region(EU_WEST_3)
  .firestore.document('matches/{matchId}')
  .onUpdate((change) => {
    // Get final scores
    // odds: {PA, PN, PB}
    // scores: {A, B}
    const { odds, scores, phase } = change.after.data()
    if (
      scores === undefined ||
      scores.A === undefined ||
      scores.B === undefined
    ) {
      console.log('No scores defined (sorry not sorry)')
      return null
    }

    const realScoreTeamA = scores.A
    const realScoreTeamB = scores.B
    const realResult = findResult(realScoreTeamA, realScoreTeamB)

    const oddScore = odds[`P${realResult}`]

    // Get bets
    const bets = db.collection('bets')
    return bets
      .where('matchId', '==', change.after.ref.id)
      .get()
      .then((datas) => {
        const promises = []

        datas.forEach((doc) => {
          // Get a bet
          const bet = doc.data()
          const { betTeamA, betTeamB, uid: userId } = bet
          const betId = doc.id
          const oldBetScore = bet.pointsWon

          const betResult = findResult(betTeamA, betTeamB)

          // For group match GoodResult = GoodWinner, bet is lost only based on result
          const hasGoodResult = betResult === realResult

          if (!phase || phase === '0') {
            console.log('Match de phase de poule')
          } else {
            console.log('Phase finale ', phase)
          }

          if (!hasGoodResult) {
            console.log(
              "YOU LOSE SON, you didn't find the score neither the match issue",
            )
            promises.push(updateUserScore(userId, oldBetScore))
            promises.push(updatePointsWon(betId))
          } else {
            // If the user found the result, he win points
            const oddBet = odds[`P${betResult}`]

            const nbButsEcart =
              Math.abs(realScoreTeamA - betTeamA) +
              Math.abs(realScoreTeamB - betTeamB)

            const facteurMultiplicateur = facteurMultiplicateurPhase(phase)

            const points = (oddBet - nbButsEcart) * facteurMultiplicateur

            promises.push(updateUserScore(userId, oldBetScore, points))
            promises.push(updatePointsWon(betId, points))
          }
        })

        return Promise.all(promises)
      })
  })

const updateUserScore = (userId, oldBetScore = 0, points = 0) => {
  console.log(`Updating user score for ${userId}`)
  const user = db.collection('opponents').doc(userId)

  return db
    .runTransaction((t) =>
      t.get(user).then((snapshot) => {
        const oldScore = snapshot.data().score || 0

        const newScore = round(oldScore - oldBetScore + points, 2)
        console.log(
          `User score update ${userId} (${oldScore} - ${oldBetScore} + ${points} = ${newScore})`,
        )
        return t.update(user, { score: newScore })
      }),
    )
    .then(() => console.log(`User score updated for ${userId}`))
    .catch((err) => console.error(`User ${userId} score update failure:`, err))
}

const updatePointsWon = (id, points = 0) => {
  console.log(`Updating points won for bet ${id}`)
  const bets = db.collection('bets').doc(id)

  return db
    .runTransaction((t) =>
      t.get(bets).then((betSnap) =>
        t.update(betSnap.ref, {
          pointsWon: points,
        }),
      ),
    )
    .then(() =>
      console.log(
        `Bet ${id} update with ${points} points. Proxi ${proxiLevel}`,
      ),
    )
    .catch((err) => {
      console.error(`Bet ${id} update failure:`, err)
    })
}

const findResult = (score1, score2) => {
  if (score1 > score2) return 'A'
  if (score1 === score2) return 'N'
  return 'B'
}
