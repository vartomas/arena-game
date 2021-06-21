import styles from './LeaderBoard.module.scss'
import UserList from '../components/UserList'

const LeaderBoard = () => {
  return (
    <div className={styles.root}>
      <UserList />
    </div>
  )
}

export default LeaderBoard
