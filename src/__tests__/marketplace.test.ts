import { describe, it, expect, beforeEach, vi } from 'vitest'
import { supabase } from '../lib/supabase'
import { marketplaceService } from '../services/marketplace'

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}))

describe('Marketplace Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories = [
        { category: 'Vegetables' },
        { category: 'Fruits' },
      ]

      const mockSelect = vi.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      })

      ;(supabase.from as any).mockReturnValue({
        select: mockSelect,
      })

      const result = await marketplaceService.getCategories()

      expect(supabase.from).toHaveBeenCalledWith('crops')
      expect(mockSelect).toHaveBeenCalledWith('DISTINCT category')
      expect(result).toEqual(['Vegetables', 'Fruits'])
    })

    it('should handle errors when fetching categories', async () => {
      const mockError = new Error('Database error')

      const mockSelect = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      })

      ;(supabase.from as any).mockReturnValue({
        select: mockSelect,
      })

      await expect(marketplaceService.getCategories()).rejects.toThrow('Database error')
    })
  })

  describe('getCrops', () => {
    it('should fetch crops successfully', async () => {
      const mockCrops = [
        { id: '1', name: 'Tomatoes', category: 'Vegetables', price: 2.99, quantity: 100 },
        { id: '2', name: 'Potatoes', category: 'Vegetables', price: 1.99, quantity: 50 },
      ]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: mockCrops,
          error: null,
        }),
      }

      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await marketplaceService.getCrops({ category: 'Vegetables' })

      expect(supabase.from).toHaveBeenCalledWith('crops')
      expect(result).toEqual(mockCrops)
    })

    it('should handle errors when fetching crops', async () => {
      const mockError = new Error('Database error')

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis()
      }

      // Mock the final promise resolution
      mockChain.select.mockResolvedValue({
        data: null,
        error: mockError
      })

      ;(supabase.from as any).mockReturnValue(mockChain)

      await expect(marketplaceService.getCrops()).rejects.toThrow('Database error')
    })
  })
})
