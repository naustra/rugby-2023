import * as admin from 'firebase-admin'
admin.initializeApp()

import { updateScore } from './updateScore'
import * as users from './users'
import * as groups from './groups'
import * as notifications from './notifications'
import * as chore from './chore'

export { updateScore, users, groups, notifications, chore }
