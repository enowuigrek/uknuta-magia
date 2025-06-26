import styles from './Footer.module.scss';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLeft}>
                <a href="mailto:kontakt@uknutamagia.pl">kontakt@uknutamagia.pl</a>
                <p>© 2025 Uknuta Magia</p>

            </div>
            <div className={styles.footerCenter}>
                <a href="/regulamin">Regulamin</a>
                <a href="/polityka-prywatnosci">Polityka prywatności</a>
                <a href="/cookies">Cookies</a>
            </div>
            <div className={styles.footerRight}>
                <p>Tu beda sociale</p>
                <p>
                    Projekt i wykonanie: <a href="https://enowuigrek.dev" target="_blank" rel="noopener noreferrer">enowuigrek</a>
                </p>
            </div>
        </footer>
    )
}