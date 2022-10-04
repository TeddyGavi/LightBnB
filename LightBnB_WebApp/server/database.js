// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

const {Pool} = require("pg");

const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: "lightbnb"
});
// TESTING
// pool.query(`SELECT title FROM properties LIMIT 10`).then(response => {console.log(response)});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let uEmail = email.toLocaleLowerCase().trim();
  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.email = $1`;
  const values = [uEmail];
  return pool
    .query(sql, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      }) 
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.id = $1`;
  const values = [id];

  return pool 
    .query(sql, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const sql = `INSERT INTO users (name, email, password) 
              VALUES ($1, $2, $3) 
              RETURNING *`
  const values = [user.name, user.email, user.password]

  return pool 
    .query(sql, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  console.log(limit)
  const sql = ` SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`;
  
  const values = [guest_id, limit]
  
  return pool
    .query(sql, values)
      .then(((response) => {
        // console.log(response.rows);
        return response.rows
      }))
      .catch((err) => {
        console.log(err.message);
      })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  console.log(limit);

  const values = [];
  let sql = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `
  if (options.city) {
    values.push(`%${options.city}%`)
    sql += `WHERE city LIKE $${values.length} `;
  }

  if (options.owner_id) {
    sql += (values.length ? `AND ` : `WHERE `)
    values.push(options.owner_id);
    sql += `properties.owner_id = $${values.length} `;
  }

  if (options.minimum_price_per_night) {
    sql += (values.length ? `AND ` : `WHERE `)
    const minPriceInCents = options.minimum_price_per_night * 100;
    values.push(minPriceInCents);
    sql += `properties.cost_per_night >= $${values.length} `;
  }

  if (options.maximum_price_per_night) {
    sql += (values.length ? `AND ` : `WHERE `)
    const maxPriceInCents = options.maximum_price_per_night * 100;
    values.push(maxPriceInCents);
    sql += `properties.cost_per_night <= $${values.length} `;
  }

  sql += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    sql += `HAVING  avg(property_reviews.rating) >= $${values.length} `
  }

  values.push(limit);
  sql += ` 
  ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

console.log(sql, values, typeof options.owner_id);
  return pool
    .query(sql, values)
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        console.log(err.message);
      });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const sql = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,  street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
RETURNING *
;`

values = [
  property.owner_id, 
  property.title, 
  property.description,
  property.thumbnail_photo_url, 
  property.cover_photo_url, 
  property.cost_per_night * 100, 
  property.street, 
  property.city, 
  property.province, 
  property.post_code, 
  property.country, 
  property.parking_spaces, 
  property.number_of_bathrooms, 
  property.number_of_bedrooms
];

return pool
  .query(sql, values)
    .then((result) => {
      console.log(result.rows);

    })
    .catch((err) => {
      console.log(err.message)
    });

}
exports.addProperty = addProperty;
