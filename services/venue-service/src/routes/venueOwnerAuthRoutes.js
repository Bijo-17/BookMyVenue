
const express = require('express');
const router = express.Router();

const authenticate = require('../../../../shared/middleware/authenticate');
const authController = require('../controllers/authVenueOwnerController');

router.get('/', (req, res) => {
    res.send("Venue service Health check... Good");
})

router.post('/venuOwner/signup',authenticate, authController.registerVenueOwner);
router.post('/venuOwner/login',authenticate, authController.venuOwnerLogin);
router.post('/venuOwner/logout',authenticate, authController.venuOwnerLogout);

module.exports = router;
