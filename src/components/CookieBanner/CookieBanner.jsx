// src/components/CookieBanner/CookieBanner.jsx
import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.scss';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Sprawdź czy użytkownik już zaakceptował cookies
        const cookieConsent = localStorage.getItem('cookie-consent');
        if (!cookieConsent) {
            // Pokaż banner po małym opóżnieniu
            setTimeout(() => {
                setIsVisible(true);
            }, 3000); // 3 sekundy żeby nie był natarczywy
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.cookieBanner}>
            <div className={styles.cookieContent}>
                <div className={styles.cookieText}>
                    <div className={styles.cookieIcon}>🍪</div>
                    <div className={styles.cookieMessage}>
                        <h4>Ta strona używa plików cookie</h4>
                        <p>
                            Używamy niezbędnych plików cookie do prawidłowego działania sklepu i realizacji zamówień.
                            Korzystamy również z usług zewnętrznych (EmailJS, Google Fonts, Supabase).
                        </p>
                    </div>
                </div>

                <div className={styles.cookieActions}>
                    <button
                        onClick={acceptCookies}
                        className={styles.acceptButton}
                    >
                        Rozumiem
                    </button>
                </div>
            </div>
        </div>
    );
}