import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface OnboardingStep {
  title: string
  description: string
}

const steps: OnboardingStep[] = [
  {
    title: 'Basic Information',
    description: 'Tell us about yourself and your farm',
  },
  {
    title: 'Location Details',
    description: 'Help buyers find your products',
  },
  {
    title: 'Farm Specialization',
    description: 'What types of crops do you grow?',
  },
]

export default function FarmerOnboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: '',
    phone: '',
    bio: '',
    // Step 2: Location Details
    location: '',
    district: '',
    nearestTown: '',
    // Step 3: Farm Specialization
    farmSize: '',
    mainCrops: '',
    certifications: '',
    farmingExperience: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error: upsertError } = await supabase
        .from('farmers')
        .upsert({
          user_id: user?.id,
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          district: formData.district,
          nearest_town: formData.nearestTown,
          farm_size: formData.farmSize,
          main_crops: formData.mainCrops,
          certifications: formData.certifications,
          farming_experience: formData.farmingExperience,
        })

      if (upsertError) throw upsertError

      navigate('/marketplace')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Progress Steps */}
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {steps.map((step, index) => (
                <li key={step.title} className={index !== steps.length - 1 ? 'flex-1' : ''}>
                  <div className="group flex items-center">
                    <span className="flex items-center">
                      <span
                        className={`
                          ${index < currentStep ? 'bg-primary-600' : index === currentStep ? 'bg-primary-200' : 'bg-gray-200'}
                          h-2 w-2 rounded-full
                        `}
                      />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Form */}
          <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    About You
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Farm Address
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <select
                    name="district"
                    id="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select a district</option>
                    <option value="Bo">Bo</option>
                    <option value="Bombali">Bombali</option>
                    <option value="Bonthe">Bonthe</option>
                    <option value="Kailahun">Kailahun</option>
                    <option value="Kambia">Kambia</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Koinadugu">Koinadugu</option>
                    <option value="Moyamba">Moyamba</option>
                    <option value="Port Loko">Port Loko</option>
                    <option value="Pujehun">Pujehun</option>
                    <option value="Tonkolili">Tonkolili</option>
                    <option value="Western Rural">Western Rural</option>
                    <option value="Western Urban">Western Urban</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nearestTown" className="block text-sm font-medium text-gray-700">
                    Nearest Town
                  </label>
                  <input
                    type="text"
                    name="nearestTown"
                    id="nearestTown"
                    required
                    value={formData.nearestTown}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Farm Specialization */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
                    Farm Size (in acres)
                  </label>
                  <input
                    type="number"
                    name="farmSize"
                    id="farmSize"
                    required
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="mainCrops" className="block text-sm font-medium text-gray-700">
                    Main Crops
                  </label>
                  <input
                    type="text"
                    name="mainCrops"
                    id="mainCrops"
                    required
                    placeholder="e.g., Rice, Cassava, Groundnuts"
                    value={formData.mainCrops}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                    Certifications (if any)
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    id="certifications"
                    placeholder="e.g., Organic, Fair Trade"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="farmingExperience" className="block text-sm font-medium text-gray-700">
                    Years of Farming Experience
                  </label>
                  <input
                    type="number"
                    name="farmingExperience"
                    id="farmingExperience"
                    required
                    value={formData.farmingExperience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Complete Setup
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
