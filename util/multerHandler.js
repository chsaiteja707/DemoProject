const multer=require('multer');

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },    
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+file.originalname)
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpeg'||file.mimetype==='image/jpg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
    
}

exports.fileStorage=fileStorage;
exports.fileFilter=fileFilter;