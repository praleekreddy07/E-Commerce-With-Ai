-- Demo seed data so the Deal Comparison Engine has something to score
-- immediately after startup. Safe to delete once you're managing data
-- through the admin API.

INSERT IGNORE INTO categories (id, name, description) VALUES
  (1, 'Electronics', 'Phones, laptops, and accessories');

INSERT IGNORE INTO products (id, name, model_identifier, description, price, stock_quantity, image_url, rating_average, review_count, category_id, created_at) VALUES
  (1, 'Noise-Cancelling Wireless Headphones X200', 'X200-BLK', 'Over-ear ANC headphones, 30h battery', 4999.00, 50, NULL, 4.3, 1200, 1, NOW());

INSERT IGNORE INTO categories (id, name, description) VALUES
  (2, 'Audio', 'Headphones, speakers, and listening essentials'),
  (3, 'Photography', 'Cameras and tools for keeping moments'),
  (4, 'Home', 'Thoughtful objects for comfortable spaces'),
  (5, 'Accessories', 'Everyday carry and personal essentials'),
  (6, 'Workspace', 'Considered tools for focused work'),
  (7, 'Kitchen', 'Useful pieces for everyday cooking and coffee'),
  (8, 'Travel', 'Reliable companions for getting out and about'),
  (9, 'Wellness', 'Simple tools for everyday wellbeing');

INSERT IGNORE INTO products (id, name, model_identifier, description, price, stock_quantity, image_url, rating_average, review_count, category_id, created_at)
SELECT p.id, p.name, p.model_identifier, p.description, p.price, p.stock_quantity, p.image_url, p.rating_average, p.review_count, c.id, NOW()
FROM (
  SELECT 2 id, 'QuietForm wireless headphones' name, 'QF-02' model_identifier, 'Adaptive noise cancelling with a 36-hour battery.' description, 4999.00 price, 14 stock_quantity, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85' image_url, 4.8 rating_average, 284 review_count, 'Audio' category_name
  UNION ALL SELECT 3, 'Pebble portable speaker', 'PB-01', 'A water-resistant everyday speaker with a warm, balanced profile.', 3290.00, 22, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85', 4.7, 192, 'Audio'
  UNION ALL SELECT 4, 'Pocket 35 film camera', 'P35-01', 'A pocket-sized point-and-shoot for everyday moments.', 6790.00, 8, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85', 4.6, 86, 'Photography'
  UNION ALL SELECT 5, 'Morrow sculptural table lamp', 'MR-L1', 'Warm, considered light for late reading and early mornings.', 4590.00, 11, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85', 4.9, 143, 'Home'
  UNION ALL SELECT 6, 'Field Notes everyday watch', 'FN-36', 'A clean dial and comfortable recycled strap for daily wear.', 5890.00, 17, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85', 4.5, 217, 'Accessories'
  UNION ALL SELECT 7, 'Curve low lounge chair', 'CV-LC', 'Sculptural lines and generous comfort for slow Sundays.', 12490.00, 5, 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=85', 4.8, 62, 'Home'
  UNION ALL SELECT 8, 'Daylight wireless earbuds', 'DW-01', 'Easy listening, clear calls, and a pocket-sized charging case.', 2790.00, 26, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85', 4.6, 318, 'Audio'
  UNION ALL SELECT 9, 'Sunday record player', 'SR-01', 'A simple belt-drive turntable for bringing old favorites back into rotation.', 8490.00, 9, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=1000&q=85', 4.7, 104, 'Audio'
  UNION ALL SELECT 10, 'SoftType mechanical keyboard', 'ST-01', 'Tactile, quiet switches and a compact layout for a calmer desk.', 6290.00, 13, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85', 4.8, 173, 'Workspace'
  UNION ALL SELECT 11, 'Arc wireless mouse', 'AW-01', 'An ergonomic wireless mouse with a precise sensor and long battery life.', 2190.00, 31, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=85', 4.5, 242, 'Workspace'
  UNION ALL SELECT 12, 'Everyday linen notebook set', 'ELN-02', 'Two lay-flat notebooks with smooth recycled paper.', 890.00, 40, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85', 4.9, 156, 'Workspace'
  UNION ALL SELECT 13, 'Linework adjustable desk light', 'LAD-01', 'Focused warm light with an adjustable arm and small footprint.', 3890.00, 12, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85', 4.6, 93, 'Workspace'
  UNION ALL SELECT 14, 'Ripple stoneware vase', 'RSV-01', 'Hand-finished ceramic with a soft shape for stems or display.', 1690.00, 19, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85', 4.7, 71, 'Home'
  UNION ALL SELECT 15, 'Cloud cotton throw', 'CCT-01', 'Breathable woven cotton for a sofa, bed, or cool evening outdoors.', 2490.00, 16, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', 4.8, 202, 'Home'
  UNION ALL SELECT 16, 'Little grove planter pair', 'LGP-02', 'Two indoor planters with drainage trays and a simple finish.', 1390.00, 28, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=85', 4.5, 88, 'Home'
  UNION ALL SELECT 17, 'Low tide ceramic mug duo', 'LTM-02', 'A pair of balanced stoneware mugs with individual glaze variation.', 1190.00, 33, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85', 4.8, 121, 'Kitchen'
  UNION ALL SELECT 18, 'First light pour-over kit', 'FLP-01', 'A ceramic dripper and carafe set for a slow, reliable cup at home.', 2890.00, 15, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85', 4.7, 167, 'Kitchen'
  UNION ALL SELECT 19, 'Good edge chef knife', 'GEC-01', 'A balanced stainless steel kitchen knife with an easy-care handle.', 3290.00, 10, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1000&q=85', 4.6, 94, 'Kitchen'
  UNION ALL SELECT 20, 'Loop insulated bottle', 'LIB-01', 'A leak-resistant bottle with a wide mouth for easy cleaning.', 1490.00, 35, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85', 4.5, 254, 'Travel'
  UNION ALL SELECT 21, 'Market day canvas tote', 'MDT-01', 'A sturdy carryall with reinforced handles and a deep inside pocket.', 790.00, 45, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85', 4.7, 187, 'Travel'
  UNION ALL SELECT 22, 'Roam commuter backpack', 'RCB-01', 'A weather-resistant daily pack with a padded laptop sleeve.', 4890.00, 12, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85', 4.6, 138, 'Travel'
  UNION ALL SELECT 23, 'Sunday acetate sunglasses', 'SAS-01', 'A classic UV-protected frame with a light, comfortable fit.', 2590.00, 21, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85', 4.4, 109, 'Accessories'
  UNION ALL SELECT 24, 'Pocket fold card wallet', 'PFC-01', 'A slim recycled-leather wallet for the cards you actually carry.', 1890.00, 24, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=85', 4.6, 146, 'Accessories'
  UNION ALL SELECT 25, 'Soft hours merino scarf', 'SHM-01', 'Lightweight merino wool with a soft hand and natural warmth.', 3490.00, 9, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85', 4.8, 68, 'Accessories'
  UNION ALL SELECT 26, 'Grounded everyday yoga mat', 'GEY-01', 'A grippy, easy-clean mat with cushioning for daily movement.', 2790.00, 18, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1000&q=85', 4.7, 191, 'Wellness'
  UNION ALL SELECT 27, 'After rain soy candle', 'ARS-01', 'A clean-burning soy candle with a fresh green scent and reusable jar.', 990.00, 37, 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85', 4.8, 230, 'Wellness'
  UNION ALL SELECT 28, 'Daily calm face care set', 'DCF-02', 'A gentle cleanser and moisturizer duo for a simple daily routine.', 3190.00, 14, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85', 4.5, 112, 'Wellness'
  UNION ALL SELECT 29, 'Pair of steady grip weights', 'SGW-02', 'Compact hand weights with a comfortable finish for home strength work.', 1990.00, 7, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=85', 4.4, 75, 'Wellness'
  UNION ALL SELECT 30, 'Color day 35mm film pack', 'CDF-02', 'Two rolls of versatile color film for everyday light and moments.', 1590.00, 20, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85', 4.6, 129, 'Photography'
  UNION ALL SELECT 31, 'Pocket fold camera tripod', 'PCT-01', 'A light, fold-flat tripod for sharper night shots and steadier video.', 2290.00, 11, 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1000&q=85', 4.5, 57, 'Photography'
  UNION ALL SELECT 32, 'Weekend photo print box', 'WPP-01', 'Archival-quality prints to bring a favorite camera roll into the room.', 1290.00, 29, 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1000&q=85', 4.9, 91, 'Photography'
  UNION ALL SELECT 33, 'Form and function wall shelf', 'FFS-01', 'A compact solid-wood shelf for books and everyday objects.', 3790.00, 8, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1000&q=85', 4.6, 82, 'Home'
  UNION ALL SELECT 34, 'Sunday serving bowl', 'SSB-01', 'A wide, durable stoneware bowl for shared meals or the counter.', 1790.00, 17, 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1000&q=85', 4.8, 65, 'Kitchen'
  UNION ALL SELECT 35, 'Slow start analog alarm clock', 'SAC-01', 'A quiet-sweep bedside clock with a clear face and gentle bell.', 2190.00, 14, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1000&q=85', 4.5, 118, 'Home'
  UNION ALL SELECT 36, 'Tidy travels cable pouch', 'TCP-01', 'A padded organizer for chargers, earbuds, and travel essentials.', 1090.00, 27, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85', 4.7, 153, 'Travel'
) p
JOIN categories c ON c.name = p.category_name;

-- Two explicitly seeded demo marketplace offers per curated product.
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at)
SELECT p.id * 10 + 1, p.id, 'FLIPKART', ROUND(p.price * 0.90, 2), 0.00, 2, 4.6, 1200 + p.id * 137,
       'Demo verified seller', CONCAT('https://example.com/demo-offer/', p.model_identifier), 1, NOW()
FROM products p WHERE p.id BETWEEN 2 AND 36;

INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at)
SELECT p.id * 10 + 2, p.id, 'MEESHO', ROUND(p.price * 0.82, 2), 250.00, 8, 3.7, 80 + p.id,
       'Demo marketplace seller', CONCAT('https://example.com/demo-alternate/', p.model_identifier), 1, NOW()
FROM products p WHERE p.id BETWEEN 2 AND 36;

-- One offer that's a genuinely better deal (cheaper, faster, better rated)
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (1, 1, 'FLIPKART', 4299.00, 0.00, 2, 4.5, 8600, 'Flipkart Assured Seller', 'https://flipkart.com/example-x200', true, NOW());

-- One offer that's cheaper but clearly worse on every other axis
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (2, 1, 'MEESHO', 3999.00, 150.00, 9, 3.4, 120, 'Unbranded Reseller', 'https://meesho.com/example-x200', true, NOW());

-- One offer at nearly the same price, to exercise the "tie" scoring branch
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (3, 1, 'AMAZON', 4950.00, 0.00, 1, 4.6, 42000, 'Amazon Retail', 'https://amazon.in/example-x200', true, NOW());
