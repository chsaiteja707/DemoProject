require('dotenv').config();
const fs=require('fs');
const path=require('path')
const express=require('express');
const session=require('express-session');
const multer=require('multer');
const mongoConnect=require('./util/db').mongoConnect;
const compression=require('compression');
const morgan=require('morgan');

const appRoutes=require('./routes/appRoutes');
const authRoutes=require('./routes/authRoutes');
const multerHanlder=require('./util/multerHandler');
const accessLog=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'}); //flags a referers to append the file

const app=express();

app.set('view engine', 'ejs');
app.set('views','views');

app.use(compression());
app.use(morgan('combined',{stream:accessLog}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(multer({storage:multerHanlder.fileStorage,fileFilter:multerHanlder.fileFilter}).single('image'))
app.use(express.static(__dirname+'/public'));
app.use('/images',express.static(__dirname+'/images'));
app.use(session({secret:"secsession",resave:false,saveUninitialized:false}));

app.use(appRoutes);
app.use(authRoutes);

app.get('*',(req,res,next)=>{
    res.render('404');
})

try {
    mongoConnect(()=>{
        console.log('connected to cloud db');
        app.listen(process.env.APPLICATION_PORT||3000,()=>{
            console.log('listening on '+process.env.APPLICATION_PORT||3000)
        })
    })
} catch (error) {
    console.log(error);
}


