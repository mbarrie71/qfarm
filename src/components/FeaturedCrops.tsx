import { useEffect, useState } from 'react'
import { Crop } from '../types/marketplace'
import { marketplaceService } from '../services/marketplace'
import { CropCard } from './CropCard'

export const FeaturedCrops = () => {
  const [featuredCrops, setFeaturedCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCrops = async () => {
      try {
        // Get the latest 4 crops
        const crops = await marketplaceService.getCrops({
          sortBy: 'date',
          sortOrder: 'desc',
          limit: 4
        })
        setFeaturedCrops(crops)
      } catch (error) {
        console.error('Error fetching featured crops:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCrops()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!featuredCrops.length) {
    return null
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Crops
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Check out our latest and freshest produce
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} featured />
          ))}
        </div>
      </div>
    </div>
  )
}
