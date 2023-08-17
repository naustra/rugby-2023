const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const factorMultiplicator = process.argv[2]

if (!factorMultiplicator) {
  console.log(`Usage: node ./${__filename} number`)
  process.exit(1)
}

// Iterate through all matches
const multiplyOddsMatches = async () => {
  const matches = await admin.firestore().collection('matches').get()

  for (const match of matches.docs) {
    const oddsUnibet = match.data().oddsUnibet
    const originalOdds = match.data().odds

    if (oddsUnibet) {
      const oddsUpdated = {
        PA: oddsUnibet.PA * factorMultiplicator,
        PB: oddsUnibet.PB * factorMultiplicator,
        PN: oddsUnibet.PN * factorMultiplicator,
      }

      await admin
        .firestore()
        .collection('matches')
        .doc(match.id)
        .update({ odds: oddsUpdated })

      console.log(
        `Odds for match ${match.id} were at ${JSON.stringify(
          originalOdds,
        )} and have been updated from ${JSON.stringify(
          oddsUnibet,
        )} to ${JSON.stringify(oddsUpdated)}`,
      )
    }
  }
}

multiplyOddsMatches()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
