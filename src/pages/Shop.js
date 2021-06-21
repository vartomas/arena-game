import styles from './Shop.module.scss'
import ShopList from '../components/ShopList'

const Shop = () => {
  return (
    <div className={styles.root}>
      <ShopList />
    </div>
  )
}

export default Shop
