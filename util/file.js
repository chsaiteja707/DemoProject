const fs=require('fs');

const deleteFile=(filePath)=>{
    fs.unlink(filePath,(err)=>{
        if(err){
            return 'failed ddleting file'
        }else{
            return 'file deleted'
        }
    });
}

exports.deleteFile= deleteFile;