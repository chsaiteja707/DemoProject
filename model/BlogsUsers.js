const mongoDb=require('mongodb');
const getDb=require('../util/db').getDb;

class Blogs{
    constructor(){

    }

    static async pushBlog(blogId,userId){
        try {
            const db=getDb();
            var userId=new mongoDb.ObjectID(userId);
            var blogId=new mongoDb.ObjectID(blogId);

            const addToBlogs=await db.collection('Blogs').updateOne(
                {user_id:userId},
                { $push: {blogs : {blogId}}},
                {upsert:true}
            )

            return addToBlogs;  
        } catch (error) {
            throw error;
        }
         
    }

    static async popBlog(blogId,userId){
        try {
            const db=getDb();
            var userId=new mongoDb.ObjectID(userId);
            var blogId=new mongoDb.ObjectID(blogId);

            const addToBlogs=await db.collection('Blogs').updateOne(
                {user_id:userId},
                { $pull: {blogs : {blogId}}},
            )
            return addToBlogs; 
        } catch (error) {
            throw error;
        }
          
    }

}

module.exports=Blogs;