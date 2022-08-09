"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatepassword = exports.resetPassword = exports.forgotPassword = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const uuid_1 = __importDefault(require("uuid"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const forgot_password_1 = __importDefault(require("../models/forgot-password"));
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log(email);
        const user = yield user_1.default.findOne({ where: { email } });
        if (user) {
            const id = uuid_1.default.v4();
            user.createForgotpassword({ id, active: true })
                .catch((err) => {
                throw new Error(err);
            });
            mail_1.default.setApiKey(process.env.SENGRID_API_KEY);
            const msg = {
                to: email,
                from: 'abc@gmail.com',
                subject: 'sending with sendgrid',
                text: 'password reset mail',
                html: `<a href='http://localhost:3000/reset-password/${id}'>Reset Password</a>`
            };
            mail_1.default.send(msg).then((response) => {
                return res.status(response[0].statusCode).json({ message: 'link to password reset sent to mail', success: true });
            }).catch((err) => {
                throw new Error(err);
            });
        }
        else {
            throw new Error('user does not exist');
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ message: err, success: false });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => {
    const { id } = req.params;
    forgot_password_1.default.findOne({ where: { id } }).then((forgotpasswordreq) => {
        if (forgotpasswordreq) {
            forgotpasswordreq.update({ active: false });
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
            </html>`);
            res.end();
        }
    });
};
exports.resetPassword = resetPassword;
const updatepassword = (req, res) => {
    try {
        const { newPass } = req.query;
        console.log(newPass);
        const { resetPassId } = req.params;
        console.log(resetPassId);
        forgot_password_1.default.findOne({ where: { id: resetPassId } }).then((resetpasswordreq) => {
            user_1.default.findOne({ where: { id: resetpasswordreq.userId } }).then((user) => {
                if (user) {
                    const saltRounds = 10;
                    bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt_1.default.hash(newPass, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfully updated the new password' });
                            });
                        });
                    });
                }
                else {
                    return res.status(404).json({ error: 'No user exists', success: false });
                }
            });
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'No user exists', success: false });
    }
};
exports.updatepassword = updatepassword;
