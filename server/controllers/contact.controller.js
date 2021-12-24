import Contact from '../models/contact.model'
import _, { identity } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

const EMAIL = "ajibolarichardson96@yahoo.com"
const PASSWORD = "gsejgmlkuudexakt"


let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "OCHIT",
        link: "https://ochfront.herokuapp.com/"
    },
});


const create = (req, res) => {


    const contact = new Contact(req.body);

    contact.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }

        let messages = ' Name: ' + req.body.name + '<br/> Email: ' + req.body.email + '<br/>Phone Number: ' + req.body.phoneNumber + '<br/> Message:' + req.body.text;

        let response = {
            body: {
                name: 'OCHIT',
                intro: messages,
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: EMAIL,
            to: 'larshalvorj@gmail.com',
            subject: "Contact Support",
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                res.status(200).json(result)
            })
            .catch((error) => console.error(error));


        
    });
}

const listContactById = (req, res, next, id) => {

    Contact.findById(id)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            req.details = result;
            next();
        });
}

const list = (req, res) => {
    Contact.find((err, contact) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(contact);
    })
}


const read = (req, res) => {
    return res.json(req.details);
}

const remove = (req, res, next) => {
    let contact = req.details;
    contact.remove((err, deletedContact) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedNews);
    })
}

export default {
    create,
    listContactById,
    read,
    list,
    remove
}