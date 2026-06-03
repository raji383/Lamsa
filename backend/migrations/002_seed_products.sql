-- Sample products for Lamsa demo / development

INSERT INTO products (
    name, slug, description, details, category_id,
    base_price, sale_price, is_featured, is_best_seller, is_new_arrival, is_published
) VALUES
(
    'Satin Home Dress',
    'satin-home-dress',
    'Fluid satin home dress with delicate draping — effortless luxury for your everyday rituals.',
    '100% premium satin blend. Machine wash cold. Made in Morocco.',
    1, 499.00, NULL, true, true, true, true
),
(
    'Lounge Set Taupe',
    'lounge-set-taupe',
    'Two-piece loungewear in signature taupe — soft, modest, and impeccably finished.',
    'Top and wide-leg pant. Available in S–XL.',
    2, 599.00, 549.00, true, true, false, true
),
(
    'Modest Midi Dress',
    'modest-midi-dress',
    'Elegant midi silhouette with long sleeves — refined modesty for every occasion.',
    'Lined bodice. Concealed side zip.',
    3, 699.00, NULL, false, false, true, true
),
(
    'Luxury Silk Pyjama',
    'luxury-silk-pyjama',
    'Pure comfort in our signature silk-touch pyjama set with gold piping.',
    'Includes top, bottom, and matching scrunchie.',
    4, 449.00, NULL, true, false, true, true
);

-- Images (Unsplash placeholders)
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1200', name, 0, true
FROM products WHERE slug = 'satin-home-dress';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1515347619362-e5fd250ceaa8?auto=format&fit=crop&q=80&w=1200', name, 0, true
FROM products WHERE slug = 'lounge-set-taupe';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=1200', name, 0, true
FROM products WHERE slug = 'modest-midi-dress';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=1200', name, 0, true
FROM products WHERE slug = 'luxury-silk-pyjama';

-- Variants
INSERT INTO product_variants (product_id, size, color, color_hex, stock)
SELECT p.id, v.size, v.color, v.hex, 10
FROM products p
CROSS JOIN (VALUES
    ('S', 'Beige', '#E7D7C9'),
    ('M', 'Beige', '#E7D7C9'),
    ('L', 'Beige', '#E7D7C9'),
    ('M', 'Taupe', '#B8A99A')
) AS v(size, color, hex)
WHERE p.slug IN ('satin-home-dress', 'lounge-set-taupe', 'modest-midi-dress', 'luxury-silk-pyjama');

UPDATE settings SET value = 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=2000' WHERE key = 'hero_image_1';
