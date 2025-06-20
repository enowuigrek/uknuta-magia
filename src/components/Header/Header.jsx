import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss'

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        const offset = headerRef.current?.offsetHeight || 0;

        console.log(element)

        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

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
            <header ref={headerRef} className={`${styles.header} ${(isScrolled || isMobileMenuOpen) ? styles.scrolled : styles.transparent}`}>  <h1>Uknuta Magia</h1>
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
                    onClick={() => {
                        setIsMobileMenuOpen(prev => !prev);
                    }}
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
            </header>

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