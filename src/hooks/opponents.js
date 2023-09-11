import { useFirestore, useFirestoreCollection } from 'reactfire'
import { useBatchedMultiGet } from './utils'
import { collection, query } from 'firebase/firestore'

export const useOpponents = (userIds) => {
  return useBatchedMultiGet(userIds, 'opponents')
}

export const useAllOpponents = () => {
  const firestore = useFirestore()
  const opponentsCollection = collection(firestore, 'opponents')
  const opponentsQuery = query(opponentsCollection)

  return useFirestoreCollection(opponentsQuery).data?.docs
}
