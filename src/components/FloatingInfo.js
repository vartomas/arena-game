import styles from './FloatingInfo.module.scss'

const FloatingInfo = ({ text, color }) => {
  return (
    <div className={styles.root}>
      <h2 style={{ color: color }}>{text}</h2>
    </div>
  )
}

export default FloatingInfo
