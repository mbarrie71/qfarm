# Supabase Setup Guide for QFarm

This guide will help you set up your Supabase project for the QFarm platform.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - Name: QFarm
   - Database Password: (create a secure password)
   - Region: Choose the closest to Sierra Leone (e.g., Europe)
4. Click "Create Project"

## 2. Get Project Credentials

1. In your project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (under "Project Configuration")
   - anon/public key (under "Project API keys")
3. Update these values in your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 3. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to create all tables and security policies

## 4. Configure Google OAuth


   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the app information:
     - App name: QFarm
     - User support email: your-email@example.com
     - Developer contact information: your-email@example.com
5. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     - http://localhost:5173/auth/callback (for development)
6. Copy the Client ID and Client Secret
7. In Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Paste your Client ID and Client Secret

## 5. Enable Storage for Profile Images

1. In Supabase dashboard, go to Storage
2. Create a new bucket:
   - Name: profiles
   - Public bucket: Yes
   - File size limit: 10MB
3. Set up storage policies:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public profiles are viewable by everyone" 
   ON storage.objects FOR SELECT 
   USING (bucket_id = 'profiles');

   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload profile images" 
   ON storage.objects FOR INSERT 
   WITH CHECK (
     bucket_id = 'profiles' 
     AND auth.role() = 'authenticated'
   );

   -- Allow users to update their own files
   CREATE POLICY "Users can update their own profile images" 
   ON storage.objects FOR UPDATE 
   USING (
     bucket_id = 'profiles' 
     AND auth.uid() = owner
   );
   ```

## 6. Add Sample Data (Optional)

1. Go to the SQL Editor
2. Copy the contents of `supabase/seed.sql`
3. Paste it into the SQL Editor
4. Click "Run" to populate the database with sample data

## 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Try to:
   - Register a new account
   - Sign in with Google
   - Upload a profile image
   - Create a farmer profile

## Troubleshooting

### Common Issues

1. **Authentication not working:**
   - Check if your environment variables are correct
   - Verify Google OAuth credentials
   - Check browser console for errors

2. **Storage uploads failing:**
   - Verify storage policies are in place
   - Check file size limits
   - Ensure user is authenticated

3. **Database queries failing:**
   - Check RLS policies
   - Verify table schemas
   - Look for type mismatches

### Getting Help

- Supabase Documentation: https://supabase.com/docs
- Discord Community: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

## Security Notes

1. Never commit your `.env` file
2. Keep your database password secure
3. Regularly review RLS policies
4. Monitor storage usage and set appropriate limits
5. Implement rate limiting for API calls

## Next Steps

After setup is complete:
1. Implement error tracking
2. Set up monitoring
3. Configure backups
4. Plan for scaling
5. Document API endpoints
