import { supabase } from '../lib/supabase'
import { Crop, CropFilter } from '../types/marketplace'

export const marketplaceService = {
  async getCrops(filter?: CropFilter): Promise<Crop[]> {
    let query = supabase
      .from('crops')
      .select(`
        *,
        farmer:farmers(id, name, location)
      `)

    if (filter?.category) {
      query = query.eq('category', filter.category)
    }

    if (filter?.minPrice) {
      query = query.gte('price', filter.minPrice)
    }

    if (filter?.maxPrice) {
      query = query.lte('price', filter.maxPrice)
    }

    if (filter?.location) {
      query = query.eq('farmer.location', filter.location)
    }

    if (filter?.sortBy) {
      const order = filter.sortOrder || 'asc'
      query = query.order(filter.sortBy, { ascending: order === 'asc' })
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data as Crop[]
  },

  async getCropById(id: string): Promise<Crop> {
    const { data, error } = await supabase
      .from('crops')
      .select(`
        *,
        farmer:farmers(id, name, location)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data as Crop
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('crops')
      .select('category')
      .returns<{ category: string }[]>()

    if (error) {
      throw error
    }

    // Get unique categories and filter out any null values
    return [...new Set(data.map(item => item.category).filter(Boolean))]
  },

  async createCrop(crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Crop> {
    const { data, error } = await supabase
      .from('crops')
      .insert([crop])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Crop
  },

  async updateCrop(id: string, crop: Partial<Crop>): Promise<Crop> {
    const { data, error } = await supabase
      .from('crops')
      .update(crop)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Crop
  },

  async deleteCrop(id: string): Promise<void> {
    const { error } = await supabase
      .from('crops')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }
}
