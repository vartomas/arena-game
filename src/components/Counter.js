import { useState, useEffect } from 'react'
import styles from './Counter.module.scss'

const Counter = ({ max, watchCount }) => {
  const [count, setCount] = useState(1)

  const decrement = () => {
    setCount(prev => (prev - 1 === 0 ? prev : prev - 1))
  }

  const increment = () => {
    setCount(prev => (prev + 1 > max ? prev : prev + 1))
  }

  useEffect(() => {
    watchCount(count)
  }, [count, watchCount])

  return (
    <div className={styles.root}>
      <div className={`${styles.btn} ${styles.btnleft}`} onClick={decrement}>
        -
      </div>
      <p className={styles.count}>{count}</p>
      <div className={`${styles.btn} ${styles.btnright}`} onClick={increment}>
        +
      </div>
    </div>
  )
}

export default Counter
