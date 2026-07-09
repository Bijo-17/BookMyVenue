
const express = require('express');
const router = express.Router();
const ROLES = require("../../../../shared/constants/role");
const authenticate = require('../../../../shared/middleware/authenticate'); 
const authorize = require('../../../../shared/middleware/authorize');
const venuContoller = require('../controllers/addVenueController');

const upload = require('../config/multer');
const venues = require('../models/venues');

router.post('/addVenue',upload.array("photos",10),authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.addVenue);
router.delete('/deleteVenue/:venueId',authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.deleteVenue);

router.get('/viewVenue',authenticate,authorize(ROLES.VENUE_OWNER), venuContoller.viewVenue);

router.put('/editVenue/:venueId',upload.array("newPhotos",10),venuContoller.editVenue);


module.exports = router;

