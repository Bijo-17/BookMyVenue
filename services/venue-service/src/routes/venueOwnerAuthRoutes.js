
const express = require('express');
const router = express.Router();

const authenticate = require('../../../../shared/middleware/authenticate');
const authController = require('../controllers/authVenueOwnerController');

router.get('/', (req, res) => {
    res.send("Venue service Health check... Good");
})

// /venueOwner/

router.post('/signup',authenticate, authController.registerVenueOwner);
router.post('/logout',authenticate, authController.venuOwnerLogout);

module.exports = router;
