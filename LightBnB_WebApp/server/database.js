const db = require("./db/index.js");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  //make sure there are no trailing spaces and email is in lower case!
  let uEmail = email.toLocaleLowerCase().trim();
  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.email = $1`;
  const queryParams = [uEmail];
  return db
    .query(sql, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //set up sql to use the entered ID
  const sql = `SELECT id, name, email, password  
              FROM users 
              WHERE users.id = $1`;
  const queryParams = [id];

  return db
    .query(sql, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  //the * here auto generates a userId when returned from the query, this is needed in order to populate the database appropriately
  const sql = `INSERT INTO users (name, email, password) 
              VALUES ($1, $2, $3) 
              RETURNING *;`;
  const queryParams = [user.name, user.email, user.password];

  return db
    .query(sql, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const sql = ` 
  SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`;
  
  const queryParams = [guest_id, limit];
  console.log(`Reservation function logging the limit: ${limit}`);
  
  return db
    .query(sql, queryParams)
    .then(((res) => {
      return res.rows;
    }))
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  /*
  set up empty array that will contain each options if they are included in the search criteria, I use a ternary op inside each if statement to determine whether or not to include ADD or WHERE, After speaking with Mentor Juliana I decided to keep it this way instead of including the WHERE in the initial SQL string and checking the length in the if statement
  */

  const queryParams = [];
  let sql = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    sql += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    sql += `${queryParams.length > 1 ? `AND` : `WHERE`} properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    sql += `${queryParams.length > 1 ? `AND` : `WHERE`} properties.cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    sql += `${queryParams.length > 1 ? `AND` : `WHERE`} properties.cost_per_night <= $${queryParams.length} `;
  }

  sql += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    sql += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  sql += ` 
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(`here is the query string from get all properties: \n ${sql}`);
  console.log(`get all properties function logging the limit: ${limit}`);
  return db
    .query(sql, queryParams)
    .then((res) => {
      return res.rows;
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
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `;

  const queryParams = [
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

  console.log(`This is the sql string from addProperty function ${sql}\n and the parameters ${queryParams}`);
  return db
    .query(sql, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};
exports.addProperty = addProperty;
