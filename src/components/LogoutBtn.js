import styles from './LogoutBtn.module.scss'
import u from '../utilities/u'

const LogoutBtn = () => {
  const handleLogout = async () => {
    await u.logout()
    localStorage.clear()
    window.location.reload()
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      fill='#000000'
      viewBox='0 0 256 256'
      className={styles.root}
      onClick={handleLogout}
    >
      <rect width='256' height='256' fill='none'></rect>
      <polyline
        points='174.011 86 216 128 174.011 170'
        fill='none'
        stroke='#521306'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      ></polyline>
      <line
        x1='104'
        y1='128'
        x2='215.97057'
        y2='128'
        fill='none'
        stroke='#521306'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      ></line>
      <path
        d='M104,216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h56'
        fill='none'
        stroke='#521306'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
        className={styles.path}
      ></path>
    </svg>
  )
}

export default LogoutBtn
