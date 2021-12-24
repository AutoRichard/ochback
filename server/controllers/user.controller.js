import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable';
import fs from 'fs';
import profileImage from './assets/profile_image.png';
import stripe from 'stripe';
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import crypto from 'crypto'


const myStripe = stripe('sk_test_PwsYlYVaGdzKF04GmfzbMQcB00yNVUnDBz')
//const { EMAIL, PASSWORD, MAIN_URL } = require('./../../config/config')
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
  const user = new User(req.body)
  user.save((err, result) => {
    if (err) {
      console.log(errorHandler.getErrorMessage(err))
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json({
      message: "Successfully signed up!"
    })
  })
}

const userByID = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id email displayName firstName lastName updated created')
    .populate('followers', '_id email displayName firstName lastName updated created')
    .exec((err, user) => {
      if (err || !user)
        return res.status('400').json({
          error: "User not found"
        })
      req.profile = user

      next()
    })
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  req.profile.photo = undefined
  return res.json(req.profile)
}

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).populate('following', '_id firstName')
    .populate('followers', '_id firstName')
    .select('name email displayName firstName lastName updated created userStatus creditBalance approve suspend following followers resetPasswordToken resetPasswordExpires')
}

const findFollow = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)

  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).populate('following', '_id firstName')
    .populate('followers', '_id firstName')
    .select('name email displayName firstName lastName updated created userStatus creditBalance approve suspend following followers')
}

const update = (req, res, next) => {
  let user = req.profile
  user = _.extend(user, req.body)
  user.updated = Date.now()
  let name = user.firstName + ' ' + user.lastName

  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }


    user.hashed_password = undefined
    user.salt = undefined
    user.photo = undefined
    let userEmail = user.email

    if (req.body.approve != undefined) {
      if (req.body.approve == true) {
        let response = {
          body: {
            name,
            intro: "Welcome to OCHIT Academy! We're very excited to have you on board.",
          },
        };

        let mail = MailGenerator.generate(response);

        let message = {
          from: '"OC HIT REGISTRATION COMPLETE" <ajibolarichardson96@yahoo.com>',
          to: userEmail,
          subject: "REGISTRATION COMPLETE",
          html: mail,
        };

        transporter
          .sendMail(message)
          .then(() => {
            res.json(user)
          })
          .catch((error) => console.error(error));
      } else {
        res.json(user)
      }
    } else {
      res.json(user)
    }

  })
}

const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}

const password = (req, res, next) => {
  let user = req.profile

  User.findOne({
    "email": user.email
  }, (err, user) => {

    if (!user.authenticate(req.body.oldPassword)) {
      return res.status('401').send({
        error: "OLD PASSWORD IS NOT CORRECT"
      })
    }

    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save((err) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      user.hashed_password = undefined
      user.salt = undefined
      res.status(200).json({
        message: "password changed!"
      })
    })
  })
}

const image = (req, res, next) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image update failed"
      });
    }

    var user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
}

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
}

const payout = (req, res) => {
  //console.log("stripe-routes.js 9 | route reached", req.body);
  let { amount, id, credit, user } = req.body;
  //console.log("stripe-routes.js 10 | amount and id", amount, id); 

  try {
    const payment = myStripe.paymentIntents.create({
      amount: amount * 100,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    //console.log("stripe-routes.js 19 | payment", payment);

    User.findById(user)
      .exec((err, _user) => {
        if (err || !_user) {
          return res.status('400').json({
            error: "User not found"
          });
        }
        let credit = { creditBalance: req.body.amount + _user.creditBalance }
        _user = _.extend(_user, credit);
        _user.save((err) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          res.json({
            message: "Payment Successful",
            success: true,
          });
        });
      });

  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
}


const addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    next()
  })
}

const addFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    })
}

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    next()
  })
}


const removeFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    })
}

const resetEmailPassword = (req, res) => {

  User.findOne({
    "email": req.body.email
  }, (err, user) => {

    if (err || !user)
      return res.status('401').json({
        error: "User not found"
      })

    const token = crypto.randomBytes(20).toString('hex')

    let userUpdate = {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + (2 * 60 * 60 * 1000)
    }
    user = _.extend(user, userUpdate)

    let name = user.firstName + ' ' + user.lastName
    let userEmail = user.email

    user.save((err) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }


      let response = {
        body: {
          name,
          intro: "You are receiving this because you (or someone else) have request the reset of the password  for your account. \n\n"
            + "Please click on the following link or paste this into your browser to complete the process within one hour of receiving it:\n\n"
            + `https://ochfront.herokuapp.com/reset/${token}\n\n`
            + 'If you did not request this, pls ignore this email and your password will remain unchanged.\n\n'
        },
      };

      let mail = MailGenerator.generate(response);

      let message = {
        from: '"OC HIT RESET PASWORD" <ajibolarichardson96@yahoo.com>',
        to: userEmail,
        subject: "RESET PASWORD",
        html: mail,
      };

      transporter
        .sendMail(message)
        .then(() => {
          res.json('recovery email sent')
        })
        .catch((error) => {
          res.json(error)
          console.error(error)
        });
    })


  })
}

const resetPassword = (req, res) => {
  let email = req.body.email
  let token = req.body.token
  let _password = req.body.password

  User.findOne({
    "email": email,
    "resetPasswordToken": token,
    "resetPasswordExpires": {
      $gt: Date.now()
    }
  }).exec(function (err, user) {

    if (err || !user)
      return res.status('401').json({
        error: "Password reset link is invalid or expired"
      })

    let userUpdate = {
      resetPasswordToken: null,
      resetPasswordExpires: null,
      password: _password
    }

    console.log(userUpdate)

    user = _.extend(user, userUpdate)

    user.save((err) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }


      res.json("Password Updated")
    })


  })

}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  password,
  image,
  photo,
  defaultPhoto,
  payout,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
  findFollow,
  resetEmailPassword,
  resetPassword
}
