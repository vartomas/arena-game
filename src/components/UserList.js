import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from './UserList.module.scss'
import goldIcon from '../assets/gold.png'
import Button from './Button'

import u from '../utilities/u'

import { userContext } from '../App'

const UserList = () => {
  const [users, setUsers] = useState(null)
  const [user] = useContext(userContext)

  useEffect(() => {
    const get = async () => {
      const data = await u.getUsers()
      if (data.success) {
        data.users.sort((a, b) => b.gold - a.gold)
        setUsers(data.users)
      }
    }
    get()
  }, [user])

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>Leader board</h1>
      {!users && <h2>No users found</h2>}
      {users &&
        users.map(e => (
          <Link to={`/user/${e._id}`} key={e.username}>
            <div className={styles.usercontainer}>
              <h2>{e.username}</h2>
              <div className={styles.gold}>
                <img className={styles.goldicon} src={goldIcon} alt='' />
                <h2>{e.gold}</h2>
              </div>
            </div>
          </Link>
        ))}
      <div className={styles.backBtnContainer}>
        <Link to='/'>
          <Button text={'<<Back'} />
        </Link>
      </div>
    </div>
  )
}

export default UserList
