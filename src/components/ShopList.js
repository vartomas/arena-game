import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './ShopList.module.scss'
import Item from './Item'
import Button from './Button'
import items from '../utilities/items'
import goldIcon from '../assets/gold.png'
import Counter from './Counter'

import { userContext } from '../App'

const ShopList = () => {
  const [user, setUser] = useContext(userContext)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [buyItem, setBuyItem] = useState(null)
  const [count, setCount] = useState(1)

  const buyDialog = item => {
    setCount(1)
    setBuyItem(item)
    setDialogOpen(true)
  }

  const cancelDialog = () => {
    setCount(1)
    setDialogOpen(false)
    setBuyItem(null)
  }

  const handleBuy = () => {
    // tikrinu ar uzteks goldo
    if (buyItem.price * count > user.gold) return
    // tikrinu ar neturi tokio itemo
    if (user.inventory.filter(e => e.name === buyItem.name).length > 0 && buyItem.type !== 'potion')
      return
    // generuoju perkamus itemus
    const buyItems = []
    for (let i = 0; i < count; i++) {
      const item = { ...buyItem, id: String(Date.now()) + String(Math.floor(Math.random() * 1000)) }
      buyItems.push(item)
    }
    setUser(prev => {
      return {
        ...prev,
        gold: user.gold - buyItem.price * count,
        inventory: [...prev.inventory, ...buyItems],
      }
    })
    setDialogOpen(false)
    setBuyItem(null)
  }

  const watchCount = value => {
    setCount(value)
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>SHOP</h1>
      <div className={styles.gold}>
        <img className={styles.goldIcon} src={goldIcon} alt='' />
        <h2>{user && user.gold}</h2>
      </div>
      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Armor</h2>
        {items.map(
          e =>
            e.type === 'armor' && (
              <div key={e.name} className={styles.itemContainer} onClick={() => buyDialog(e)}>
                <Item item={e} disableTooltip={dialogOpen ? true : false} />
              </div>
            )
        )}
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Weapons</h2>
        {items.map(
          e =>
            e.type === 'weapon' && (
              <div key={e.name} className={styles.itemContainer} onClick={() => buyDialog(e)}>
                <Item item={e} disableTooltip={dialogOpen ? true : false} />
              </div>
            )
        )}
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Potions</h2>
        {items.map(
          e =>
            e.type === 'potion' && (
              <div key={e.name} className={styles.itemContainer} onClick={() => buyDialog(e)}>
                <Item item={e} disableTooltip={dialogOpen ? true : false} />
              </div>
            )
        )}
      </section>
      {dialogOpen && (
        <div className={styles.buyDialog}>
          <h2>Buy {buyItem.name}?</h2>
          <div className={styles.space}></div>
          <Item item={buyItem} disableTooltip={true} />
          <div className={styles.space}></div>
          {buyItem.type === 'armor' && <h3>Defence: {buyItem.defence}</h3>}
          {buyItem.type === 'weapon' && <h3>Damage: {buyItem.damage}</h3>}
          {buyItem.type === 'weapon' && <h3>Special: {buyItem.specialDescription}</h3>}
          {buyItem.type === 'potion' && <h3>Heals: {buyItem.heals}</h3>}
          <h3>Price: {buyItem.price}</h3>
          <h3>Sell price: {buyItem.sellPrice}</h3>
          <div className={styles.space}></div>
          {buyItem.type === 'potion' && (
            <div>
              <Counter watchCount={watchCount} max={Math.floor(user.gold / buyItem.price)} />
              <div className={styles.space}></div>
            </div>
          )}
          <div className={styles.dialogButtonContainer}>
            <div onClick={cancelDialog}>
              <Button text={'Cancel'} />
            </div>
            <div onClick={handleBuy}>
              <Button
                text={'Buy'}
                disabled={
                  buyItem.price > user.gold ||
                  (user.inventory.filter(e => e.name === buyItem.name).length > 0 &&
                    buyItem.type !== 'potion')
                    ? true
                    : false
                }
              />
            </div>
          </div>
          {buyItem.price > user.gold && (
            <>
              <div className={styles.space}></div>
              <h3 style={{ color: 'red' }}>You dont have enough money!</h3>
            </>
          )}
          {user.inventory.filter(e => e.name === buyItem.name).length > 0 &&
            buyItem.type !== 'potion' && (
              <>
                <div className={styles.space}></div>
                <h3 style={{ color: 'red' }}>You already own this item!</h3>
              </>
            )}
        </div>
      )}
      <div className={styles.backBtnContainer}>
        <Link to='/'>
          <Button text={'<<Back'} />
        </Link>
      </div>
    </div>
  )
}

export default ShopList
