-- Storage setup for QFarm

-- Create profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('profiles', 'profiles', true, false, 10485760, array['image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profiles bucket
CREATE POLICY "Public profiles are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles'
  AND auth.uid() = owner
);

-- Create crops bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('crops', 'crops', true, false, 10485760, array['image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for crops bucket
CREATE POLICY "Public crop images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'crops');

CREATE POLICY "Farmers can upload crop images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'crops'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Farmers can update their own crop images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'crops'
  AND auth.uid() = owner
);
