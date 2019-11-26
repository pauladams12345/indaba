var Router = 		require('express-promise-router'),
	router = 		new Router(),						// allows asynchronous route handlers
	session = 		require('express-session'),
	slot =			require('../models/slot.js'),
	event =			require('../models/event.js'),
	invitation =	require('../models/invitation.js'),
	createsEvent =	require('../models/createsEvent.js');
	helpers = 		require('../helpers/helpers.js');

router.get('/past-reservations', async function (req, res, next) {

	// If there is no session established, redirect to the landing page
	if (!req.session.onid) {
		res.redirect('../login');
	}

	// If there is a session, render users past reservations
	else {
		let context = {};
		context.eventsManaging = await createsEvent.getPastUserEvents(req.session.onid);
		context.eventsAttending = await helpers.processPastReservationsForDisplay(req.session.onid);
		context.firstName = req.session.firstName;
		context.stylesheets = ['main.css'];
		context.scripts = ['convertISOToLocal.js'];
		res.render('past-reservations', context);
	}
});

router.get('/past-reservations-test', async function (req, res, next) {
	req.session.onid = 'adamspa';
	let context = {};
	context.eventsManaging = await createsEvent.getPastUserEvents(req.session.onid);
	context.eventsAttending = await helpers.processPastReservationsForDisplay(req.session.onid);
	context.firstName = req.session.firstName;
	context.stylesheets = ['main.css'];
	context.scripts = ['convertISOToLocal.js'];
	res.render('past-reservations', context);
});

module.exports = router;
