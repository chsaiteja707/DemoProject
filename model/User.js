const mongoDb=require('mongodb');
const getDb=require('../util/db').getDb;

class User{
    constructor(){

    }

    static async getUsersByUserEmail(userId){
        const db=getDb();
        try {
            const getUser= await db.collection('Users').findOne({email:userId})//in Mongo Cloud name is specified as User for DB
            return getUser;
        } catch (error) {
            throw 'error DB query'
        }   
    }

    static async createNewUser(email,userName,password,image){
        const db=getDb();
        try {
            const createUser=await db.collection('Users').insertOne({email:email,username:userName,password:password,image:image});
            return createUser;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByEmail(email){
        const db=getDb();
        try {
            const result=await db.collection('Users').findOne({email:email});
            return result;
        } catch (error) {
            throw 'error'
        }
    }
}

module.exports=User;