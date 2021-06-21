import styles from './Item.module.scss'

const Item = ({ item, disableTooltip, count, scale }) => {
  return (
    <div
      className={styles.root}
      style={scale ? { width: `${150 * scale}px`, height: `${150 * scale}px` } : null}
    >
      <img className={styles.img} src={item.image} alt='' />
      {count && <h2 className={styles.count}>{count}</h2>}
      {!disableTooltip && (
        <div className={styles.tooltip}>
          <p>
            <b>{item.name}</b>
          </p>
          {item.type === 'armor' && <p>Defence: {item.defence}</p>}
          {item.type === 'weapon' && <p>Damage: {item.damage}</p>}
          {item.type === 'weapon' && item.name !== 'Fist' && (
            <p>Special: {item.specialDescription}</p>
          )}
          {item.type === 'potion' && <p>Heals: {item.heals}</p>}
          {item.name !== 'Underwear' && item.name !== 'Fist' && <p>Price: {item.price}</p>}
          {item.name !== 'Underwear' && item.name !== 'Fist' && <p>Sell price: {item.sellPrice}</p>}
        </div>
      )}
    </div>
  )
}

export default Item
