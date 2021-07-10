const nodeMailer=require('nodemailer');

const sendEmail = async (emailData)=>{
    var mailTransport=nodeMailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.EMAIL_ID,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    var mailDetails={
        from:process.env.EMAIL_FROM,
        to:emailData.emailToSend,
        subject:emailData.emailSubject,
        text:emailData.emailText
    }

    try {
        await mailTransport.sendMail(mailDetails,(err,data)=>{
            if(err){
                return false;
            }else{
                return true;
            }
        })
    } catch (error) {
        return false;
    }
    

}

exports.sendEmail=sendEmail;