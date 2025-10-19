import { promiseWrapper } from '@/utils/promiseWrapper'
import { mockUsers } from './mocks/users'
import { Client } from './client'

export class MockApiClient implements Client {
  
  async getUsers() {
    return promiseWrapper(mockUsers)
  }
}
