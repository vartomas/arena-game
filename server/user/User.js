const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: [4, 'Username must be at least 4 chars long'],
    max: [20, 'Username max length is 20 chars'],
  },
  password: {
    type: String,
    required: true,
    min: [4, 'Password must be at least 8 chars long'],
    max: [20, 'Password max length is 20 chars'],
  },
  profileImgURL: String,
  hp: {
    type: Number,
    default: 100,
  },
  gold: {
    type: Number,
    default: 100,
  },
  inventory: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
    default: 'http://localhost:5000/uploads/default.jpg',
  },
  enemy: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  equippedWeapon: {
    type: Object,
    default: {
      type: 'weapon',
      name: 'Fist',
      damage: 1,
      image: 'http://localhost:5000/uploads/fist.png',
    },
  },
  equippedArmor: {
    type: Object,
    default: {
      type: 'armor',
      name: 'Underwear',
      defence: 0,
      image: 'http://localhost:5000/uploads/underwear.png',
    },
  },
  tokens: [
    {
      token: String,
    },
  ],
})

UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else next()
})

const User = mongoose.model('user', UserSchema)

module.exports = User
