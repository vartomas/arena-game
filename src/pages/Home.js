import styles from './Home.module.scss'
import Game from '../components/Game'

const Home = () => {
  return (
    <div className={styles.root}>
      <Game />
    </div>
  )
}

export default Home
