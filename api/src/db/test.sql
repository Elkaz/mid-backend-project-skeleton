-- Implement and test basic SQL queries:
SELECT * FROM events;

SELECT * FROM events
WHERE id = 1;

SELECT * FROM events 
WHERE id = 999;

INSERT INTO events (title)
VALUES ('Bad Event');

INSERT INTO users (email, password_hash)
VALUES ('test@example.com', '123');

SELECT * FROM events
WHERE date = '2026-05-01';