import { Link } from 'react-router-dom'
import styles from './NotFound.module.scss'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className={styles.root}>
      <h1>404</h1>
      <div className={styles.spacer}></div>
      <h2>Page does not exist</h2>
      <div className={styles.spacer}></div>
      <div className={styles.btncontainer}>
        <Link to='/'>
          <Button text={'Main'} />
        </Link>
      </div>
    </div>
  )
}

export default NotFound
