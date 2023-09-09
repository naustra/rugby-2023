import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { EU_WEST_3 } from './constants'
import axios from 'axios'

const apiKeyRugby =
  process.env.API_KEY_RUGBY ?? functions.config().api.rugby_key

if (!apiKeyRugby) {
  throw new Error('No api key is found')
}

const db = admin.firestore()

const headers = {
  'x-rapidapi-key': apiKeyRugby,
  'x-rapidapi-host': 'api-rugby.p.rapidapi.com',
}

const getGame = async (id: string) => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/games/',
    params: {
      id: id,
    },
    headers,
  }
  const response = await axios.request(options)
  return response.data.response[0]
}

export const updateResult = functions
  .region(EU_WEST_3)
  .runWith({ maxInstances: 1 })
  .pubsub.schedule('*/5 13-22 * * *')
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    const now = new Date(context.timestamp)
    const inTwoHours = new Date(context.timestamp)
    inTwoHours.setHours(inTwoHours.getHours() + 2)

    const matchesToUpdate = await db
      .collection('matches')
      .where('dateTime', '>=', now)
      .where('dateTime', '<', inTwoHours)
      .get()

    await Promise.all(
      matchesToUpdate.docs.map(async (matchSnap) => {
        const match = matchSnap.data()
        if (match.finished) return

        const gameStatus = await getGame(match.idApiRugby)

        // Update game Score and status
        await db
          .collection('matches')
          .doc(matchSnap.id)
          .update({
            scores: {
              A: gameStatus.scores.home,
              B: gameStatus.scores.away,
            },
            finished: gameStatus.status.long === 'Finished',
          })
      }),
    )
  })
