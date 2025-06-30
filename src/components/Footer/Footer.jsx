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
                <a href="mailto:uknutamagia@gmail.com">uknutamagia@gmail.com</a>
                <p>© 2025 Uknuta Magia</p>
            </div>

            <div className={styles.footerCenter}>
                <a href="/regulamin">Regulamin</a>
                <a href="/polityka-prywatnosci">Polityka prywatności</a>
                <a href="/cookies">Cookies</a>
            </div>

            <div className={styles.footerRight}>
                <p>
                    Projekt i wykonanie:<br />
                    <a href="mailto:enowuigrek@gmail.com">enowuigrek</a>
                </p>
            </div>
        </footer>
    );
}