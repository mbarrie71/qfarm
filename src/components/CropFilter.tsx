import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CropFilter } from '../types/marketplace'

interface CropFilterProps {
  categories: string[]
  filter: CropFilter
  onFilterChange: (filter: CropFilter) => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CropFilterComponent({
  categories,
  filter,
  onFilterChange,
}: CropFilterProps) {
  const sortOptions = [
    { name: 'Newest', value: { sortBy: 'date', sortOrder: 'desc' } },
    { name: 'Price: Low to High', value: { sortBy: 'price', sortOrder: 'asc' } },
    { name: 'Price: High to Low', value: { sortBy: 'price', sortOrder: 'desc' } },
  ]

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              onFilterChange({
                                ...filter,
                                ...option.value,
                              })
                            }
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm w-full text-left',
                              filter.sortBy === option.value.sortBy &&
                                filter.sortOrder === option.value.sortOrder
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500'
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="ml-4 space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    onFilterChange({
                      ...filter,
                      category: filter.category === category ? undefined : category,
                    })
                  }
                  className={classNames(
                    'inline-flex items-center rounded-full px-3 py-1 text-sm',
                    filter.category === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="minPrice" className="text-sm text-gray-600">
                Min Price:
              </label>
              <input
                type="number"
                id="minPrice"
                value={filter.minPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Min"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="maxPrice" className="text-sm text-gray-600">
                Max Price:
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filter.maxPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
