-- SELECT properties.id as id, properties.title, properties.cost_per_night, avg(property_reviews.rating) as avg_rating 
-- FROM properties 
-- JOIN property_reviews ON property_reviews.property_id = properties.id
-- WHERE properties.city LIKE '%ancouve%'
-- GROUP BY properties.id
-- HAVING avg(property_reviews.rating) >= 4
-- ORDER BY cost_per_night ASC 
-- LIMIT 10;


SELECT properties.id, title, cost_per_night, avg(property_reviews.rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
