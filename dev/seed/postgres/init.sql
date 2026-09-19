-- Sample "orders" data for the Postgres test connection.
-- 150 synthetic orders spanning Jan-Jun 2026, across a handful of customers/products,
-- so prompts like "monthly revenue trend" or "revenue by product" have real substance.

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    order_date DATE NOT NULL
);

INSERT INTO orders (customer_name, product, quantity, unit_price, order_date)
SELECT
    (ARRAY['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Stark Industries'])[1 + floor(random() * 5)::int],
    (ARRAY['Widget A', 'Widget B', 'Gadget X', 'Gadget Y'])[1 + floor(random() * 4)::int],
    (1 + floor(random() * 20))::int,
    round((9.99 + random() * 90)::numeric, 2),
    date '2026-01-01' + (floor(random() * 181))::int
FROM generate_series(1, 150);
