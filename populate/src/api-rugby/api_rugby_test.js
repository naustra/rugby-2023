/*
 * Check if the sum of points won equals to the points people have in ranking
 */
const axios = require('axios')
require('dotenv').config({ path: '../.env' })
const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

//23:
// id:54
// name:"European Rugby Champions Cup"
// type:"Cup"
// logo:"https://media-2.api-sports.io/rugby/leagues/54.png"
// const db = admin.firestore()

const headers = {
  'X-RapidAPI-Key': process.env.API_RUGBY_KEY,
  'X-RapidAPI-Host': 'api-rugby.p.rapidapi.com',
}

const getLeagues = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/leagues',
    headers,
  }
  const response = await axios.request(options)
  console.log(response.data)
}

const getGames = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/games',
    params: {
      league: '69',
      season: '2023',
    },
    headers,
  }
  const response = await axios.request(options)
  // save in json file
  const fs = require('fs')
  fs.writeFileSync(
    'games.json',
    JSON.stringify(
      response.data.response.map((game) => ({
        id: game.id,
        date: game.date,
      })),
    ),
  )

  console.table(response.data.response)
}

getGames().then(() => process.exit(0))

// const displayBets = async () => {
//   const querySnapshot = await db.collection('bets').get()

//   const table = await Promise.all(
//     querySnapshot.docs.map(async (doc) => {
//       const { uid, matchId, betTeamA, betTeamB, pointsWon } = doc.data()

//       const { teamA, teamB, scores } = (
//         await db.collection('matches').doc(matchId).get()
//       ).data()
//       const { name: nameTeamA } = (
//         await db.collection('teams').doc(teamA).get()
//       ).data()
//       const { name: nameTeamB } = (
//         await db.collection('teams').doc(teamB).get()
//       ).data()
//       const { displayName: userName } = (
//         await db.collection('opponents').doc(uid).get()
//       ).data()

//       const score = betTeamA + ' - ' + betTeamB
//       const scoreReel = scores ? scores.A + ' - ' + scores.B : 'not played'

//       return {
//         userName,
//         nameTeamA,
//         score,
//         nameTeamB,
//         scoreReel,
//         pointsWon,
//       }
//     }),
//   )

//   console.table(table)
// }

// displayBets().then(() => process.exit(0))
