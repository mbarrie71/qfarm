import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface FarmerProfile {
  id: string
  name: string
  location: string
  phone: string
  bio: string
  profile_image_url: string
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    bio: '',
    profile_image_url: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
        setFormData({
          name: data.name,
          location: data.location,
          phone: data.phone || '',
          bio: data.bio || '',
          profile_image_url: data.profile_image_url || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const updates = {
        ...formData,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      }

      let { error } = await supabase
        .from('farmers')
        .upsert(updates, { onConflict: 'user_id' })

      if (error) throw error

      await fetchProfile()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${user?.id}/${Math.random()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setFormData(prev => ({
        ...prev,
        profile_image_url: publicUrl
      }))
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <header>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Profile</h1>
        </header>
        <main>
          <div className="mt-10 divide-y divide-gray-200">
            <div className="space-y-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
              <p className="max-w-2xl text-sm text-gray-500">
                Update your farmer profile information and marketplace presence.
              </p>
            </div>

            <form className="mt-6 space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div className="space-y-8 divide-y divide-gray-200">
                <div className="pt-8">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        Profile photo
                      </label>
                      <div className="mt-1 flex items-center">
                        <img
                          src={formData.profile_image_url || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="profile-image"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="profile-image"
                                name="profile-image"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
