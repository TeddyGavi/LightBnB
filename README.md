# Light BNB
### Light BnB is a property booking service akin to "AirBnB". The front end is cloned from this boiler plate code [Lighthouse Labs Light BnB](https://github.com/lighthouse-labs/LightBnB_WebApp).


### Getting Started
1. Clone the repo onto your local device
2. Install dependencies using ```npm install```
3. Navigate to /confirm all packages are installed ```cd...```
4. You will need to create a seeds folder and seed.sql file and seed data from [LHL seed data](https://raw.githubusercontent.com/lighthouse-labs/w5-sql-seeds/master/lightbnb_seeds/02_seeds.sql) following the instructions [here](https://flex-web.compass.lighthouselabs.ca/workbooks/flex-m05w12/activities/765?journey_step=42)
5. Start the server using ```npm run local```
6. Head to http://localhost:3000/ in your web browser

[back to top](#light-bnb)
### Goals and Learning outcomes

- In this project I have studied:
  - [x] Database Design
  - [x] ERDs
  - [x] Querying a database seeded with fake data
  - [x] Add SQL queries from a webApp using [node-postgres](https://node-postgres.com/)

[back to top](#light-bnb)

### Features
- All functionality that I implemented can be viewed in the [database.js](https://github.com/TeddyGavi/LightBnB/blob/main/LightBnB_WebApp/server/database.js)
- This involved refactoring multiple functions to query our fake database

[back to top](#light-bnb)

### Future Goals
- [ ] write HTML and SASS to:
  - add a color palette
  - add typography
  - consistent formatting for all property display cards  
- [ ] add a map reference to the main page
- [ ] allow users and guests to write property reviews
- [ ] allow owners to update rates of certain properties within a given date window
- [ ] fix 404 error related to property images no loading

[back to top](#light-bnb)

### Views
![ERD diagram](https://github.com/TeddyGavi/LightBnB/blob/main/LightBnB_WebApp/public/readMe-img/LightBnB%20ERD.drawio(4).png)
![page view](https://github.com/TeddyGavi/LightBnB/blob/main/LightBnB_WebApp/public/readMe-img/res_pageview.png)

### Dependencies 
- bcrypt
- body-parser
- cookie-session
- express
- nodemon
- pg

[back to top](#light-bnb)
