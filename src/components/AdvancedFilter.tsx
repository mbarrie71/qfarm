import { useState } from 'react'
import { useMarketplaceStore } from '../stores/marketplace'

interface FilterOption {
  label: string
  value: string
}

const sortOptions: FilterOption[] = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' }
]

export const AdvancedFilter = () => {
  const { categories, filter, setFilter } = useMarketplaceStore()
  const [priceRange, setPriceRange] = useState({
    min: filter.minPrice || '',
    max: filter.maxPrice || ''
  })

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_')
    setFilter({ sortBy: field as 'price' | 'date', sortOrder: order as 'asc' | 'desc' })
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? '' : Number(value)
    setPriceRange(prev => ({ ...prev, [type]: value }))
    
    if (value === '' || !isNaN(numValue)) {
      setFilter({
        [type === 'min' ? 'minPrice' : 'maxPrice']: numValue === '' ? undefined : numValue
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sort</h3>
        <select
          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={`${filter.sortBy}_${filter.sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <div className="mt-2 space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={filter.category === category}
                onChange={() =>
                  setFilter({ category: filter.category === category ? undefined : category })
                }
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-3 text-sm text-gray-600"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              min={0}
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              min={0}
            />
          </div>
        </div>
      </div>

      <button
        className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => {
          setPriceRange({ min: '', max: '' })
          setFilter({
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            sortBy: 'date',
            sortOrder: 'desc'
          })
        }}
      >
        Clear Filters
      </button>
    </div>
  )
}
