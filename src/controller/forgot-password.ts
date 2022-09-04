import sgMail from '@sendgrid/mail';
import uuid from 'uuid';
import bcrypt from 'bcrypt';

import User from '../models/user';
import ForgotPassword from '../models/forgot-password';

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        console.log(email);
        const user = await User.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            //@ts-ignore
            user.createForgotpassword({ id, active: true })
                .catch((err) => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY!)

            const msg = {
                to: email,
                from: 'abc@gmail.com',
                subject: 'sending with sendgrid',
                text: 'password reset mail',
                html: `<a href='http://localhost:3000/reset-password/${id}'>Reset Password</a>`
            }

            sgMail.send(msg).then((response) => {
                return res.status(response[0].statusCode).json({ message: 'link to password reset sent to mail', success: true })
            }).catch((err) => {
                throw new Error(err);
            })
        } else {
            throw new Error('user does not exist');
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: err, success: false })
    }
}

const resetPassword = (req, res) => {
    const {id} = req.params;
    ForgotPassword.findOne({where: {id}}).then((forgotpasswordreq) => {
        if (forgotpasswordreq) {
            forgotpasswordreq.update({active: false});
            res.status(200).send(`<html>
            <script>
            function formsubmitted(e) {
                e.preventDefault();
                console.log('called')
            }
            </script>
            <form action='/update-password/${id}' method='get'>
            <label for='newPass'>Enter New Password</label>
            <input name='newPass' type='password' required></input>
            <button>Reset Password</button>
            </form>
            </html>`)
            res.end()
        }
    })
}

const updatepassword = (req, res) => {
    try{
        const {newPass} = req.query;
        console.log(newPass);
        const {resetPassId} = req.params;
        console.log(resetPassId);
        ForgotPassword.findOne({where: {id: resetPassId}}).then((resetpasswordreq) => {
            //@ts-ignore
            User.findOne({where: {id: resetpasswordreq!.userId}}).then((user) => {
                if (user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if (err) {
                            console.log(err);
                            // throw new Error(err);
                        }
                        bcrypt.hash(newPass, salt, function(err, hash) {
                            if (err) {
                                console.log(err);
                                // throw new Error(err);
                            }
                            user.update({password: hash}).then(() => {
                                res.status(201).json({message: 'Successfully updated the new password'})
                            })
                        })
                    })
                } else {
                    return res.status(404).json({error: 'No user exists', success: false})
                }
            })
        })
    } catch(error) {
        return res.status(400).json({error: 'No user exists', success: false})
    }
}

export {forgotPassword, resetPassword, updatepassword};
