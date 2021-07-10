const express=require('express');

const router=express.Router();

const appController=require('../controller/appController');
const isAuthenticated=require('../middleware/isAuthenticated');

router.get('/',isAuthenticated,appController.homeController);
router.get('/blogs',isAuthenticated,appController.homeController);
router.get('/userBlogs',isAuthenticated,appController.renderUserBlogs);

router.get('/blog',isAuthenticated,appController.redirectToBlogCreationPage);
router.post('/blog',isAuthenticated,appController.addNewBlog);

router.get('/blog/:id',isAuthenticated,appController.getSingleBlog);

router.get('/blog/edit/:id',isAuthenticated,appController.redirectToEditPage);
router.post('/blog/edit/:id',isAuthenticated,appController.updateBlog);

router.post('/blog/delete/:id/:image',isAuthenticated,appController.deleteBlog);

module.exports=router;