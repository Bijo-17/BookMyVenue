
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/', (req, res) => {
     res.send("auth server running...");
})


router.post('/signup', authController.signupUser);
router.post('/login', authController.login);
router.post('/logout',authController.logout);

router.post('/verifyOtp',authController.verifyOtp);
router.post('/resendOtp', authController.resendOtp);


module.exports = router;