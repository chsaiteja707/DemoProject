const Blog=require('../model/Blog');
const UserBlogs = require('../model/BlogsUsers');
const fileHelper=require('../util/file');

exports.homeController=async (req,res,next)=>{
    try {
        const blogsForAll=await Blog.getAllBlogs();
        res.render('blogsAll',{blogs:blogsForAll});
    } catch (error) {
        res.render('404');
    }
    
}

exports.redirectToBlogCreationPage=(req,res,next)=>{
    try {
        res.render('blog',{editing:false,permission:true});
    } catch (error) {
        res.render('404');
    }   
}

exports.redirectToEditPage=async (req,res,next)=>{
    try {
        const getBlog =await Blog.getBlog(req.params.id);
        res.render('blog',{editing:true, title:getBlog.title,description:getBlog.description,id:req.params.id,permission:true});
    } catch (error) {
        res.render('404');
    }
}

exports.renderUserBlogs=async(req,res,next)=>{
    try {
        const blogsForUser=await Blog.getBlogsForUser(req.session.user_id);
        res.render('blogs',{blogs:blogsForUser});
    } catch (error) {
        res.render('404');
    }
}

exports.getSingleBlog=async(req,res,next)=>{
    try {
        const blog=await Blog.getBlog(req.params.id);
        if(blog.createdBy===req.session.user_id){
            res.render('previewBlog',{blog:blog,owner:true});
        }else{
            res.render('previewBlog',{blog:blog,owner:false});
        }
    } catch (error) {
        res.render('404');
    }
    
}

exports.updateBlog=async (req,res,next)=>{
    try {
        const {title,description}=req.body;
        const user_id=req.session.user_id;
        const id=req.params.id;
        const date=new Date();
        const getBlog=await Blog.getBlog(id);
        const updatedImage=req.file.filename;
        console.log('I am here');
        console.log(getBlog);
        if(getBlog.createdBy===req.session.user_id){
            const image='images/'+getBlog.image;
            await fileHelper.deleteFile(image);
            const updatedBlog =await Blog.updateBlog(id,user_id,title,description,date.toString(),updatedImage);
            res.redirect('/');
        } else{
            res.render('blog',{editing:true, title:getBlog.title,description:getBlog.description,id:req.params.id,permission:false});
        }
        
    } catch (error) {
        res.render('404');
    }
}

exports.addNewBlog=async (req,res,next)=>{
    try {
        const userId=req.session.user_id;
        const {description, title}=req.body;
        const image=req.file;
        console.log(image);
        const date=new Date();
        const createdBy=req.session.user_id
        const newBlog=await Blog.addNewBlog(userId,title,description,date.toString(),image.filename,createdBy);
        const newBlogId=newBlog.insertedId;
        const addToBlogs=await UserBlogs.pushBlog(newBlogId,userId);
        res.redirect('/');
    } catch (error) {
        res.render('404');
    }
    
}

exports.deleteBlog=async (req,res,next)=>{
    try {
        const blog_id=req.params.id;
        const image='images/'+req.params.image;
        await fileHelper.deleteFile(image);
        const deleteFroBlogDB=await Blog.deleteBlog(blog_id,req.session.user_id);
        const deleteFromUserDB=await UserBlogs.popBlog(blog_id,req.session.user_id);
        console.log(blog_id)
        res.redirect('/userBlogs');
    } catch (error) {
        res.render('404');
    }
    
}


