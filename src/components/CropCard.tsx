import { Link } from 'react-router-dom'
import { Crop } from '../types/marketplace'

interface CropCardProps {
  crop: Crop
}

export default function CropCard({ crop }: CropCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={crop.imageUrl}
          alt={crop.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/marketplace/${crop.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {crop.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{crop.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${crop.price.toFixed(2)} / {crop.unit}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {crop.quantity} {crop.unit} available
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Farmer: {crop.farmer.name} • {crop.farmer.location}
        </p>
      </div>
    </div>
  )
}
