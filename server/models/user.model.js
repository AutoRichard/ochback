import mongoose from 'mongoose'
import crypto from 'crypto'
import { isInteger } from 'lodash'
const UserSchema = new mongoose.Schema({
  creditBalance: {
    type: Number,
    default: 0
  },
  userStatus: {
    type: Number,
    default: 1
  },
  firstName: {
    type: String,
    trim: true,
    required: 'First Name is required'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'Last Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  link1: {
    type: String,
    trim: true,
    required: 'Link is required'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  link2: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipcode: {
    type: String,
    trim: true
  },
  suspend: {
    type: Boolean,
    default: false
  },
  approve: {
    type: Boolean,
    default: false
  },
  about: {
    type: String,
    trim: true,
    required: 'About is required'
  },
  displayName: {
    type: String,
    trim: true,
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  hashed_password: {
    type: String,
    required: "Password is required"
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
