import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/header.module.scss"
import OutsideClickHandler from "react-outside-click-handler"

function Header() {
  const [user, setUser] = useState()
  const [dropdown, setDropdown] = useState(false)
  const [initRender, setInitRender] = useState(true)

  const dropdown_ref = useRef()

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
      if (route_need_auth.includes(router.pathname)) {
        router.push('/login')
      }
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('access')
    Cookies.remove('refresh')
    router.reload()
  }

  const handleDropdown = () => {
    setDropdown(!dropdown)
  }

  useEffect(() => {
    if (!initRender) {

      if (!dropdown) {
        // hide
        dropdown_ref.current.classList.add(styles.Hide)
        setTimeout(() => {
          dropdown_ref.current.classList.remove(styles.Hide)
          dropdown_ref.current.classList.remove(styles.Active)
        }, 500);
      } else {
        // show
        dropdown_ref.current.classList.add(styles.Show)
        setTimeout(() => {
          dropdown_ref.current.classList.remove(styles.Show)
          dropdown_ref.current.classList.add(styles.Active)
        }, 500);
      }
      return () => {
        dropdown_ref.current.classList.remove(styles.Active)
      }
    }
    setInitRender(false)

  }, [dropdown])



  return (
    <header className={styles.Wrapper}>
      <OutsideClickHandler onOutsideClick={() => dropdown ? setDropdown(false) : ""}>
        <div className="Shell">
          <div className={styles.Inner}>
            <a href="/">M-Lib.</a>
            <button onClick={handleDropdown}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        <div className={`${styles.Dropdown_wrapper}`} ref={dropdown_ref}>
          <div className={"Shell"}>
            <div className={styles.Dropdown}>
              <p>{user? `Hello, ${user}!` : ""}</p>
              <div className={styles.LinkContainer}>
              <div>
                {/* left side */}
                {
                  user != undefined ?
                    <>
                      <a href={`/shows`} onClick={() => setDropdown(false)}>Shows</a>
                      <a href={`/favourites`} onClick={() => setDropdown(false)}>Favourites</a>
                    </>
                    :
                    <>
                      <a href={`/shows`} onClick={() => setDropdown(false)}>Shows</a>
                    </>
                }
              </div>
              <div>
                {/* right side */}
                {
                  user != undefined ?
                    <>
                      <button onClick={handleLogout}>Logout</button>
                    </>
                    :
                    <>
                      <a href="/login" onClick={() => setDropdown(false)}>Login</a>
                      <a href="/register" onClick={() => setDropdown(false)}>Register</a>
                    </>
                }
              </div>
            </div>
            </div>
            
          </div>
        </div>
      </OutsideClickHandler>
    </header>
  )
}

export default Header;
