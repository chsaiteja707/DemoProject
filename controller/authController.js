const User=require('../model/User');
const bcrypt=require('bcrypt');
const emailTask=require('../util/emailTask');

exports.renderLoginPage=(req,res,next)=>{
    res.render('login',{passwordError:false,userNotFound:false});
}

exports.renderSignUpPage=(req,res,next)=>{
    res.render('signup',{alreadyExist:false});
}

exports.loginHandler=async (req,res,next)=>{
    try {
        console.log(' I am here');
        const {email,password}=req.body;
        const user=await User.getUserByEmail(email);
        console.log(user);
        if(!user){
            res.render('login',{userNotFound:true,passwordError:false});
        }else{
            const comparePassword=await bcrypt.compare(password,user.password);
            if(comparePassword){
                req.session.userEmail=user.email;
                req.session.user_id=user._id.toString();
                console.log('success');
                res.redirect('/');
            }else{
                res.render('login',{passwordError:true,userNotFound:false});
            }
        }
    } catch (error) {
        res.render('404');
    }
}

exports.signUpHandler=async (req,res,next)=>{
    try {
        console.log(req.body);
        var {password,email,username}=req.body;
        const user=await User.getUserByEmail(email);
        if(user){
            res.render('signup',{alreadyExist:true});
        }else{
            password=await bcrypt.hash(password,12);
            const createUser=await User.createNewUser(email,username,password);
            var emailData={
                emailText:'Hello, Welcome to Blogger app',
                emailToSend:email,
                emailSubject:'Welcome to Blogger App'
            }
            await emailTask.sendEmail(emailData);
            res.render('login',{passwordError:false,userNotFound:false});
            
        }
        
    } catch (error) {
        res.render('404');
    }
}

exports.logoutController=(req,res,next)=>{
    req.session.user_id=null;
    req.session.destroy();
    res.redirect('/');
}

