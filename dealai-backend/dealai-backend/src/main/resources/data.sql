-- Demo seed data so the Deal Comparison Engine has something to score
-- immediately after startup. Safe to delete once you're managing data
-- through the admin API.

INSERT IGNORE INTO categories (id, name, description) VALUES
  (1, 'Electronics', 'Phones, laptops, and accessories');

INSERT IGNORE INTO products (id, name, model_identifier, description, price, stock_quantity, image_url, rating_average, review_count, category_id, created_at) VALUES
  (1, 'Noise-Cancelling Wireless Headphones X200', 'X200-BLK', 'Over-ear ANC headphones, 30h battery', 4999.00, 50, NULL, 4.3, 1200, 1, NOW());

-- One offer that's a genuinely better deal (cheaper, faster, better rated)
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (1, 1, 'FLIPKART', 4299.00, 0.00, 2, 4.5, 8600, 'Flipkart Assured Seller', 'https://flipkart.com/example-x200', true, NOW());

-- One offer that's cheaper but clearly worse on every other axis
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (2, 1, 'MEESHO', 3999.00, 150.00, 9, 3.4, 120, 'Unbranded Reseller', 'https://meesho.com/example-x200', true, NOW());

-- One offer at nearly the same price, to exercise the "tie" scoring branch
INSERT IGNORE INTO external_product_offers (id, product_id, platform, price, shipping_cost, estimated_delivery_days, rating, review_count, seller_name, product_url, available, fetched_at) VALUES
  (3, 1, 'AMAZON', 4950.00, 0.00, 1, 4.6, 42000, 'Amazon Retail', 'https://amazon.in/example-x200', true, NOW());
