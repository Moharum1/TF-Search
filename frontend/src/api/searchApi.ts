import type { SearchResponse } from '../types/grimoire'

export interface SearchOptions {
  limit?: number
  offset?: number
  minScore?: number
  signal?: AbortSignal
}

export async function searchDocuments(
  item: string,
  options: SearchOptions = {},
): Promise<SearchResponse> {
  const { limit = 10, offset = 0, minScore = 0.01, signal } = options

  const params = new URLSearchParams({
    item,
    limit: String(limit),
    offset: String(offset),
    min_score: String(minScore),
  })

  const response = await fetch(`/api/search?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Search request failed (${response.status} ${response.statusText})`)
  }

  return (await response.json()) as SearchResponse
}
