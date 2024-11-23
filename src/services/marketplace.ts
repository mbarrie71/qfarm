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

    if (filter?.search) {
      query = query.or(`name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`)
    }

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
      const field = filter.sortBy === 'date' ? 'created_at' : 'price'
      query = query.order(field, { ascending: order === 'asc' })
    }

    if (filter?.limit) {
      query = query.limit(filter.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching crops:', error)
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
      console.error('Error fetching crop:', error)
      throw error
    }

    return data as Crop
  },

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('category')
        .neq('category', null)
        .order('category');

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Database error');
      }

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Database error');
    }
  },

  async getFarmerLocations(): Promise<string[]> {
    const { data, error } = await supabase
      .from('farmers')
      .select('location')
      .not('location', 'is', null)

    if (error) {
      console.error('Error fetching locations:', error)
      throw error
    }

    const locations = [...new Set(data.map(item => item.location))]
    return locations.sort()
  },

  async createCrop(crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Crop> {
    const { data, error } = await supabase
      .from('crops')
      .insert([crop])
      .select()
      .single()

    if (error) {
      console.error('Error creating crop:', error)
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
      console.error('Error updating crop:', error)
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
      console.error('Error deleting crop:', error)
      throw error
    }
  }
}
