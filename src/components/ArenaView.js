import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from './ArenaView.module.scss'
import Button from './Button'
import Item from './Item'
import items from '../utilities/items'
import monsters from '../utilities/monsters'
import { userContext } from '../App'
import goldIcon from '../assets/gold.png'
import FloatingInfo from './FloatingInfo'

const ArenaView = () => {
  const [user, setUser] = useContext(userContext)
  const [openDialog, setOpenDialog] = useState(false)
  const [itemType, setItemType] = useState('')
  const [potions, setPotions] = useState([])
  const [deathDialogOpen, setDeathDialogOpen] = useState(false)
  const [timeouts, setTimeouts] = useState([])
  const [floatingText, setFloatingText] = useState(false)
  const [floatingContent, setFloatingContent] = useState({
    gold: '',
    playerDmg: '',
    enemyDmg: '',
    effect: '',
  })

  // sudarau potions sarasa
  useEffect(() => {
    if (user) {
      const pots = [items[6], items[7], items[8]]
      pots.forEach(e => (e.count = user.inventory.filter(i => i.name === e.name).length))
      setPotions(pots)
    }
  }, [user])

  // isimu equipped geara jeigu ji pardave
  useEffect(() => {
    if (user.inventory.filter(e => e.name === user.equippedWeapon.name).length === 0) {
      setUser(prev => {
        return { ...prev, equippedWeapon: fist }
      })
    }
    if (user.inventory.filter(e => e.name === user.equippedArmor.name).length === 0) {
      setUser(prev => {
        return { ...prev, equippedArmor: underwear }
      })
    }
  }, [setUser, user.equippedArmor, user.equippedWeapon, user.inventory])

  const handleDialog = type => {
    setItemType(type)
    setOpenDialog(true)
  }

  const closeDialog = () => {
    setItemType('')
    setOpenDialog(false)
  }

  const handleEquip = item => {
    const inventory = user.inventory
    if (item.type === 'potion') {
      const index = inventory.findIndex(e => e.name === item.name)
      inventory.splice(index, 1)
    }
    switch (item.type) {
      case 'weapon':
        setUser(prev => {
          return { ...prev, equippedWeapon: item }
        })
        break
      case 'armor':
        setUser(prev => {
          return { ...prev, equippedArmor: item }
        })
        break
      case 'potion':
        setUser(prev => {
          return {
            ...prev,
            hp: prev.hp + item.heals > 100 ? 100 : prev.hp + item.heals,
            inventory: inventory,
          }
        })
        break
      default:
        return
    }
    setItemType('')
    setOpenDialog(false)
  }

  const handleTurn = () => {
    let playerHealth = user.hp
    let enemyHealth = user.enemy.hp
    let playerDamage = Math.round(Math.random() * user.equippedWeapon.damage)
    let enemyDamage =
      Math.round(Math.random() * user.enemy.damage) -
      Math.round(Math.random() * user.equippedArmor.defence)
    enemyDamage = enemyDamage < 0 ? 0 : enemyDamage

    const chance = Math.random()
    setFloatingContent(prev => {
      return { ...prev, effect: '' }
    })
    switch (user.equippedWeapon.name) {
      case 'Sword':
        if (chance < 0.2) {
          setFloatingContent(prev => {
            return { ...prev, effect: 'Blocked!' }
          })
          enemyDamage = 0
        }
        break
      case 'Bow':
        if (chance < 0.3) {
          setFloatingContent(prev => {
            return { ...prev, effect: '2x dmg!' }
          })
          playerDamage *= 2
        }
        break
      case 'Magic wand':
        if (chance < 0.4) {
          setFloatingContent(prev => {
            return { ...prev, effect: 'Healed!' }
          })
          if (playerHealth + 10 > 100) {
            playerHealth = 100
          } else playerHealth += 10
        }
        break
      default:
        break
    }
    playerHealth -= enemyDamage
    enemyHealth -= playerDamage
    if (enemyHealth <= 0) {
      setUser(prev => {
        return {
          ...prev,
          hp: playerHealth,
          enemy: { ...monsters[Math.floor(Math.random() * monsters.length)], hp: 100 },
        }
      })
    } else {
      setUser(prev => {
        return { ...prev, hp: playerHealth, enemy: { ...user.enemy, hp: enemyHealth } }
      })
    }
    const goldIncome = Math.round(Math.random() * 10)
    triggerFloats(goldIncome, enemyDamage, playerDamage)
    setUser(prev => {
      return { ...prev, gold: prev.gold + goldIncome }
    })
    if (playerHealth <= 0) {
      setDeathDialogOpen(true)
      setUser(prev => {
        return {
          ...prev,
          hp: 100,
          gold: 100,
          inventory: [],
          equippedArmor: underwear,
          equippedWeapon: fist,
        }
      })
    }
  }

  const triggerFloats = (goldInc, playerDmg, enemyDmg) => {
    const gold = goldInc !== 0 ? '+' + goldInc : ''
    const pDmg = playerDmg !== 0 ? '-' + playerDmg : ''
    const eDmg = enemyDmg !== 0 ? '-' + enemyDmg : ''
    timeouts.forEach(e => clearTimeout(e))
    setFloatingContent(prev => {
      return { ...prev, gold: gold, playerDmg: pDmg, enemyDmg: eDmg }
    })
    setFloatingText(true)
    const timeout = setTimeout(() => {
      setFloatingText(false)
      setFloatingContent(prev => {
        return { ...prev, gold: '', playerDmg: '', enemyDmg: '', effect: '' }
      })
    }, 2000)
    setTimeouts(prev => [...prev, timeout])
  }

  useEffect(() => {
    return () => timeouts.forEach(e => clearTimeout(e))
  }, [timeouts])

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>Arena</h1>
      <div className={styles.gold}>
        <img className={styles.goldIcon} src={goldIcon} alt='' />
        <div className={styles.goldtext}>
          {floatingText && (
            <div className={styles.floatinggold}>
              <FloatingInfo text={floatingContent.gold} color={'green'} />
            </div>
          )}
          <h2>{user && user.gold}</h2>
        </div>
      </div>
      {user && (
        <div className={styles.battlecontainer}>
          <div className={styles.player}>
            <div className={styles.image} style={{ backgroundImage: `url(${user.image})` }}>
              <div className={styles.floatingDamage}>
                <FloatingInfo text={floatingContent.playerDmg} color={'red'} />
              </div>
            </div>
            <div className={styles.hpbar}>
              <div className={styles.health} style={{ width: `${user.hp}%` }}></div>
              <h3 className={styles.hpcount}>{user.hp}/100</h3>
            </div>
          </div>
          <div className={styles.attackbtn} onClick={handleTurn}>
            <Button text={'Fight'} />
          </div>
          <div className={styles.enemy}>
            <div className={styles.image} style={{ backgroundImage: `url(${user.enemy.image})` }}>
              <div className={styles.floatingDamage}>
                <FloatingInfo text={floatingContent.enemyDmg} color={'red'} />
              </div>
            </div>
            <div className={styles.hpbar}>
              <div className={styles.health} style={{ width: `${user.enemy.hp}%` }}></div>
              <h3 className={styles.hpcount}>{user.enemy.hp}/100</h3>
            </div>
          </div>
        </div>
      )}
      {user && (
        <div className={styles.equipmentcontainer}>
          <div className={styles.userEq}>
            <div className={styles.eqitem} onClick={() => handleDialog('weapon')}>
              <Item item={user.equippedWeapon} scale={0.7} />
            </div>
            <div className={styles.eqitem} onClick={() => handleDialog('armor')}>
              <Item item={user.equippedArmor} scale={0.7} />
            </div>
            <div className={styles.eqitem} onClick={() => handleDialog('potion')}>
              <Item item={items[8]} disableTooltip={true} scale={0.7} />
            </div>
          </div>
          <div className={styles.enemyEq}>
            <h2>{user.enemy.name}</h2>
            <h3>Damage: {user.enemy.damage}</h3>
          </div>
        </div>
      )}
      {openDialog && (
        <div className={styles.dialog}>
          {itemType === 'weapon' && <h1>Pick your weapon</h1>}
          {itemType === 'armor' && <h1>Pick your armor</h1>}
          {itemType === 'potion' && <h1>Use potion</h1>}
          <div className={styles.itemscontainer}>
            {itemType === 'potion' &&
              user.inventory.filter(e => e.type === 'potion').length === 0 && (
                <h2>You have no potions</h2>
              )}
            {itemType === 'weapon' && (
              <div className={styles.dialogitem} onClick={() => handleEquip(fist)}>
                <Item item={fist} />
              </div>
            )}
            {itemType === 'armor' && (
              <div className={styles.dialogitem} onClick={() => handleEquip(underwear)}>
                <Item item={underwear} />
              </div>
            )}
            {itemType !== 'potion' &&
              user.inventory.map(
                e =>
                  e.type === itemType && (
                    <div className={styles.dialogitem} onClick={() => handleEquip(e)} key={e.id}>
                      <Item item={e} />
                    </div>
                  )
              )}
            {itemType === 'potion' &&
              potions.map(
                e =>
                  e.type === itemType &&
                  e.count !== 0 && (
                    <div className={styles.dialogitem} onClick={() => handleEquip(e)} key={e.name}>
                      <Item item={e} count={e.count} />
                    </div>
                  )
              )}
          </div>
          <div className={styles.dialogbtn} onClick={closeDialog}>
            <Button text={'close'} />
          </div>
        </div>
      )}
      <div className={styles.backBtnContainer}>
        <Link to='/'>
          <Button text={'<<Back'} />
        </Link>
      </div>
      {deathDialogOpen && (
        <div className={styles.deathdialog}>
          <h1>YOU DIED</h1>
          <h3>You lost your items and gold</h3>
          <div className={styles.deathbtn} onClick={() => setDeathDialogOpen(false)}>
            <Button text={'OK'} />
          </div>
        </div>
      )}
      <div className={styles.effect}>
        <FloatingInfo text={floatingContent.effect} color={'green'} />
      </div>
    </div>
  )
}

export default ArenaView

const fist = {
  type: 'weapon',
  name: 'Fist',
  damage: 1,
  image: 'http://localhost:5000/uploads/fist.png',
}

const underwear = {
  type: 'armor',
  name: 'Underwear',
  defence: 0,
  image: 'http://localhost:5000/uploads/underwear.png',
}
