import { getFunctions } from '@firebase/functions'
import { FunctionsProvider, useFirebaseApp } from 'reactfire'
import CreateGroup from './CreateGroup'
import './groups.scss'
import JoinGroup from './JoinGroup'
import MyGroups from './MyGroups'

const Groups = () => {
  const firebaseApp = useFirebaseApp()
  const functions = getFunctions(firebaseApp, 'europe-west3')

  return (
    <FunctionsProvider sdk={functions}>
      <div className="groups-container">
        <MyGroups />
        <JoinGroup />
        <CreateGroup />
      </div>
    </FunctionsProvider>
  )
}

export default Groups
