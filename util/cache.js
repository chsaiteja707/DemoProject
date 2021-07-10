const redis=require('redis');
const util=require('util');
const url=process.env.REDIS_CLIENT_URL;
const client=redis.createClient(url);
client.get = util.promisify(client.get);

const findInCache=async (queryString)=>{
    console.log(queryString);
    var cacheKey=JSON.stringify(queryString || 'default');
    try {
        var cacheValue=await client.get(cacheKey);
        if(cacheValue){
            console.log('found cache Value for : '+cacheKey);
            return cacheValue;
        } else{
            console.log('unable to find cache value');
            return false;
        }
    } catch (error) {
        console.log(error);
    }
    
}

const addToCache=async (queryString, value)=>{
    try {
        console.log('adding to cache ...');
        await client.set(JSON.stringify(queryString),JSON.stringify(value));
        console.log('added ...')
        return;
    } catch (error) {
        console.log(error);
    }
    
}

const deleteFromCache=async (hashKey)=>{
    try {
        console.log('in clearCache '+hashKey);
        hashKey=JSON.stringify(hashKey);    
        await client.del(hashKey);
        console.log('deleting...');
        const key=await client.get(hashKey);
        console.log("after deletion : "+key);
        return;
    } catch (error) {
        console.log(error);
    }
    
}

exports.findInCache=findInCache;
exports.addToCache=addToCache;
exports.deleteFromCache=deleteFromCache;


