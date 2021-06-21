import { useContext, useState, useRef } from 'react'
import styles from './Game.module.scss'
import shopIcon from '../assets/shop.png'
import inventoryIcon from '../assets/inventory.png'
import arenaIcon from '../assets/arena.png'
import leaderboardIcon from '../assets/leaderboard.png'
import Button from './Button'
import LogoutBtn from './LogoutBtn'
import { Link } from 'react-router-dom'
import healthIcon from '../assets/health.png'
import goldIcon from '../assets/gold.png'
import u from '../utilities/u'

import { userContext } from '../App'

const Game = () => {
  const [user, setUser] = useContext(userContext)
  const [changeUsernameDialog, setChangeUsernameDialog] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [error, setError] = useState('')
  const input = useRef(null)

  const updateProfileImg = async e => {
    const formData = new FormData()
    formData.append('image', e.target.files[0])
    const res = await u.changeProfilePic(formData)
    if (res.success) {
      setUser(prev => {
        return { ...prev, image: res.url }
      })
    }
  }

  const handleDialog = () => {
    setNewUsername(user.username)
    setChangeUsernameDialog(true)
  }

  const saveUsername = async () => {
    if (newUsername.length < 4 || newUsername.length > 20)
      return setError('Username must be from 4 chars to 20')
    const res = await u.updateUsername(newUsername)
    if (res.success) {
      setUser(prev => {
        setChangeUsernameDialog(false)
        return { ...prev, username: newUsername }
      })
    } else {
      setError(res.message)
    }
  }

  return (
    <div className={styles.root}>
      {user && (
        <div className={styles.playerinfo}>
          <div className={styles.player}>
            <div
              className={styles.avatar}
              style={{ backgroundImage: `url(${user.image})` }}
              onClick={() => input.current.click()}
            >
              <input
                className={styles.fileinput}
                type='file'
                onChange={updateProfileImg}
                ref={input}
              />
            </div>
            <h2 className={styles.username} onClick={handleDialog}>
              {user.username}
            </h2>
          </div>
          <div className={styles.stats}>
            <img className={styles.icon} src={healthIcon} alt='' />
            <p>{user.hp}</p>
            <img className={styles.icon} src={goldIcon} alt='' />
            <p>{user.gold}</p>
            <LogoutBtn />
          </div>
        </div>
      )}
      <div className={styles.linkContainer}>
        <img className={styles.img} src={shopIcon} alt='' />
        <Link to='/shop'>
          <Button text={'Shop'} />
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <img className={styles.img} src={inventoryIcon} alt='' />
        <Link to='/inventory'>
          <Button text={'Inventory'} />
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <img className={styles.img} src={arenaIcon} alt='' />
        <Link to='/arena'>
          <Button text={'Arena'} />
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <img className={styles.img} src={leaderboardIcon} alt='' />
        <Link to='/leaderboard'>
          <Button text={'Leaders'} />
        </Link>
      </div>
      {changeUsernameDialog && (
        <div className={styles.changeUsernameDialog}>
          <h2>Change username</h2>
          <input
            className={styles.usernameinput}
            type='text'
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
          <h3 className={styles.error}>{error}</h3>
          <div className={styles.savebtn} onClick={saveUsername}>
            <Button text={'Save'} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
