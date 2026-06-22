
const express = require('express');
const router = express.Router();
const ROLES = require("../../../../shared/constants/role");
const authenticate = require('../../../../shared/middleware/authenticate'); 
const authorize = require('../../../../shared/middleware/authorize');
const venuContoller = require('../controllers/addVenueController');

router.post('/addVenue',authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.addVenue);
router.post('/deleteVenue/:venueId',authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.deleteVenue);

router.get('/viewVenue',authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.viewVenue);

module.exports = router;