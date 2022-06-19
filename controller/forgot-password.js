const sgMail = require('@sendgrid/mail');

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body;
        console.log(email);
        
        sgMail.setApiKey(process.env.SENGRID_API_KEY)

        const msg = {
            to: email,
            from: 'abc@gmail.com',
            subject: 'sending with sendgrid',
            text: 'password reset mail'
        }

        sgMail.send(msg).then(response => {
            return res.status(response[0].statusCode).json({message: 'link to password reset sent to mail', success: true})
        })
    } catch(err) {
        console.log(err);
        return res.json({message: err, success: false})
    }
    
}