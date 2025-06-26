import { useEffect, useState } from 'react';
import styles from './Footer.module.scss';

export function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 10) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`${styles.footerWrapper} ${isVisible ? styles.footerVisible : styles.footerHidden}`}>
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
        </div>
    )
}