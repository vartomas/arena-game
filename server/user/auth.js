const jwt = require('jsonwebtoken')
const User = require('./User')

const auth = async (req, res, next) => {
  const token = req.header('token')
  const check = req.body.check

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })
    if (check)
      return res.json({
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
    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).json(e)
  }
}

module.exports = auth
