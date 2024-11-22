export interface Crop {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  unit: string
  imageUrl: string
  category: string
  farmerId: string
  farmer: {
    id: string
    name: string
    location: string
  }
  createdAt: string
  updatedAt: string
}

export interface CropCategory {
  id: string
  name: string
  description: string
  imageUrl: string
}

export interface CropFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  sortBy?: 'price' | 'date' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface CartItem extends Crop {
  quantity: number
}
