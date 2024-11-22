-- Create tables
CREATE TABLE public.farmers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT,
    bio TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.crops (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.orders (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.order_items (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX farmers_user_id_idx ON public.farmers(user_id);
CREATE INDEX crops_farmer_id_idx ON public.crops(farmer_id);
CREATE INDEX crops_category_idx ON public.crops(category);
CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);

-- Create RLS policies
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Farmers policies
CREATE POLICY "Farmers are viewable by everyone" ON public.farmers
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own farmer profile" ON public.farmers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer profile" ON public.farmers
    FOR UPDATE USING (auth.uid() = user_id);

-- Crops policies
CREATE POLICY "Crops are viewable by everyone" ON public.crops
    FOR SELECT USING (true);

CREATE POLICY "Farmers can insert their own crops" ON public.crops
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.farmers
            WHERE id = farmer_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Farmers can update their own crops" ON public.crops
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.farmers
            WHERE id = farmer_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Farmers can delete their own crops" ON public.crops
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.farmers
            WHERE id = farmer_id AND user_id = auth.uid()
        )
    );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.farmers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.crops
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
