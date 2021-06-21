import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './UserInfo.module.scss'
import u from '../utilities/u'
import goldIcon from '../assets/gold.png'
import healthIcon from '../assets/health.png'
import Item from '../components/Item'
import Button from '../components/Button'
import items from '../utilities/items'

const UserInfo = ({ id }) => {
  const [user, setuser] = useState(null)
  const [error, setError] = useState('')
  const [inventory, setInventory] = useState(null)

  useEffect(() => {
    const get = async () => {
      const data = await u.getUser(id)
      if (data.success) {
        setuser(data.user)
      } else {
        setError(data.message)
      }
    }
    get()
  }, [id])

  useEffect(() => {
    if (user) {
      const inv = items.map(e => {
        return {
          ...e,
          count: user.inventory.filter(i => i.name === e.name).length,
        }
      })
      setInventory(inv)
    }
  }, [user])

  return (
    <div className={styles.root}>
      {error && <h2>{error}</h2>}
      {user && (
        <div className={styles.userinfo}>
          <h1>{user.username}</h1>
          <img className={styles.image} src={user.image} alt='' />
          <div className={styles.info}>
            <img className={styles.icon} src={healthIcon} alt='' />
            <h2>{user.hp}</h2>
            <img className={styles.icon} src={goldIcon} alt='' />
            <h2>{user.gold}</h2>
          </div>
          <h2>Inventory</h2>
          <div className={styles.inventory}>
            {inventory && inventory.filter(e => e.count !== 0).length === 0 && (
              <h3>User has no items</h3>
            )}
            {inventory &&
              inventory.map(
                e =>
                  e.count > 0 && (
                    <div className={styles.invitem} key={e.name}>
                      <Item item={e} count={e.count === 1 ? null : e.count} />
                    </div>
                  )
              )}
          </div>
        </div>
      )}
      <div className={styles.backBtnContainer}>
        <Link to='/leaderboard'>
          <Button text={'<<Back'} />
        </Link>
      </div>
    </div>
  )
}

export default UserInfo
