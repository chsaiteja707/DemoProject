const express=require('express');

const router=express.Router();

const authController=require('../controller/authController');
const isAuthenticated=require('../middleware/isAuthenticated');

router.get('/login',authController.renderLoginPage);
router.post('/login',authController.loginHandler);

router.get('/signup',authController.renderSignUpPage);
router.post('/signup',authController.signUpHandler);

router.get('/logout',isAuthenticated,authController.logoutController);

module.exports=router;