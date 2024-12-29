const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from) => {
    // Create a transporter object using SMTP configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASS,
            },
    })

    // Define the email options
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    // Send the email using the transporter
    await transporter.sendMail(options); // Await the sendMail promise to ensure the email is sent
};

module.exports = sendEmail;