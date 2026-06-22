const express = require('express');
const router = express.Router();
const ROLES = require("../../../../shared/constants/role");
const authenticate = require('../../../../shared/middleware/authenticate'); 
const authorize = require('../../../../shared/middleware/authorize')
const profileController = require('../controllers/profileController');


router.get("/view", authenticate,authorize(ROLES.USER), profileController.getProfile);
router.patch("/edit", authenticate,authorize(ROLES.USER), profileController.editProfile);
router.patch("/editEmail",authenticate,authorize(ROLES.USER), profileController.editEmail);
router.patch("/editPassword",authenticate,authorize(ROLES.USER), profileController.editPassword);
console.log('routerCAlled');
router.patch("/changeRole",profileController.changeRole);


module.exports = router;