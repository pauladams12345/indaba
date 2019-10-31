var Router = 	require('express-promise-router'),
	router = 	new Router(),						// allows asynchronous route handlers
	session = 	require('express-session'),
	slot =		require('../models/slot.js'),
	event =		require('../models/event.js'),
	helpers = 	require('../helpers/helpers.js');

// Redirects new arrivals to landing page. Handles authentication
// for users redirected from CAS login then redirects to personal homepage
router.get('/', async function (req, res, next) {

	// If there's no CAS ticket in the query string, redirect to the landing page
	if (!req.query.ticket) {
		res.redirect('/login');
	}

	// Otherwise, user has been redirected from CAS
	// Validate ticket, redirect to personal homepage
	else {

		// Get ticket from query string
		let cas_ticket = req.query.ticket;

		// Validate ticket and get user's attributes
		let attributes = await helpers.validateTicket(cas_ticket);

		// Store user's name and onid in the session
		req.session.onid = attributes.onid;
		req.session.firstName = attributes.firstName;
		
		// If new user, store in database
		await helpers.createUserIfNew(attributes);

		// Redirect to homepage
		res.redirect('/home');
	}
});

// Displays user's personal homepage
router.get('/home', async function (req, res, next) {
	// If there is no session established, redirect to the landing page
	if (!req.session.onid) {
		res.redirect('../login');
	}
	// If there is a session, render user's homepage
	else {
		let context = {};

		// Find all slots a user is registered for
		let [reservations, fields] = await slot.findUserSlots(req.session.onid);

		// Process response from database into a handlebars-friendly format
		context.events = await helpers.processReservationsForDisplay(reservations);

		context.firstName = req.session.firstName;
		context.stylesheets = ['main.css', 'login.css'];
		res.render('home', context);
	}

});

// Displays landing page
// TODO: redirect to homepage if there's a session???
router.get('/login', async function (req, res, next) {
	let context = {};
	context.layout = 'no_navbar.handlebars';
	context.stylesheets = ['main.css', 'login.css'];
	res.render('login.handlebars', context);
});

// Uncomment this route to test locally without constantly re-deploying to Heroku
router.get('/home-test', async function (req, res, next) {

	req.session.onid = 'adamspa';
	let context = {};
	
	// Find all slots a user is registered for
	let [reservations, fields] = await slot.findUserSlots(req.session.onid);

	// Process response from database into a handlebars-friendly format
	context.events = await helpers.processReservationsForDisplay(reservations);

	context.firstName = req.session.firstName;
	context.stylesheets = ['main.css', 'login.css'];
	res.render('home', context);
});



module.exports = router;
