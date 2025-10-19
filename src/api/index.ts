import type { Client } from './client'
import { DefaultApiClient } from './defaultClient'
import { MockApiClient } from './mockClient'

export type { Client } from './client'

export type ClientType = 'default' | 'mock'

export interface ApiConfig {
  clientType: ClientType
  baseUrl?: string
  timeout?: number
}

const defaultConfig: ApiConfig = {
  clientType: import.meta.env.MODE === 'development' ? 'mock' : 'default',
  baseUrl: import.meta.env.VITE_APP_API_URL,
}

export class ApiClientFactory {
  private static instance: Client | null = null
  private static config: ApiConfig = defaultConfig

  static configure(config: Partial<ApiConfig> = {}): void {
    this.config = { ...defaultConfig, ...config }
    this.instance = null
  }

  static getClient(): Client {
    if (!this.instance) {
      this.instance = this.createClient()
    }
    return this.instance
  }

  static reset(): void {
    this.instance = null
  }

  private static createClient(): Client {
    switch (this.config.clientType) {
      case 'mock':
        return new MockApiClient()
      case 'default':
      default:
        return new DefaultApiClient(this.config.baseUrl || '')
    }
  }
}

export const getApiClient = (): Client => ApiClientFactory.getClient()

export const configureApiForEnvironment = (): void => {
  ApiClientFactory.configure()
}
