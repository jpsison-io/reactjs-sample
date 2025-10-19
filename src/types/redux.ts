import { User } from './user'

export interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

export interface RootStateType {
  users: UserState
}
