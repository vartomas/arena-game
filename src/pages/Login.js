import styles from './Login.module.scss'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <div className={styles.root}>
      <LoginForm />
    </div>
  )
}

export default Login
