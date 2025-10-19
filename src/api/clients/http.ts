export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestOptions {
  method: HttpMethod
  body?: unknown
}

export class HTTPClient {
  protected baseUrl: string
  protected defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = { method: 'GET' }
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.defaultHeaders }
    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`)
      }
      throw new Error('Unknown API error occurred')
    }
  }
}
