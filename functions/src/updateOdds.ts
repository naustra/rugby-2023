import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { EU_WEST_3 } from './constants'
import axios from 'axios'

const apiKeyRugby =
  process.env.API_KEY_RUGBY ?? functions.config().api.rugby_key

if (!apiKeyRugby) {
  throw new Error('No api key is found')
}

const COEFF_MULTIPLIER = 110

const db = admin.firestore()

const headers = {
  'x-rapidapi-key': apiKeyRugby,
  'x-rapidapi-host': 'api-rugby.p.rapidapi.com',
}

const getOddsGames = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/odds',
    params: {
      league: '69',
      season: '2023',
      bookmaker: '6',
      bet: '1',
    },
    headers,
  }
  const response = await axios.request(options)
  return response.data.response
}

export const updateOdds = functions
  .region(EU_WEST_3)
  .runWith({ maxInstances: 1 })
  .pubsub.schedule('0 1 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    const oddsGames = await getOddsGames()

    await Promise.all(
      oddsGames.map(async (matchData: any) => {
        const matchSnap = await db
          .collection('matches')
          .where('idApiRugby', '==', matchData.game.id)
          .get()

        if (matchSnap.size === 0) return

        const match = matchSnap.docs[0].data()

        if (match.finished) return

        const bets = matchData.bookmakers[0].bets[0].values

        // Update game Score and status
        await db
          .collection('matches')
          .doc(matchSnap.docs[0].id)
          .update({
            oddsUnibet: {
              PA: bets[0].value,
              PN: bets[1].value,
              PB: bets[2].value,
            },
            odds: {
              PA: bets[0].value * COEFF_MULTIPLIER,
              PN: bets[1].value * COEFF_MULTIPLIER,
              PB: bets[2].value * COEFF_MULTIPLIER,
            },
          })
      }),
    )
  })
