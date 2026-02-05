import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss'

export function Header({ onOrderClick }) {
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

    // Load Payhip script once
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://payhip.com/payhip.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        const offset = headerRef.current?.offsetHeight || 0;

        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        setIsMobileMenuOpen(false);
    };

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
            <header ref={headerRef} className={`${styles.header} ${(isScrolled || isMobileMenuOpen) ? styles.scrolled : styles.transparent}`}>
                <h1>Uknuta Magia</h1>

                <nav className={styles.desktopNav}>
                    <button onClick={() => scrollToSection('book')}>O książce</button>
                    <button onClick={() => scrollToSection('author')}>O autorze</button>
                    <button
                        onClick={onOrderClick}
                        className={styles.orderButton}
                    >
                        Zamów książkę
                    </button>
                </nav>

                <button
                    className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <button onClick={() => scrollToSection('book')}>O książce</button>
                    <button onClick={() => scrollToSection('author')}>O autorze</button>
                </div>
            </header>

            <button
                onClick={onOrderClick}
                className={styles.floatingOrderButton}
            >
                Zamów książkę
            </button>
        </>
    );
}