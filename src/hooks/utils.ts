import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'
import { WhereFilterOp } from '@firebase/firestore-types'
import { useEffect, useMemo, useState } from 'react'
import {
  documentId,
  collection,
  query,
  where,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from '@firebase/firestore'
import { useFirestore } from 'reactfire'
import { Dictionary } from 'lodash'

// * Used to get more than 30 documents at a time with "in" operator
export const useBatchedMultiGet = (
  ids: string[],
  collectionName: string,
  conditions: Array<{ field: string; operator: WhereFilterOp; value: any }>,
) => {
  const idChunks = useMemo(() => chunk(ids, 10), [ids])
  const [entities, setEntities] = useState<
    Dictionary<QueryDocumentSnapshot<DocumentData>>
  >({})
  const firestore = useFirestore()

  useEffect(() => {
    if (isEmpty(ids)) return

    const collectionRef = collection(firestore, collectionName)

    const unsubscribes = idChunks.map((idChunk) => {
      let queryRef = query(collectionRef, where(documentId(), 'in', idChunk))

      // Apply additional conditions
      conditions?.forEach(({ field, operator, value }) => {
        queryRef = query(queryRef, where(field, operator, value))
      })

      return onSnapshot(queryRef, (snap) => {
        const addedEntities = keyBy(snap.docs, 'id')
        setEntities((currentEntities) => ({
          ...currentEntities,
          ...addedEntities,
        }))
      })
    })

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
  }, [firestore, idChunks, ids, collectionName, conditions])

  return useMemo(
    () => Object.values(entities).filter((u) => ids?.includes(u.id)),
    [entities, ids],
  )
}
