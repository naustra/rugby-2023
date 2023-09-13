import {
  collection,
  increment,
  serverTimestamp,
  doc,
  setDoc,
} from '@firebase/firestore'
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire'
import { useBatchedMultiGet } from './utils'

export const useBets = (matchId, members) => {
  return useBatchedMultiGet(members, 'bets', [
    { field: 'matchId', operator: '==', value: matchId },
  ])
}

export const useBet = (matchId) => {
  const {
    data: { uid },
  } = useUser()

  const firestore = useFirestore()
  const betsCollection = collection(firestore, 'bets')
  const documentRef = doc(betsCollection, `${matchId}_${uid}`)

  const setBet = (bet) => {
    setDoc(
      documentRef,
      {
        ...bet,
        matchId,
        uid,
        updatedAt: serverTimestamp(),
        version: increment(1),
      },
      { merge: true },
    )
  }

  return [useFirestoreDocData(documentRef).data, setBet]
}
