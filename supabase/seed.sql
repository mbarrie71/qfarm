-- Sample farmers
INSERT INTO public.farmers (name, location, phone, bio, profile_image_url)
VALUES
    ('John Kamara', 'Freetown', '+232 76 123456', 'Experienced rice and cassava farmer with 15 years of experience.', 'https://example.com/farmer1.jpg'),
    ('Aminata Sesay', 'Bo', '+232 77 234567', 'Specializing in organic vegetable farming and sustainable agriculture.', 'https://example.com/farmer2.jpg'),
    ('Mohammed Bangura', 'Kenema', '+232 78 345678', 'Third-generation farmer focusing on cash crops and modern farming techniques.', 'https://example.com/farmer3.jpg');

-- Sample crops
INSERT INTO public.crops (farmer_id, name, description, price, quantity, unit, image_url, category)
SELECT
    f.id,
    name,
    description,
    price,
    quantity,
    unit,
    image_url,
    category
FROM (
    VALUES
        ('Rice', 'Premium quality local rice', 50.00, 1000, 'kg', 'https://example.com/rice.jpg', 'Grains'),
        ('Cassava', 'Fresh cassava roots', 20.00, 500, 'kg', 'https://example.com/cassava.jpg', 'Root Crops'),
        ('Groundnuts', 'Raw groundnuts', 30.00, 200, 'kg', 'https://example.com/groundnuts.jpg', 'Legumes'),
        ('Sweet Potatoes', 'Orange-fleshed sweet potatoes', 25.00, 300, 'kg', 'https://example.com/sweet-potatoes.jpg', 'Root Crops'),
        ('Palm Oil', 'Pure red palm oil', 100.00, 50, 'L', 'https://example.com/palm-oil.jpg', 'Oil Crops'),
        ('Plantains', 'Fresh green plantains', 15.00, 100, 'bunch', 'https://example.com/plantains.jpg', 'Fruits'),
        ('Cocoa Beans', 'Fermented and dried cocoa beans', 200.00, 100, 'kg', 'https://example.com/cocoa.jpg', 'Cash Crops'),
        ('Coffee Beans', 'Arabica coffee beans', 180.00, 150, 'kg', 'https://example.com/coffee.jpg', 'Cash Crops'),
        ('Tomatoes', 'Fresh local tomatoes', 10.00, 50, 'kg', 'https://example.com/tomatoes.jpg', 'Vegetables'),
        ('Peppers', 'Hot chili peppers', 12.00, 30, 'kg', 'https://example.com/peppers.jpg', 'Vegetables')
    ) AS c(name, description, price, quantity, unit, image_url, category)
CROSS JOIN (
    SELECT id FROM public.farmers LIMIT 1
) AS f;
