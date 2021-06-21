import styles from './Button.module.scss'
import buttonImg from '../assets/button.jpg'

const Button = ({ text, disabled }) => {
  return (
    <div className={styles.root} style={disabled ? { filter: 'grayscale(100%)' } : null}>
      <img className={styles.img} src={buttonImg} alt='' />
      <p className={styles.p}>{text}</p>
    </div>
  )
}

export default Button
