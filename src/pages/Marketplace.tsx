import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import CropCard from '../components/CropCard'
import CropFilterComponent from '../components/CropFilter'
import { marketplaceService } from '../services/marketplace'
import { CropFilter } from '../types/marketplace'
import { useAuthStore } from '../store/authStore'
import { useMarketplaceStore } from '../stores/marketplace'
import { CropGrid } from '../components/CropGrid'
import { SearchBar } from '../components/SearchBar'

export default function Marketplace() {
  const [filter, setFilter] = useState<CropFilter>({
    sortBy: 'date',
    sortOrder: 'desc',
    search: '',
  })

  const { user } = useAuthStore()

  const { crops, loading, error, fetchCrops, fetchCategories } = useMarketplaceStore()

  useEffect(() => {
    fetchCrops()
    fetchCategories()
  }, [])

  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    'categories',
    () => marketplaceService.getCategories(),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )

  const { data: cropsData, isLoading: cropsLoading, error: cropsError } = useQuery(
    ['crops', filter],
    () => marketplaceService.getCrops(filter),
    {
      keepPreviousData: true,
    }
  )

  if (error || cropsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || cropsError}</p>
        </div>
      </div>
    )
  }

  if (cropsLoading || categoriesLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>
        <p className="text-gray-600">
          Discover fresh, locally grown produce from farmers in your area
        </p>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CropFilterComponent
            categories={categories}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <div className="lg:col-span-3">
          {cropsData?.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No crops found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <CropGrid crops={cropsData} loading={cropsLoading} />
          )}
        </div>
      </div>
    </div>
  )
}
