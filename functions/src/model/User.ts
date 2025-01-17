import { auth } from 'firebase-admin'

export interface UserProfile {
  uid: string
  avatarUrl?: string
  displayName: string
  winnerTeam: string
  profile?: {
    // Photo de profil
    picture: {
      data: {
        height: number
        width: number
        url: string
      }
    }
  }
}

/**
 * Rôles disponibles pour les utilisateurs
 */
export enum UserRole {
  /** Utilisateur avec des droits d'administration */
  admin = 'admin',
  /** Utilisateur normal */
  user = 'user',
}

export interface UserIdToken extends auth.DecodedIdToken {
  role?: UserRole
}
