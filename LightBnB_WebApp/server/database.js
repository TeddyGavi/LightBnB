// const properties = require('./json/properties.json');
const users = require('./json/users.json');

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
 /*  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
 */
  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.email = $1`;
  const values = [`${email}`];
  return pool
    .query(sql, values)
      .then((result) => {
        // console.log(result.rows[0]);
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
  // return Promise.resolve(users[id]);

  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.id = $1`;
  const values = [`${id}`];

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
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  const sql = `INSERT INTO users (name, email, password) 
              VALUES ($1, $2, $3) 
              RETURNING *`
  const values = [`${user.name}`, `${user.email}`, `${user.password}`]

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
  const sql = ` SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10`;
  
  const values = [`${guest_id}`]
  
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
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
  
  // options = {
    // city,
    // owner_id,
    // minimum_price_per_night,
    // maximum_price_per_night,
    // minimum_rating
  // }

  const values = [];
  let sql = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `
  if (options.city) {
    values.push(`%${options.city}%`)
    sql += `WHERE city LIKE $${values.length} `;
  }

  console.log(options.owner_id, options.minimum_price_per_night, options.maximum_price_per_night, options.minimum_rating);

  if (options.owner_id) {
    values.push(`${options.owner_id}`);
    sql += `AND owner_id = $${values.length} `;
  }

  if (options.minimum_price_per_night) {
    const minPriceInCents = options.minimum_price_per_night * 100;
    values.push(minPriceInCents);
    sql += `AND  properties.cost_per_night >= $${values.length} `;
  }

  if (options.maximum_price_per_night) {
    const maxPriceInCents = options.maximum_price_per_night * 100;
    values.push(maxPriceInCents);
    sql += `AND  properties.cost_per_night <= $${values.length} `;
  }

  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    sql += `AND  property_reviews.rating >= $${values.length} `
  }

  values.push(limit);
  sql += ` 
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

  console.log(sql, values);

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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
