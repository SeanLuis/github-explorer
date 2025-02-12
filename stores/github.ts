import { defineStore } from 'pinia'
import { GitHubService } from '~/services/github'
import { 
  type IAppState, 
  type IGitHubRepository, 
  type ISearchParams, 
  SortOptions,
  OrderOptions
} from '~/types'

interface SearchRepositoriesParams {
  query?: string
  language?: string
  topics?: string[]
  minStars?: number
  hasTests?: boolean
  isTemplate?: boolean
  page?: number
  per_page?: number
  sort?: SortOptions
  order?: OrderOptions
}

export const useGithubStore = defineStore('github', {
  state: (): IAppState => ({
    repositories: [],
    currentRepository: null,
    loading: false,
    error: null,
    searchParams: {
      q: 'stars:>1000',
      sort: SortOptions.STARS,
      order: OrderOptions.DESC,
      per_page: 30,
      page: 1
    },
    totalResults: 0,
    currentPage: 1,
    hasMorePages: true
  }),

  actions: {
    async loadTrendingRepositories() {
      this.loading = true
      try {
        const repos = await GitHubService.getTrendingRepositories()
        this.repositories = repos
        this.hasMorePages = false
        this.error = null
      } catch (error) {
        this.error = 'Failed to load trending repositories'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async searchRepositories(params: SearchRepositoriesParams) {
      this.loading = true
      try {
        const response = await GitHubService.searchRepositories({
          ...params,
          page: params.page || this.currentPage,
          per_page: params.per_page || this.searchParams.per_page,
          sort: params.sort || SortOptions.STARS,
          order: params.order || OrderOptions.DESC
        })
        
        // Si es una nueva búsqueda (página 1), reemplazar resultados
        if (!params.page || params.page === 1) {
          this.repositories = response.items
        } else {
          // Si es paginación, agregar a los resultados existentes
          this.repositories = [...this.repositories, ...response.items]
        }
        
        this.totalResults = response.total_count
        this.hasMorePages = this.repositories.length < response.total_count
        this.error = null
      } catch (error) {
        this.error = 'Failed to search repositories'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async loadNextPage() {
      if (this.loading || !this.hasMorePages) return
      
      this.currentPage++
      await this.searchRepositories({
        query: this.searchParams.q,
        page: this.currentPage,
        sort: this.searchParams.sort as SortOptions,
        order: this.searchParams.order,
        per_page: this.searchParams.per_page
      })
    },

    setCurrentRepository(repo: IGitHubRepository) {
      this.currentRepository = repo
    },

    updateSearchParams(params: Partial<ISearchParams>) {
      this.searchParams = { ...this.searchParams, ...params }
    },

    async getRepositoryDetails(fullName: string): Promise<IGitHubRepository> {
      this.loading = true
      try {
        const response = await $fetch<IGitHubRepository>(
          `https://api.github.com/repos/${fullName}`,
          { 
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'X-GitHub-Api-Version': '2022-11-28',
              'Authorization': `Bearer ${useRuntimeConfig().public.githubToken}`
            }
          }
        )
        this.currentRepository = response
        return response
      } catch (error) {
        console.error('GitHub API Error:', error)
        throw new Error('Failed to fetch repository details')
      } finally {
        this.loading = false
      }
    }
  },

  persist: true
})
