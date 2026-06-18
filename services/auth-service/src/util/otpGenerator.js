
const nodemailer = require("nodemailer");


async function generateOtp(req,email){
         
    const otp = Math.floor(100000 + Math.random()*900000).toString();

     const otpExpiry = Date.now() + 60 * 5000; // 5 minute expiry
      
     req.otp = otp;
     req.otpExpiry = otpExpiry;
console.log("OTP:",otp);
     return await sendVerificationEmail(email,otp)
  
}

async function sendVerificationEmail(email,otp){
    try {
         
        const transporter =nodemailer.createTransport({

            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                 user:process.env.NODEMAILER_EMAIL,
                 pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({

            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"verify your Accound for BookMyVenue",
            text:`Your OTP is ${otp}`,
            html:`<b> Your OTP ${otp} <b>`,

        })

        return info.accepted.length>0

    } catch (error) {
        throw new Error('ERROR occured in sending email: ' +error.message);
        console.error("Error sending email",error);
        return false;
    }
}


module.exports = generateOtp;
        
           
        