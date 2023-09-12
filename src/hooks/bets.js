import {
  collection,
  increment,
  serverTimestamp,
  doc,
  setDoc,
  query,
  where,
} from '@firebase/firestore'
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
  useUser,
} from 'reactfire'

export const useBets = (matchId, members) => {
  const firestore = useFirestore()
  const betsCollection = collection(firestore, 'bets')
  const betsQuery = query(
    betsCollection,
    where('matchId', '==', matchId),
    where('uid', 'in', members),
  )

  return useFirestoreCollection(betsQuery).data?.docs
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
