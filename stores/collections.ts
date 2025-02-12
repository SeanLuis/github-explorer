import { defineStore } from 'pinia'
import { CollectionService } from '~/services/collections'
import type { ICollection } from '~/services/collections'

interface CollectionsState {
  collections: ICollection[];
  loading: boolean;
  error: string | null;
}

export const useCollectionsStore = defineStore('collections', {
  state: (): CollectionsState => ({
    collections: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCollections() {
      // Si ya tenemos colecciones, no las volvemos a cargar
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
