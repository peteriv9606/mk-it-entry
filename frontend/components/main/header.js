import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import router from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/header.module.scss"

function Header() {
  const [user, setUser] = useState()
  const route_need_auth = [
    '/favourites',
  ]

  useEffect(async () => {
    let usr = ''
    try {
      usr = jwtDecode(Cookies.get('access')).username
      setUser(usr)
    } catch (err) {
      // cant decode.. not a valid cookie / missing / not logged in
      Cookies.remove('access')
      Cookies.remove('refresh')
      if(route_need_auth.includes(router.pathname)){
        router.push('/login')
      }
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('access')
    Cookies.remove('refresh')
    router.reload()
  }
  return (
    <header className={styles.Wrapper}>
      <div className="Shell">
        <div className={styles.Inner}>
          <a href="/">M-Lib.</a>
          <div className={styles.LinkContainer}>

            {user != undefined ?
              <>
                <a className={`Button ${styles.Button}`} href={`/shows`}>Shows</a>
                <a className={`Button ${styles.Button}`} href={`/favourites`}>Favourites</a>
                <button className={`Button ${styles.Button}`} onClick={handleLogout}>Logout</button>
              </>
              :
              <>
                <a className={`Button ${styles.Button}`} href={`/shows`}>Shows</a>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>}

          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
