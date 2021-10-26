import Head from 'next/head'
import styles from "../styles/register.module.scss"
import Cookies from 'js-cookie'
import { useEffect, useRef, useState } from 'react'
import { merge } from 'lodash'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Layout from "../components/main/layout"
import Loader from '../components/main/loader'

export default function Register() {
    const router = useRouter()
    const fname_ref = useRef()
    const [formError, setFormError] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        password2: "",
        email: "",
    })

    const handleInputChange = () => {
        // clear error
        let errs = { ...formError }
        delete errs[event.target.id]
        setFormError(errs)
        // set input
        setUserData({ ...userData, [event.target.id]: event.target.value })
    }

    const handleInputKeyDown = () => { event.keyCode == 13 ? handleFormSubmit() : "" }

    const handleFormSubmit = async () => {
        event.preventDefault()
        setIsLoading(true)
        let errors = {}

        if (userData.username == undefined || userData.username == "") {
            errors['username'] = "This field cannot be blank"
        }
        if (userData.password == undefined || userData.password == "") {
            errors['password'] = "This field cannot be blank"
        }
        if (userData.password2 == undefined || userData.password2 == "") {
            errors['password2'] = "This field cannot be blank"
        }
        if (userData.password != userData.password2) {
            errors['password'] = "Passwords do not match"
            errors['password2'] = "Passwords do not match"
        }
        if (userData.email == undefined || userData.email == "") {
            errors['email'] = "This field cannot be blank"
        }

        if (Object.keys(errors).length !== 0) {
            // has errors
            setFormError(errors)
            setIsLoading(false)
        }
        else {
            const res = await fetch(process.env.apiUrl + "auth/register/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            if (res.status !== 201) {
                res.json().then(r => {
                    setIsLoading(false)
                    let err = {}
                    r.map(error => {
                        Object.entries(error).forEach(([key, value]) => {
                            err = merge(err, { [key]: value })
                        })
                    })
                    if (err) {
                        setFormError(err)
                    }
                })
            } else {
                // no errors go to login page
                setIsLoading(false)
                toast.success("Registration Successful! Redirecting to login screen.", { hideProgressBar: false })
                setTimeout(() => {
                    Cookies.set('access', res.access)
                    Cookies.set('refresh', res.refresh)
                    router.replace('/login')
                }, 3000);
            }
        }
    }

    useEffect(() => {
        fname_ref.current.focus()
    }, [])

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Register</title>
            </Head>

            <div className={styles.Wrapper}>
                <div className="Shell">
                    <div className={styles.Inner}>
                        <form className="Form_wrapper">
                            <h1>Sign up</h1>
                            <div className="Nested two">
                                <div className="Labeled_input">
                                    <label htmlFor="first_name">First Name</label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        onChange={handleInputChange}
                                        ref={fname_ref}
                                    />
                                    <p>{formError?.password}</p>
                                </div>
                                <div className="Labeled_input">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                    <p>{formError?.password2}</p>
                                </div>
                            </div>
                            <div className="Labeled_input">
                                <label htmlFor="username"><span>*</span>Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    onChange={handleInputChange}
                                    onKeyDown={handleInputKeyDown}
                                />
                                <p>{formError?.username}</p>
                            </div>
                            <div className="Nested two">
                                <div className="Labeled_input">
                                    <label htmlFor="password"><span>*</span>Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                    />
                                    <p>{formError?.password}</p>
                                </div>
                                <div className="Labeled_input">
                                    <label htmlFor="password2"><span>*</span>Confirm Password</label>
                                    <input
                                        id="password2"
                                        type="password"
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                    />
                                    <p>{formError?.password2}</p>
                                </div>
                            </div>
                            <div className="Labeled_input">
                                <label htmlFor="email"><span>*</span>E-Mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    onChange={handleInputChange}
                                    onKeyDown={handleInputKeyDown}
                                />
                                <p>{formError?.email}</p>
                            </div>
                            <p className="Required">Fields marked with ( <span>*</span> ) are required</p>
                            <p>Already have an account? <a href="/login">Login</a></p>
                            <button className="Button" onClick={handleFormSubmit}>
                                {isLoading ? <Loader size={18} /> : "Sign up"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}