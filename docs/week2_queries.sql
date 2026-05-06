-- Get paginated events
SELECT *
FROM event
ORDER BY date ASC
LIMIT 10 OFFSET 0;

SELECT SUM(ci.quantity * e.price) AS subtotal
FROM cart_item ci
JOIN event e ON ci.event_id = e.id
WHERE ci.cart_id = 1;

-- Insert order items from cart 
INSERT INTO order_item (order_id, event_id, quantity, price_at_purchase)
SELECT
  1,
  ci.event_id,
  ci.quantity,
  e.price
FROM cart_item ci
JOIN event e ON ci.event_id = e.id
WHERE ci.cart_id = 1;