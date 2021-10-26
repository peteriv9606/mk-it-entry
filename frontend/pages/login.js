import Head from 'next/head'
import router from "next/router"
import styles from "../styles/login.module.scss"
import Layout from "../components/main/layout"
import { useState, useEffect, useRef } from "react"
import Cookies from "js-cookie";
import Loader from "../components/main/loader"

export default function Login() {

    const username_ref = useRef()
    const [formError, setFormError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })

    const handleInputChange = () => {
        // clear error
        let errs = { ...formError }
        delete errs[event.target.id]
        setFormError(errs)
        // set input
        setUserData({ ...userData, [event.target.id]: event.target.value })
    }

    const handleKeyDown = () => { event.keyCode == 13 ? handleLogin() : "" }

    const handleLogin = async () => {
        event.preventDefault()
        setIsLoading(true)
        let errors = {}

        if (userData.username == undefined || userData.username == "") {
            errors['username'] = "This field cannot be blank"
        }
        if (userData.password == undefined || userData.password == "") {
            errors['password'] = "This field cannot be blank"
        }

        if (Object.keys(errors).length !== 0) {
            // has errors
            setFormError(errors)
            setIsLoading(false)
        }
        else {
            const res = await fetch(process.env.apiUrl + 'auth/login/', {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(userData)
            })

            if (res.status === 404) {
                res.json().then(res => {
                    errors['username'] = res['username']
                    setIsLoading(false)
                    setFormError(errors)
                })
            }
            else if (res.status === 400) {
                res.json().then(res => {
                    res?.username ? errors['username'] = res.username : ""
                    res?.password ? errors['password'] = res.password : ""
                    setIsLoading(false)
                    setFormError(errors)
                })
            }
            else if (res.status === 200) {
                // all good - fetch token
                const resp = await res.json()
                setIsLoading(false)
                Cookies.set('access', resp.access)
                Cookies.set('refresh', resp.refresh)
                /* if (window.history.length > 1 && document.referrer.indexOf(window.location.host) !== -1) {
                    router.back();
                } else {
                    router.replace('/');
                } */
                router.replace('/', '/', {shallow:false})
            }
            else {
                // something is terribly wrong.. cant login either 500 or something else
                res.json().then(res => {
                    setIsLoading(false)
                    console.error(res)
                })

            }
        }
    }

    useEffect(() => {
        username_ref.current.focus()
    }, [])

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Login</title>
            </Head>

            <div className={styles.Wrapper}>
                <div className="Shell">
                    <div className={styles.Inner}>
                        <form className="Form_wrapper">
                            <h1>Login</h1>
                            <div className="Labeled_input">
                                <label htmlFor={"username"}>Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete={"username"}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    ref={username_ref}
                                />
                                <p>{formError?.username}</p>
                            </div>
                            <div className="Labeled_input">
                                <label htmlFor={"password"}>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    autoComplete={"current-password"}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <p>{formError?.password}</p>
                            </div>
                            <p>Don't have an account? <a href="/register">Sign up</a></p>
                            <button className="Button" onClick={handleLogin}>
                                {isLoading ? <Loader size={18} /> : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
