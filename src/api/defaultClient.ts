import { User } from '@/types'
import { HTTPClient } from './clients'
import { Client } from './client'

export class DefaultApiClient implements Client {

  private client: HTTPClient;

  constructor(baseUrl: string) {
    this.client = new HTTPClient(baseUrl)
  }
  
  async getUsers(): Promise<User[]> {
    return this.client.request<User[]>('/users')
  }
}
