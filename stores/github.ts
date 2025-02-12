import { defineStore } from 'pinia'
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
      q: 'is:public',
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      page: 1
    },
    totalResults: 0,
    currentPage: 1
  }),

  actions: {
    async searchRepositories(filters?: IAdvancedFilters) {
      this.loading = true
      try {
        // API call will go here
        this.loading = false
      } catch (error) {
        this.error = error as string
        this.loading = false
      }
    },

    setCurrentRepository(repo: IGitHubRepository) {
      this.currentRepository = repo
    },

    updateSearchParams(params: Partial<ISearchParams>) {
      this.searchParams = { ...this.searchParams, ...params }
    }
  },

  persist: true
})
