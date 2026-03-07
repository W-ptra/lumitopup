DELETE FROM transactions;
DELETE FROM products;
DELETE FROM games;
DELETE FROM users;

INSERT INTO users (id, google_id, name, email, image, role, created_at, updated_at) VALUES 
('8f3a2c6e-91b4-4d7f-9a21-5c7e3b8d1f90', 'g123456789', 'John Doe', 'john.doe@example.com', 'https://example.com/avatar1.png', 'USER', NOW(), NOW()),
('b7d4e1a9-2c6f-4f8a-8b35-9d2a7c6e4f11', 'g987654321', 'Jane Smith', 'jane.smith@example.com', 'https://example.com/avatar2.png', 'USER', NOW(), NOW()),
('c1e9f7a2-5b4c-4a8d-9f62-3e7b1d9a6c22', 'g555555555', 'Admin LumiTopUp', 'admin@lumitopup.com', 'https://example.com/admin.png', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO games (id, name, image, active, created_at, updated_at) VALUES
('d4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', 'Genshin Impact', '/genshin-impact-log.png', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, game_id, title, price, original_price, image, active, created_at, updated_at) VALUES
('e1b3c5d7-8f9a-4c2d-9b61-2a7e3f4c5d44', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', 'Welkin', 2417212, 3664093, '/welkin.jpg', true, NOW(), NOW()),
('f2c4d6e8-9a1b-4d3f-8c72-3b6a1e2d7f55', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '60 Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW()),
('a3d5e7f9-1b2c-4e6a-9d83-4c7b2a1e8f66', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '330 (300 + 30) Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW()),
('b4e6f8a1-2c3d-4f7b-8e94-5d8c3b2a9f77', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '1090 (980 + 110) Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW()),
('c5f7a9b2-3d4e-4a8c-9f15-6e9d4c3b1a88', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '2240 (1980 + 260) Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW()),
('d6a8b1c3-4e5f-4b9d-8a26-7f1e5d4c2b99', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '3880 (3280 + 600) Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW()),
('e7b9c2d4-5f6a-4c1e-9b37-8a2f6e5d3c10', 'd4a7b9c1-3e6f-4c8a-9d21-7f3b6a1e2c33', '8080 (6480 + 1600) Crystal', 652674, 906173, '/crystall.webp', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO transactions (id, user_id, product_id, game_name, product_title, amount, payment_method, game_uid, server, email, status, expired_at, created_at, updated_at) VALUES
('f8c1d3e5-6a7b-4d9f-8c41-9b3e7a2d4f21', '8f3a2c6e-91b4-4d7f-9a21-5c7e3b8d1f90', 'e1b3c5d7-8f9a-4c2d-9b61-2a7e3f4c5d44', 'Genshin Impact', 'Welkin', 2417212, 'GoPay', '812345678', 'asia', 'john.doe@example.com', 'PAID', NOW() + INTERVAL '1 day', NOW(), NOW()),
('a9d2e4f6-7b8c-4e1a-9d52-1c4f8b3a6e32', 'b7d4e1a9-2c6f-4f8a-8b35-9d2a7c6e4f11', 'f2c4d6e8-9a1b-4d3f-8c72-3b6a1e2d7f55', 'Genshin Impact', '60 Crystal', 652674, 'DANA', '898765432', 'america', 'jane.smith@example.com', 'PENDING', NOW() + INTERVAL '1 day', NOW(), NOW()),
('b1e3f5a7-8c9d-4f2b-8e63-2d5a9c4b7f43', '8f3a2c6e-91b4-4d7f-9a21-5c7e3b8d1f90', 'e7b9c2d4-5f6a-4c1e-9b37-8a2f6e5d3c10', 'Genshin Impact', '8080 (6480 + 1600) Crystal', 652674, 'QRIS', '812345678', 'asia', 'john.doe@example.com', 'FAILED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;