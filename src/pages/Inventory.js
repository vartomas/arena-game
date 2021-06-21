import styles from './Inventory.module.scss'
import InventoryList from '../components/InventoryList'

const Inventory = () => {
  return (
    <div className={styles.root}>
      <InventoryList />
    </div>
  )
}

export default Inventory
