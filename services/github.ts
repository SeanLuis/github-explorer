const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP',
  'C++', 'C#', 'Swift', 'Kotlin', 'Rust', 'Vue', 'React'
]

const TOPICS = [
  'web', 'api', 'cli', 'framework', 'library', 'tools',
  'database', 'machine-learning', 'devops', 'security'
]

import type { IGitHubSearchResponse, IGitHubRepository } from '~/types'

export class GitHubService {
  private static buildSearchQuery(params: { 
    query?: string, 
    language?: string, 
    topics?: string[],
    minStars?: number
  }): string {
    const conditions = ['stars:>100'] // Siempre comenzar con una condición válida
    
    if (params.query?.trim()) {
      conditions.push(params.query.trim())
    }
    
    if (params.language) {
      conditions.push(`language:${params.language}`)
    }
    
    params.topics?.forEach(topic => {
      conditions.push(`topic:${topic}`)
    })

    if (params.minStars && params.minStars > 100) {
      conditions[0] = `stars:>=${params.minStars}`
    }

    return conditions.join(' ')
  }

  static async searchRepositories(params: {
    query?: string
    language?: string
    topics?: string[]
    minStars?: number
    sort?: 'stars' | 'forks' | 'updated'
    order?: 'desc' | 'asc'
    page?: number
    per_page?: number
  }): Promise<IGitHubSearchResponse> {
    try {
      const query = this.buildSearchQuery(params)
      console.log('Search query:', query) // Para debug

      const searchParams = new URLSearchParams({
        q: query,
        sort: params.sort || 'stars',
        order: params.order || 'desc',
        per_page: String(params.per_page || 30),
        page: String(params.page || 1)
      })

      const response = await $fetch<IGitHubSearchResponse>(
        `https://api.github.com/search/repositories?${searchParams}`,
        { 
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )

      return response
    } catch (error) {
      console.error('GitHub API Error:', error)
      throw new Error('Failed to fetch repositories')
    }
  }

  static async getTrendingRepositories(): Promise<IGitHubRepository[]> {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const response = await this.searchRepositories({
      query: `created:>${oneWeekAgo.toISOString().split('T')[0]}`,
      minStars: 100,
      sort: 'stars',
      order: 'desc',
      per_page: 30
    })

    return response.items
  }

  static getLanguages(): string[] {
    return LANGUAGES
  }

  static getTopics(): string[] {
    return TOPICS
  }
}
