# Natours

## A Tour Booking App

**Live demo:** https://na-tours-t0v9.onrender.com/

**API documentation:**  https://documenter.getpostman.com/view/2s9Xy2PsKN?version=latest

#### Table of contents:
 - [App features](#Features)
 - [Installation](#Installation)


#### Features

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


#### Installation
Clone the repository and follow the instructions or run the commands below:

1. `npm install` (installs all necessary dependencies for the app)
2. set your env variables ( check example `config.env` for your reference)
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
