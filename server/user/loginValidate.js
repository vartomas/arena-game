const registerValidate = async (req, res, next) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).json({ success: false, message: 'Please fill all fields' })
  let message = ''
  if (req.body.username.length < 4 || req.body.username.length > 20)
    message += 'username must be from 4 chars to 20, '
  if (req.body.password.length < 4 || req.body.password.length > 20)
    message += 'password must be from 4 to 20 chars, '
  if (!/\d/.test(req.body.password)) message += 'password must contain a number, '
  // capitalize first letter
  message = message.charAt(0).toUpperCase() + message.slice(1)
  // cut comma in end
  message = message.substring(0, message.length - 2)
  if (message) {
    return res.status(400).json({ success: false, message: message })
  } else {
    next()
  }
}

module.exports = registerValidate
