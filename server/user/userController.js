const User = require('./User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const user = new User(req.body)
    const createdUser = await user.save()
    res.json({ success: true, message: 'User created', username: createdUser.username })
  } catch (e) {
    res.status(400).json(e.message)
  }
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user)
      return res.status(401).json({ success: false, message: 'Wrong username or password' })
    const confirm = await bcrypt.compare(req.body.password, user.password)
    const token = jwt.sign({ _id: user._id.toHexString() }, process.env.SECRET)
    user.tokens.push({ token })
    await user.save()
    if (confirm)
      res.header('token', token).json({
        success: true,
        user: {
          username: user.username,
          gold: user.gold,
          hp: user.hp,
          inventory: user.inventory,
          image: user.image,
          enemy: user.enemy,
          equippedWeapon: user.equippedWeapon,
          equippedArmor: user.equippedArmor,
        },
      })
    if (!confirm)
      return res.status(401).json({ success: false, message: 'Wrong username or password' })
  } catch (e) {
    res.status(401).json(e)
  }
}

const logout = async (req, res) => {
  const token = req.token
  const user = req.user
  try {
    await user.updateOne({
      $pull: {
        tokens: {
          token,
        },
      },
    })
    res.json({ success: true, message: 'Log out successful' })
  } catch (e) {
    res.status(400).json({ success: false, message: 'Log out failed' })
  }
}

const changeProfilePic = async (req, res) => {
  const user = req.user
  const newProfilePic = req.file.path
  const url = process.env.SERVER_URL + newProfilePic.replace('\\', '/')
  try {
    const updated = await User.findOneAndUpdate({ _id: user._id }, { image: url }, { new: true })
    if (!updated)
      return res.status(400).json({ success: false, message: 'Profile picture change failed' })
    res.json({ success: true, url: updated.image })
  } catch (e) {
    res.status(400).json({ success: false, message: 'Profile picture change failed' })
  }
}

const update = async (req, res) => {
  const user = req.user
  try {
    const updated = await User.findOneAndUpdate({ _id: user._id }, req.body, { new: true })
    if (!updated) return res.status(400).json({ success: false, message: 'update failed' })
    res.json({
      success: true,
      user: {
        username: updated.username,
        gold: updated.gold,
        hp: updated.hp,
        inventory: updated.inventory,
        image: updated.image,
        enemy: updated.enemy,
        equippedWeapon: updated.equippedWeapon,
        equippedArmor: updated.equippedArmor,
      },
    })
  } catch (e) {
    res.status(400).json({ success: false, message: 'update failed' })
  }
}

const updateUsername = async (req, res) => {
  const user = req.user
  try {
    const updated = await User.findOneAndUpdate({ _id: user._id }, req.body, { new: true })
    if (!updated)
      return res.status(400).json({ success: false, message: 'Username already exists' })
    res.json({
      success: true,
    })
  } catch (e) {
    res.status(400).json({ success: false, message: 'Username already exists' })
  }
}

const getUsers = async (req, res) => {
  try {
    let users = await User.find()
    if (!users) return res.json({ success: false, message: 'No users found' })
    users = users.map(e => {
      return {
        username: e.username,
        gold: e.gold,
        _id: e._id,
      }
    })
    res.json({ success: true, users: users })
  } catch (e) {
    res.status(400).json({ success: false, message: 'Getting users failed' })
  }
}

const getUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id })
    if (!user) res.status(400).json({ success: false, message: 'No such user found' })
    const formatted = {
      username: user.username,
      hp: user.hp,
      gold: user.gold,
      inventory: user.inventory,
      image: user.image,
    }
    res.json({ success: true, user: formatted })
  } catch (e) {
    res.status(400).json({ success: false, message: 'No such user found' })
  }
}

module.exports = {
  register,
  login,
  logout,
  changeProfilePic,
  update,
  getUsers,
  getUser,
  updateUsername,
}
