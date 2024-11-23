import { create } from 'zustand'
import { Crop, CropFilter } from '../types/marketplace'
import { marketplaceService } from '../services/marketplace'

interface MarketplaceState {
  crops: Crop[]
  loading: boolean
  error: string | null
  filter: CropFilter
  setFilter: (filter: Partial<CropFilter>) => void
  fetchCrops: () => Promise<void>
  categories: string[]
  fetchCategories: () => Promise<void>
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  crops: [],
  loading: false,
  error: null,
  filter: {},
  categories: [],

  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter }
    }))
    get().fetchCrops()
  },

  fetchCrops: async () => {
    set({ loading: true, error: null })
    try {
      const crops = await marketplaceService.getCrops(get().filter)
      set({ crops, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch crops',
        loading: false
      })
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await marketplaceService.getCategories()
      set({ categories })
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
}))
