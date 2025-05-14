import styles from './Header.module.scss'

export function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.shadow}></div>
            <h1>Uknuta Magia</h1>
            {/*tymczasowy nav*/}
            <nav>
                <a href="/">O książce</a>
                <a href="/about">O autorze</a>
                <a href="/contact">Kontakt</a>
            </nav>
            <button>Zamów książkę</button>
        </div>
    )
}