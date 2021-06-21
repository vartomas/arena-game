const router = require('express').Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })
const userController = require('../user/userController')
const auth = require('../user/auth')
const registerValidate = require('../user/registerValidate')
const loginValidate = require('../user/loginValidate')

router.post('/register', registerValidate, userController.register)
router.post('/login', loginValidate, userController.login)
router.post('/logout', auth, userController.logout)
router.post('/check', auth)
router.patch('/image', auth, upload.single('image'), userController.changeProfilePic)
router.patch('/update', auth, userController.update)
router.patch('/username', auth, userController.updateUsername)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getUser)

module.exports = router
