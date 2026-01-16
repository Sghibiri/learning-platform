import type { BaserowListResponse, BaserowRow } from '@/types'

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io'
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || ''

interface BaserowOptions {
  page?: number
  size?: number
  search?: string
  orderBy?: string
  filters?: Record<string, string>
}

class BaserowClient {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = BASEROW_API_URL
    this.token = BASEROW_API_TOKEN
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Baserow API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async listRows<T extends BaserowRow>(
    tableId: string,
    options: BaserowOptions = {}
  ): Promise<BaserowListResponse<T>> {
    const params = new URLSearchParams()

    if (options.page) params.set('page', options.page.toString())
    if (options.size) params.set('size', options.size.toString())
    if (options.search) params.set('search', options.search)
    if (options.orderBy) params.set('order_by', options.orderBy)

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.set(key, value)
      })
    }

    const queryString = params.toString()
    const endpoint = `/api/database/rows/table/${tableId}/${queryString ? `?${queryString}` : ''}`

    return this.request<BaserowListResponse<T>>(endpoint)
  }

  async getRow<T extends BaserowRow>(
    tableId: string,
    rowId: number
  ): Promise<T> {
    return this.request<T>(`/api/database/rows/table/${tableId}/${rowId}/`)
  }

  async createRow<T extends BaserowRow>(
    tableId: string,
    data: Partial<T>
  ): Promise<T> {
    return this.request<T>(`/api/database/rows/table/${tableId}/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRow<T extends BaserowRow>(
    tableId: string,
    rowId: number,
    data: Partial<T>
  ): Promise<T> {
    return this.request<T>(`/api/database/rows/table/${tableId}/${rowId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRow(tableId: string, rowId: number): Promise<void> {
    await this.request(`/api/database/rows/table/${tableId}/${rowId}/`, {
      method: 'DELETE',
    })
  }

  async getAllRows<T extends BaserowRow>(
    tableId: string,
    options: Omit<BaserowOptions, 'page'> = {}
  ): Promise<T[]> {
    const allRows: T[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.listRows<T>(tableId, {
        ...options,
        page,
        size: 200,
      })

      allRows.push(...response.results)
      hasMore = response.next !== null
      page++
    }

    return allRows
  }
}

export const baserow = new BaserowClient()
