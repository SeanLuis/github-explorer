import { defineStore } from 'pinia'
import { GitHubService } from '~/services/github'
import type { 
  IAppState, 
  IGitHubRepository, 
  ISearchParams, 
  IAdvancedFilters 
} from '~/types'

export const useGithubStore = defineStore('github', {
  state: (): IAppState => ({
    repositories: [],
    currentRepository: null,
    loading: false,
    error: null,
    searchParams: {
      q: 'stars:>1000',
      sort: 'stars',
      order: 'desc',
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

    async searchRepositories(params?: { query?: string; language?: string }) {
      this.loading = true
      try {
        // Reset pagination cuando cambian los filtros
        if (params) {
          this.currentPage = 1
          this.repositories = []
        }

        const response = await GitHubService.searchRepositories({
          query: params?.query,
          language: params?.language,
          page: this.currentPage,
          per_page: this.searchParams.per_page
        })
        
        this.repositories = this.currentPage === 1 
          ? response.items 
          : [...this.repositories, ...response.items]
        
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
      this.searchParams.page = this.currentPage
      await this.searchRepositories()
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
