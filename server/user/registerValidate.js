const User = require('./User')

const registerValidate = async (req, res, next) => {
  const findDuplicate = await User.findOne({ username: req.body.username })
  if (findDuplicate)
    return res.status(400).json({ success: false, message: 'Username already taken' })
  if (!req.body.username || !req.body.passwordOne || !req.body.passwordTwo)
    return res.status(400).json({ success: false, message: 'Please fill all fields' })
  let message = ''
  if (req.body.username.length < 4 || req.body.username.length > 20)
    message += 'username must be from 4 chars to 20, '
  if (req.body.passwordOne.length < 4 || req.body.passwordOne.length > 20)
    message += 'password must be from 4 to 20 chars, '
  if (!/\d/.test(req.body.passwordOne)) message += 'password must contain a number, '
  if (req.body.passwordOne !== req.body.passwordTwo) message += 'passwords must match, '
  // capitalize first letter
  message = message.charAt(0).toUpperCase() + message.slice(1)
  // cut comma in end
  message = message.substring(0, message.length - 2)
  if (message) {
    return res.status(400).json({ success: false, message: message })
  } else {
    req.body.password = req.body.passwordOne
    next()
  }
}

module.exports = registerValidate
