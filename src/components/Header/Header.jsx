import { useState, useEffect } from 'react';
import styles from './Header.module.scss'

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Zamknij menu mobile po kliknięciu
        setIsMobileMenuOpen(false);
    };

    // Zamknij menu przy kliknięciu poza nim
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest(`.${styles.header}`)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <>
            <div className={`${styles.header} ${isScrolled ? styles.scrolled : styles.transparent}`}>
                <h1>Uknuta Magia</h1>
                {/* Desktop nav */}
                <nav className={styles.desktopNav}>
                    <button onClick={() => scrollToSection('book')}>O książce</button>
                    <button onClick={() => scrollToSection('author')}>O autorze</button>
                    {/*<button><a href="mailto:kontakt@example.com">Kontakt</a></button>*/}
                </nav>

                {/* Desktop order button */}
                <button className={styles.orderButton}>
                    Zamów książkę
                </button>

                {/* Hamburger button */}
                <button
                    className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Mobile menu */}
                <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <button onClick={() => scrollToSection('book')}>O książce</button>
                    <button onClick={() => scrollToSection('author')}>O autorze</button>
                    {/*<a href="mailto:kontakt@example.com">Kontakt</a>*/}
                </div>
            </div>

            {/* Floating order button for mobile */}
            <a
                href="https://payhip.com/"
                className={styles.floatingOrderButton}
                target="_blank"
                rel="noopener noreferrer"
            >
                Zamów książkę
            </a>
        </>
    )
}