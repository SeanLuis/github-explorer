import { defineStore } from 'pinia'
import { CollectionService } from '~/services/collections'
import type { ICollection } from '~/services/collections'

interface CollectionsState {
  collections: ICollection[];
  loading: boolean;
  error: string | null;
  gradients: Record<string, string>;
  featuredCollectionIds: string[];
}

export const useCollectionsStore = defineStore('collections', {
  state: (): CollectionsState => ({
    collections: [],
    loading: false,
    error: null,
    gradients: {
      'ai-frameworks': 'from-purple-500/90 to-pink-500/90',
      'web-frameworks': 'from-blue-500/90 to-cyan-500/90',
      'developer-tools': 'from-cyan-500/90 to-blue-500/90',
      'data-science': 'from-yellow-500/90 to-orange-500/90',
      'devops-tools': 'from-orange-500/90 to-red-500/90',
      'mobile-frameworks': 'from-indigo-500/90 to-purple-500/90'
    },
    featuredCollectionIds: [
      'ai-frameworks',
      'web-frameworks',
      'developer-tools',
      'data-science',
      'devops-tools',
      'mobile-frameworks'
    ]
  }),

  getters: {
    featuredCollections: (state) => 
      state.collections.filter(c => state.featuredCollectionIds.includes(c.id)),
    
    otherCollections: (state) => 
      state.collections.filter(c => !state.featuredCollectionIds.includes(c.id)),
    
    getGradient: (state) => (id: string) => 
      state.gradients[id] || 'from-gray-500/90 to-slate-500/90'
  },

  actions: {
    async fetchCollections() {
      if (this.collections.length > 0) return
      this.loading = true
      try {
        this.collections = await CollectionService.generateCollections()
        this.error = null
      } catch (error) {
        this.error = 'Failed to load collections'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    getCollectionById(id: string): ICollection | undefined {
      return this.collections.find(c => c.id === id)
    }
  },

  persist: true
})
