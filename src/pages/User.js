import styles from './User.module.scss'
import { useParams } from 'react-router-dom'
import UserInfo from '../components/UserInfo'

const User = () => {
  const { id } = useParams()
  return (
    <div className={styles.root}>
      <UserInfo id={id} />
    </div>
  )
}

export default User
