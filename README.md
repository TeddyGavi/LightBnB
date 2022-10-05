# Light BNB
### Light BnB is a property booking service akin to "AirBnB". The front end is cloned from this boiler plate code [Lighthouse Labs Light BnB](https://github.com/lighthouse-labs/LightBnB_WebApp).


### Getting Started
1. Clone the repo onto your local device
2. Install dependencies using ```npm install```
3. Navigate to /confirm all packages are installed ```cd...```
4. Start the server using ```npm run local```
5. Head to http://localhost:3000/ in your web browser


### Goals and Learning outcomes

- In this project I have studied:
  - [x] Database Design
  - [x] ERDs
  - [x] Querying a database seeded with fake data
  - [x] Add SQL queries from a webApp using [node-postgres](https://node-postgres.com/)

### Features
- All functionality that I implemented can be viewed in the [database.js](https://github.com/TeddyGavi/LightBnB/blob/main/LightBnB_WebApp/server/database.js)
- This involved refactoring multiple functions to query our fake database
### Future Goals
- [ ] write HTML and SASS to:
  - add a color palette
  - add typography
  - consistent formatting for all property display cards  
- [ ] add a map reference to the main page
- [ ] allow users and guests to write property reviews
- [ ] allow owners to update rates of certain properties within a given date window
- [ ] fix 404 error related to property images no loading

### Views
![ERD diagram](https://github.com/TeddyGavi/LightBnB/blob/main/LightBnB_WebApp/public/readMe-img/LightBnB%20ERD.drawio(4).png)

### Dependencies 
- bcrypt
- body-parser
- cookie-session
- express
- nodemon
- pg