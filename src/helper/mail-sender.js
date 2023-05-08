import { createTransport } from "nodemailer";
import config from "../config/index.js";

function mailSender(toArr, subject, html) {
    const transporter = createTransport({
        service: config.mailService,
        auth: {
            user: config.smtpMail,
            pass: config.smtpPass,
        },
    });

    toArr.forEach((to) => {
        transporter.sendMail(
            {
                from: '"Fred Foo 👻" <foo@example.com>',
                to,
                subject,
                html,
            },
            (err) => {
                if (err) {
   
                }
            }
        );
    });
}

export default mailSender;
