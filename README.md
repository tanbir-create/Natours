# Natours

## A Tour Booking App

**Live demo:** https://na-tours-t0v9.onrender.com/

**API documentation:**  https://documenter.getpostman.com/view/2s9Xy2PsKN?version=latest

**Video Demo** https://www.loom.com/share/b7c1c29f509c41b3b24891f0362fc189?sid=9bdb72c5-ba64-45b8-8f4e-d98460707930

#### Table of contents:
 - [App features](#Features)
 - [Installation](#Installation)
 - [Usage](#Usage)
 - [Learnings](#Learnings)



### Features

A Tour booking app to live your next dream vacation.
There are various roles all over the app for different types of users which can perform the below actions.
 1. Users:
	 - Signup, login and logout.
	 - Search for tours, using filter and sorting options.
	 - View tours in detail including maps, guides, images, description, etc. 
	 - Authenticated users can book tours using stripe payment gateway.
	 - Manage bookings.
	 - Add review and ratings on tours.
	 - Update user profiles (username, email, password and photo)
	 
 2. Guides:
	- Add new tours 
	- View tours' stats, track performance of tours.

3. Admins: 
	- Can do all of the above.
	- Manage users, guides, tours, reviews.


### Installation
Clone the repository and follow the instructions or run the commands below:

1. `npm install` (installs all necessary dependencies for the app)
2. set your env variables in a `config.env` file ( check example `config.env` for your reference)
  (we use *mongodb* as database, *mailtrap* as development email service, *brevo* as production email service,
	and *stripe* as payment service provider )	
3. run command: `node dev-data/import-dev-data --import` (to import dummy dev data to your database)
  or  `node dev-data/import-dev-data --delete` (to clear database)
4. `npm run build:js` (build client js bundle using parcel)
5. Use any one of the below commands according to your needs:
	- `npm start` (starts app)
	- `npm run dev` (for development, starts app watching for changes using nodemon)
	-  `npm run start:prod` (for production, starts app watching for changes using nodemon)
	-  `npm run debug` (for debugging purposes)







### Usage	
Please check the [API Documentation](https://documenter.getpostman.com/view/2s9Xy2PsKN?version=latest) for better understanding of the APIs.

Set your base api URL in the postman environment variable, also add another variable ***jwt*** for ease of use on authenticated/authorized routes (read below).

Add this line of code to the **Tests** tab in the `/signup` and `/login` endpoints: `pm.environment.set("jwt", pm.response.json().token);`  to set the current value of  ***jwt***  (from the `res.token` of the response body of authentication requests) in the environment variable added above .

Using the ***jwt*** variable: For protected routes throughout the app, in the **Authorization** tab set the type as *Bearer Token* and set the Token value as {{jwt}}. On every successful signup/login this will ensure the new jwt value is set automatically in the jwt env variable using the above two steps. Voila! follow the api documentation here on.



### Learnings
Please do check the code documentation for understanding my learnings further. I tried to comment as much for better understanding of the reader and also portray my learnings altogether. Lot of these might be express and node specific but I am generalizing my learnings to fit any language or frameworks.

Learnings include but not limited to: 

 - Building ~production grade backend apps. With better *data modelling*, creating meaningful *REST API* routing.
 - Advance database querying including aggregation pipeline, data population, also using indexes for various use cases for faster querying.
 - Security best practices ( sanitizing inputs, injection attacks, parameter pollution, CSP, anti xss, api rate limting, csrf, etc) (lot to learn and I am here for it)
 - Authentication and authorization best practices (lot to learn)
 - *Global error handling* including operational and dev errors (makes error handling alot smooth by handling errors in a central place making the development process easy)
 - Using payment gateways, webhooks.
 - Building API features for filtering, sorting, pagination of data.


### Acknowledgement

This project is a part of the course I have taken. I have learnt a lot from this course am very grateful for it. [Course link] (https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)

 
