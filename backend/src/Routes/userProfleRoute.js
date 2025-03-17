const express=require('express');
const userProfile = require('../Controllers/userProfileController');
const router=express.Router();

router.post('/userProfile',userProfile);

module.exports=router;