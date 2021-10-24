import styles from "../../styles/footer.module.scss"

function Footer() {
    return (
        <footer className={styles.Wrapper}>
            <div className="Shell">
                <div className={styles.Inner}>
                    <h1>Movie Library Website</h1>
                    <h1>&copy; Petar Ivanov - 2021</h1>
                    
                </div>
            </div>
        </footer>
    )
}

export default Footer;
