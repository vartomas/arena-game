import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './LoginForm.module.scss'
import logoImg from '../assets/logo.png'
import Button from '../components/Button'
import u from '../utilities/u'

import { userContext } from '../App'

const LoginForm = () => {
  const [user, setUser] = useContext(userContext)
  const [loginInputs, setLoginInputs] = useState(initLogin)
  const [registerInputs, setRegisterInputs] = useState(initRegister)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [view, setView] = useState('login')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const history = useHistory()

  useEffect(() => {
    if (user) history.push('/')
  }, [user, history])

  const handleLoginInputs = e => {
    setLoginInputs(prev => {
      return { ...loginInputs, [e.target.name]: e.target.value }
    })
  }

  const handleRegisterInputs = e => {
    setRegisterInputs(prev => {
      return { ...registerInputs, [e.target.name]: e.target.value }
    })
  }

  const handleLoginSubmit = async e => {
    e.preventDefault()
    setLoginError('')
    const res = await u.login({ ...loginInputs })
    if (res.success) {
      setUser(res.user)
      setLoginInputs(initLogin)
      history.push('/')
    } else {
      setLoginError(res.message)
    }
  }

  const handleRegisterSubmit = async e => {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess(false)
    const res = await u.register({ ...registerInputs })
    if (res.success) {
      setRegisterSuccess(true)
      setView('login')
      setRegisterInputs(initRegister)
    } else {
      setRegisterError(res.message)
    }
  }

  const loginForm = (
    <form
      onSubmit={handleLoginSubmit}
      className={styles.form}
      style={
        view === 'register' ? { transform: 'translateX(-100%)' } : { transform: 'translateX(0)' }
      }
    >
      <h1>Login</h1>
      <h2 className={styles.regSuccess}>{registerSuccess && 'Register success'}</h2>
      <div className={styles.inputContainer}>
        <label htmlFor='loginUsernameInput'>Username</label>
        <input
          type='text'
          id='loginUsernameInput'
          name='username'
          value={loginInputs.username}
          onChange={handleLoginInputs}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='passwordInput'>Password</label>
        <input
          type='password'
          id='passwordInput'
          name='password'
          value={loginInputs.password}
          onChange={handleLoginInputs}
        />
      </div>
      <p className={styles.error}>{loginError}</p>
      <div onClick={handleLoginSubmit}>
        <Button text={'Login'} />
      </div>
      <input type='submit' hidden />
      <div className={styles.grow}></div>
      <p className={styles.switch}>
        Don't have account? <span onClick={() => setView('register')}>Register</span>
      </p>
    </form>
  )

  const registerForm = (
    <form
      onSubmit={handleRegisterSubmit}
      className={styles.form}
      style={
        view === 'register' ? { transform: 'translateX(-100%)' } : { transform: 'translateX(0)' }
      }
    >
      <h1>Register</h1>
      <div className={styles.inputContainer}>
        <label htmlFor='registerUsernameInput'>Username</label>
        <input
          type='text'
          id='registerUsernameInput'
          name='username'
          value={registerInputs.username}
          onChange={handleRegisterInputs}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='passwordOneInput'>Password</label>
        <input
          type='password'
          id='passwordOneInput'
          name='passwordOne'
          value={registerInputs.passwordOne}
          onChange={handleRegisterInputs}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='passwordTwoInput'>Repeat password</label>
        <input
          type='password'
          id='passwordTwoInput'
          name='passwordTwo'
          value={registerInputs.passwordTwo}
          onChange={handleRegisterInputs}
        />
      </div>
      <p className={styles.error}>{registerError}</p>
      <div onClick={handleRegisterSubmit}>
        <Button text={'Register'} />
      </div>
      <input type='submit' hidden />
      <div className={styles.grow}></div>
      <p className={styles.switch}>
        Already have account? <span onClick={() => setView('login')}>Login</span>
      </p>
    </form>
  )

  return (
    <div className={styles.root}>
      <img className={styles.logo} src={logoImg} alt='' />
      <div className={styles.formContainer}>
        {loginForm}
        {registerForm}
      </div>
    </div>
  )
}

export default LoginForm

const initLogin = {
  username: '',
  password: '',
}

const initRegister = {
  username: '',
  passwordOne: '',
  passwordTwo: '',
}
