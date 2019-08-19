'use strict';
const nodemailer = require('nodemailer');
var sanitizeHtml = require('sanitize-html');
const email = require('../configs/config');
const state = require('../util/State');

// async..await is not allowed in global scope, must use a wrapper
async function EnviaEmail(tituloEmail,menssagem) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(email);
    console.log(sanitizeHtml(menssagem));
    // send mail with defined transport object
    let emailsTo = await state.load('./src/configs/listaEmails.json');
    let info = await transporter.sendMail({
        from: '"CHAPPIE" <informatica@tvriosul.com.br>', // sender address
        to: emailsTo.listaDeEmail.join(','), // list of receivers
        subject: tituloEmail, // Subject line
        text: sanitizeHtml(menssagem), // plain text body
        html: menssagem // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = EnviaEmail