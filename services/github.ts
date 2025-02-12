import type { 
  IGitHubSearchResponse, 
  ISearchParams, 
  IAdvancedFilters 
} from '~/types'

export class GitHubService {
  private static buildSearchQuery(filters?: IAdvancedFilters): string {
    let query = 'is:public'
    
    if (filters?.language) {
      query += ` language:${filters.language}`
    }
    if (filters?.minStars) {
      query += ` stars:>=${filters.minStars}`
    }
    if (filters?.hasTopics?.length) {
      filters.hasTopics.forEach(topic => {
        query += ` topic:${topic}`
      })
    }
    return query
  }

  static async searchRepositories(
    params: ISearchParams, 
    filters?: IAdvancedFilters
  ): Promise<IGitHubSearchResponse> {
    const query = this.buildSearchQuery(filters)
    const searchParams = new URLSearchParams({
      q: query,
      sort: params.sort || 'stars',
      order: params.order || 'desc',
      per_page: String(params.per_page || 30),
      page: String(params.page || 1)
    })

    return await $fetch<IGitHubSearchResponse>(
      `https://api.github.com/search/repositories?${searchParams}`
    )
  }
}
