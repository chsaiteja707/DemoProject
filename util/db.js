const mongo=require('mongodb').MongoClient;

let db;

const mongoConnect=callback=>{
    mongo.connect(process.env.MONGO_CLOUD_URL,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(client=>{
            db=client.db();
            callback()
        })
        .catch(err=>{
            console.log(err);
        })
}

const getDb=()=>{
    if(db){
        return db;
    }else{
        throw 'no db found'
    }
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;