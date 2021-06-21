import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Arena from './pages/Arena'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import LeaderBoard from './pages/LeaderBoard'
import Login from './pages/Login'
import Shop from './pages/Shop'
import User from './pages/User'
import NotFound from './pages/NotFound'
import Loader from './components/Loader'
import monsters from './utilities/monsters'

import u from './utilities/u'

import styles from './App.module.scss'

export const userContext = React.createContext(null)

const App = () => {
  const [user, setUser] = useState(null)
  const [loadedUser, setLoadedUser] = useState(false)
  const [loading, setLoading] = useState(true)

  // checkinu useri pagal tokena is local storage
  useEffect(() => {
    const check = async () => {
      const res = await u.check()
      if (res.success) {
        setUser(res.user)
        setLoadedUser(true)
        setLoading(false)
      } else {
        localStorage.clear()
        setLoading(false)
      }
    }
    check()
  }, [])

  // pasikeitus steite userio info updeitinu ja ir backende
  useEffect(() => {
    const up = async () => {
      await u.update({
        hp: user.hp,
        gold: user.gold,
        inventory: user.inventory,
        enemy: user.enemy,
        equippedWeapon: user.equippedWeapon,
        equippedArmor: user.equippedArmor,
      })
    }
    if (loadedUser) {
      up()
    }
  }, [user, loadedUser])

  // jeigu nera prieso paskiriu ji
  useEffect(() => {
    if (user) {
      if (!user.enemy) {
        const newEnemy = {
          ...monsters[Math.floor(Math.random() * monsters.length)],
          hp: 100,
        }
        setUser(prev => {
          return { ...prev, enemy: newEnemy }
        })
      }
    }
  }, [user])

  return (
    <main className={styles.main}>
      {loading ? (
        <Loader />
      ) : (
        <userContext.Provider value={[user, setUser]}>
          <Router>
            {!user && <Redirect to='/login' />}
            <Switch>
              <Route exact path='/arena'>
                <Arena />
              </Route>
              <Route exact path='/inventory'>
                <Inventory />
              </Route>
              <Route exact path='/leaderboard'>
                <LeaderBoard />
              </Route>
              <Route exact path='/shop'>
                <Shop />
              </Route>
              <Route exact path='/login'>
                <Login />
              </Route>
              <Route exact path='/user/:id'>
                <User />
              </Route>
              <Route exact path='/'>
                <Home user={user} />
              </Route>
              <Route path='*'>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </userContext.Provider>
      )}
    </main>
  )
}

export default App
