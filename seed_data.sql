
-- Seed data for subscriptions table
INSERT INTO subscriptions (
  additional_info, adult_content, connections, country_code, payement_email,
  payement_full_name, payement_order_id, plan, price, quick_delivery,
  status, subscription_type, user_email, user_name, user_phone, vod
) VALUES
('Premium package', false, '2', 'US', 'john.doe@example.com',
 'John Doe', 'ORD-123456', 'monthly', 9.99, false,
 'paid', 'standard', 'john.doe@example.com', 'John Doe', '+1234567890', true),
('Family plan', false, '3', 'CA', 'jane.smith@example.com',
 'Jane Smith', 'ORD-789012', 'annual', 99.99, true,
 'paid', 'family', 'jane.smith@example.com', 'Jane Smith', '+9876543210', false),
('Basic subscription', false, '1', 'UK', 'bob.johnson@example.com',
 'Bob Johnson', 'ORD-345678', 'quarterly', 24.99, false,
 'draft', 'basic', 'bob.johnson@example.com', 'Bob Johnson', '+1122334455', false),
('Student plan', false, '1', 'AU', 'emma.wilson@example.com',
 'Emma Wilson', 'ORD-567890', 'monthly', 4.99, false,
 'paid', 'student', 'emma.wilson@example.com', 'Emma Wilson', '+6677889900', true),
('Business package', true, '3', 'DE', 'hans.mueller@example.com',
 'Hans Mueller', 'ORD-901234', 'annual', 199.99, true,
 'paid', 'business', 'hans.mueller@example.com', 'Hans Mueller', '+4455667788', true),
('Trial subscription', false, '1', 'FR', 'marie.dubois@example.com',
 'Marie Dubois', 'ORD-112233', 'monthly', 0, false,
 'draft', 'trial', 'marie.dubois@example.com', 'Marie Dubois', '+3344556677', false),
('Premium plus', true, '3', 'JP', 'takashi.yamamoto@example.com',
 'Takashi Yamamoto', 'ORD-445566', 'semi-annual', 59.99, true,
 'paid', 'premium', 'takashi.yamamoto@example.com', 'Takashi Yamamoto', '+8199887766', true),
('Basic annual', false, '2', 'BR', 'ana.silva@example.com',
 'Ana Silva', 'ORD-778899', 'annual', 79.99, false,
 'paid', 'basic', 'ana.silva@example.com', 'Ana Silva', '+5511223344', false),
('Family quarterly', false, '3', 'ES', 'carlos.garcia@example.com',
 'Carlos Garcia', 'ORD-001122', 'quarterly', 39.99, true,
 'paid', 'family', 'carlos.garcia@example.com', 'Carlos Garcia', '+3466778899', true),
('Corporate plan', true, '3', 'SG', 'li.wei@example.com',
 'Li Wei', 'ORD-334455', 'annual', 299.99, true,
 'paid', 'corporate', 'li.wei@example.com', 'Li Wei', '+6588990011', true);

-- Seed data for devices table
INSERT INTO devices (device_type, mac_address, subscription_id)
SELECT 'smartphone', '00:11:22:33:44:55', id FROM subscriptions WHERE user_name = 'John Doe'
UNION ALL
SELECT 'tablet', 'AA:BB:CC:DD:EE:FF', id FROM subscriptions WHERE user_name = 'Jane Smith'
UNION ALL
SELECT 'smart_tv', '11:22:33:44:55:66', id FROM subscriptions WHERE user_name = 'Jane Smith'
UNION ALL
SELECT 'laptop', 'FF:EE:DD:CC:BB:AA', id FROM subscriptions WHERE user_name = 'Bob Johnson'
UNION ALL
SELECT 'smartphone', '22:33:44:55:66:77', id FROM subscriptions WHERE user_name = 'Emma Wilson'
UNION ALL
SELECT 'desktop', 'BB:CC:DD:EE:FF:00', id FROM subscriptions WHERE user_name = 'Hans Mueller'
UNION ALL
SELECT 'tablet', 'CC:DD:EE:FF:00:11', id FROM subscriptions WHERE user_name = 'Hans Mueller'
UNION ALL
SELECT 'smartphone', 'DD:EE:FF:00:11:22', id FROM subscriptions WHERE user_name = 'Marie Dubois'
UNION ALL
SELECT 'smart_tv', 'EE:FF:00:11:22:33', id FROM subscriptions WHERE user_name = 'Takashi Yamamoto'
UNION ALL
SELECT 'game_console', 'FF:00:11:22:33:44', id FROM subscriptions WHERE user_name = 'Takashi Yamamoto'
UNION ALL
SELECT 'laptop', '00:11:22:33:44:55', id FROM subscriptions WHERE user_name = 'Ana Silva'
UNION ALL
SELECT 'smartphone', '11:22:33:44:55:66', id FROM subscriptions WHERE user_name = 'Carlos Garcia'
UNION ALL
SELECT 'tablet', '22:33:44:55:66:77', id FROM subscriptions WHERE user_name = 'Carlos Garcia'
UNION ALL
SELECT 'desktop', '33:44:55:66:77:88', id FROM subscriptions WHERE user_name = 'Li Wei'
UNION ALL
SELECT 'smartphone', '44:55:66:77:88:99', id FROM subscriptions WHERE user_name = 'Li Wei';