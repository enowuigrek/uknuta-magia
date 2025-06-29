import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import styles from './Footer.module.scss';

export function Footer() {

    return (

            <footer className={styles.footer}>
                <div className={styles.footerLeft}>
                    <div className={styles.socialIcons}>
                        <a href="https://www.instagram.com/uknuta_magia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61575505817796" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                    </div>
                    <a href="mailto:kontakt@uknutamagia.pl">kontakt@uknutamagia.pl</a>
                    <p>© 2025 Uknuta Magia</p>

                </div>
                <div className={styles.footerCenter}>
                    <a href="/regulamin">Regulamin</a>
                    <a href="/polityka-prywatnosci">Polityka prywatności</a>
                    <a href="/cookies">Cookies</a>
                </div>
                <div className={styles.footerRight}>
                    <p>
                        Projekt i wykonanie: <a href="https://enowuigrek.dev" target="_blank" rel="noopener noreferrer">enowuigrek</a>
                    </p>
                </div>
            </footer>
    )
}