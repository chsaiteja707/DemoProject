const mongoDb=require('mongodb');
const getDb=require('../util/db').getDb;

const findInCache=require('../util/cache').findInCache;
const addToCache=require('../util/cache').addToCache;
const deleteFromCache=require('../util/cache').deleteFromCache;


class Blog{
    constructor(){
       
    }

    static async addNewBlog(user_id,title,description,creationDate,image,createdBy){
        const collectionName='Blog';
        const db=getDb();
        var object_Id=new mongoDb.ObjectID(user_id);
        
        try {
            var key={user_id:object_Id, collectionName:collectionName};
            await deleteFromCache(key);
            const addBlog= await db.collection(collectionName).insertOne({user_id:object_Id,title:title,description:description,creationDate:creationDate,lastUpdatedDate:creationDate,image:image,createdBy:createdBy})//in Mongo Cloud name is specified as User for DB
            return addBlog;
        } catch (error) {
            console.log(error);
            throw 'error DB query'
        }  
    }

    static async getBlog(blog_id){
        const db=getDb();
        var object_Id=new mongoDb.ObjectID(blog_id);
        try {
            const getBlog= await db.collection('Blog').findOne({_id:object_Id})//in Mongo Cloud name is specified as User for DB
            return getBlog;
        } catch (error) {
            console.log(error)
            throw 'error DB query'
        }  
    }

    static async updateBlog(blog_id,user_id,title,description,lastUpdatedDate,image){
        const db=getDb();
        var object_Id=new mongoDb.ObjectID(blog_id);
        user_id=new mongoDb.ObjectID(user_id);
        const collectionName='Blog';
        try {
            var key={user_id:user_id, collectionName:collectionName};
            var addBlog;
            await deleteFromCache(key);
            if(image){
                addBlog= await db.collection('Blog').updateOne({_id:object_Id},{$set : {title:title, description:description,lastUpdatedDate:lastUpdatedDate,image:image} })//in Mongo Cloud name is specified as User for DB
            }else{
                addBlog= await db.collection('Blog').updateOne({_id:object_Id},{$set : {title:title, description:description,lastUpdatedDate:lastUpdatedDate} })//in Mongo Cloud name is specified as User for DB
            }
            
            return addBlog;
        } catch (error) {
            console.log(error);
            throw 'error DB query'
        }  
    }

    static async getBlogsForUser(user_id){
        const db=getDb();
        const collectionName='Blog';
        const mongoQuery={user_id:new mongoDb.ObjectID(user_id)};
        const redisQuery={user_id:new mongoDb.ObjectID(user_id),collectionName:collectionName};
        var cacheValues=await findInCache(redisQuery);
        if(cacheValues){
            console.log('fetch from cache DB');
            return JSON.parse(cacheValues);
        } else{
            try {
                console.log('fetch from mongo DB');
                const getBlogs= await db.collection(collectionName).find(mongoQuery).toArray()//in Mongo Cloud name is specified as User for DB
                await addToCache(redisQuery,getBlogs);
                return getBlogs;
            } catch (error) {
                console.log(error);
                throw 'error DB query'
            }  
        }
    }

    static async getAllBlogs(user_id){
        const db=getDb();
        const collectionName='Blog';
            try {
                console.log('fetch from mongo DB');
                const getBlogs= await db.collection(collectionName).find({}).toArray()//in Mongo Cloud name is specified as User for DB
                return getBlogs;
            } catch (error) {
                console.log(error);
                throw 'error DB query'
            }  
    }

    static async deleteBlog(blog_id,user_id){
        const db=getDb();
        var object_Id=new mongoDb.ObjectID(blog_id);
        user_id=new mongoDb.ObjectID(user_id);
        try {
            const collectionName='Blog';
            var key={user_id:user_id, collectionName:collectionName};
            await deleteFromCache(key);
            const addBlog= await db.collection('Blog').deleteOne({_id:object_Id})//in Mongo Cloud name is specified as User for DB
            return addBlog;
        } catch (error) {
            console.log(error);
            throw 'error DB query'
        }  
    }
}

module.exports=Blog;