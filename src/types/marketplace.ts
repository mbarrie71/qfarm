export interface Farmer {
  id: string
  name: string
  location: string
  phone?: string
  bio?: string
  profileImageUrl?: string
}

export interface Crop {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  unit: string
  imageUrl?: string
  category: string
  farmerId: string
  farmer: Farmer
  createdAt: string
  updatedAt: string
}

export interface CropFilter {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  sortBy?: 'price' | 'date'
  sortOrder?: 'asc' | 'desc'
  limit?: number
}

export interface CartItem extends Crop {
  quantity: number
}

export interface Order {
  id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  cropId: string
  quantity: number
  pricePerUnit: number
  crop: Crop
}
