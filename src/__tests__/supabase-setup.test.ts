import { describe, it, expect } from 'vitest'
import { supabase } from '../lib/supabase'

describe('Supabase Setup Tests', () => {
  it('should have valid Supabase URL', () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    expect(url).toBeDefined()
    expect(url).toMatch(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)
  })

  it('should have valid Supabase anon key', () => {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    expect(key).toBeDefined()
    expect(key).toMatch(/^eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/)
  })

  it('should be able to connect to Supabase', async () => {
    const { data, error } = await supabase.from('crops').select('count').single()
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })

  it('should have required database tables', async () => {
    const tables = ['crops', 'farmers']
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').single()
      expect(error).toBeNull()
    }
  })

  it('should have Supabase authentication configured', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123!@#',
    })
    
    // We expect an error because these are invalid credentials
    // But the response should indicate auth is properly configured
    expect(error?.message).toBeDefined()
    expect(error?.message).toContain('Email not confirmed')
  })
})
