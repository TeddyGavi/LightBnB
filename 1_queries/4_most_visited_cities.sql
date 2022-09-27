-- SELECT properties.city AS name, count(reservations.id) AS total_reservations
-- FROM properties
-- JOIN reservations ON  properties.id = reservations.property_id
-- GROUP BY name
-- ORDER BY count(reservations.id) DESC;

SELECT properties.city, count(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;
