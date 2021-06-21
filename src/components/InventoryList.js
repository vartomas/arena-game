import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './InventoryList.module.scss'
import { userContext } from '../App'
import Item from './Item'
import items from '../utilities/items'
import Button from './Button'
import Counter from './Counter'

const InventoryList = () => {
  const [user, setUser] = useContext(userContext)
  const [inventory, setInventory] = useState(null)
  const [viewItem, setviewItem] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (!user) return
    const userInventory = items.map(e => {
      return {
        ...e,
        count: user.inventory.filter(i => e.name === i.name).length,
        id: String(Date.now()) + String(Math.floor(Math.random() * 1000)),
      }
    })
    setInventory(userInventory)
  }, [user])

  const inspectItem = item => {
    setviewItem(item)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setviewItem(null)
    setDialogOpen(false)
  }

  const watchCount = value => {
    setCount(value)
  }

  const sellItem = () => {
    const inv = user.inventory
    let money = 0
    for (let i = 0; i < count; i++) {
      const index = inv.findIndex(e => e.name === viewItem.name)
      inv.splice(index, 1)
      money += viewItem.sellPrice
    }
    setUser(prev => {
      return { ...prev, inventory: inv, gold: prev.gold + money }
    })
    setviewItem(null)
    setDialogOpen(false)
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>Inventory</h1>
      {user && (
        <div>
          {user.inventory.length === 0 && <h3>You don't have any items.</h3>}
          <div className={styles.inventory}>
            {inventory &&
              inventory.map(
                e =>
                  e.count > 0 && (
                    <div onClick={() => inspectItem(e)} className={styles.item} key={e.id}>
                      <Item
                        item={e}
                        count={e.count > 1 ? e.count : null}
                        disableTooltip={dialogOpen ? true : false}
                      />
                    </div>
                  )
              )}
          </div>
          {dialogOpen && (
            <div className={styles.dialog}>
              <h2 className={styles.dialogheader}>{viewItem.name}</h2>
              <h3>Sell price: {viewItem.sellPrice}</h3>
              {viewItem.count > 1 && <h3>Count: {viewItem.count}</h3>}
              {viewItem.count > 1 && (
                <div className={styles.countercontainer}>
                  <Counter max={viewItem.count} watchCount={watchCount} />
                </div>
              )}
              <div className={styles.buttons}>
                <div onClick={closeDialog}>
                  <Button text={'Close'} />
                </div>
                <div onClick={sellItem}>
                  <Button text={'Sell'} />
                </div>
              </div>
            </div>
          )}
          <div className={styles.backBtnContainer}>
            <Link to='/'>
              <Button text={'<<Back'} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryList
