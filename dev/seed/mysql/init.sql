-- Sample "customers" data for the MySQL test connection.
-- 120 synthetic SaaS customers across three plan tiers, signed up over Jan-Jun 2026,
-- so prompts like "signups by plan" or "revenue by plan tier" have real substance.

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    plan VARCHAR(20) NOT NULL,
    signup_date DATE NOT NULL,
    monthly_revenue DECIMAL(10, 2) NOT NULL
);

INSERT INTO customers (name, email, plan, signup_date, monthly_revenue)
WITH RECURSIVE seq(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 120
)
SELECT
    CONCAT('Customer ', n),
    CONCAT('customer', n, '@example.com'),
    ELT(1 + FLOOR(RAND() * 3), 'Starter', 'Pro', 'Enterprise'),
    DATE_ADD('2026-01-01', INTERVAL FLOOR(RAND() * 180) DAY),
    ROUND(19 + RAND() * 480, 2)
FROM seq;
