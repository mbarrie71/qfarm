import { useState } from 'react'
import { useQuery } from 'react-query'
import CropCard from '../components/CropCard'
import CropFilterComponent from '../components/CropFilter'
import { marketplaceService } from '../services/marketplace'
import { CropFilter } from '../types/marketplace'
import { useAuthStore } from '../store/authStore'

export default function Marketplace() {
  const [filter, setFilter] = useState<CropFilter>({
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const { user } = useAuthStore()

  const { data: crops, isLoading: cropsLoading } = useQuery(
    ['crops', filter],
    () => marketplaceService.getCrops(filter),
    {
      keepPreviousData: true,
    }
  )

  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    'categories',
    () => marketplaceService.getCategories(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  if (cropsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <CropFilterComponent
        categories={categories}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {crops?.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>

        {crops?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No crops found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or check back later for new listings.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
