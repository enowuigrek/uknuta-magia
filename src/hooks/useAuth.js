import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { validateAdminLogin } from '../utils/validation.js';
import { ADMIN_PASSWORD } from '../utils/constants.js';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated, removeAuth] = useLocalStorage('admin_authenticated', false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Sprawdź stan uwierzytelnienia przy ładowaniu
    useEffect(() => {
        const checkAuth = () => {
            const stored = localStorage.getItem('admin_authenticated');
            if (stored === 'true') {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [setIsAuthenticated]);

    // Obsługa logowania
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        if (validateAdminLogin(passwordInput, ADMIN_PASSWORD)) {
            setIsAuthenticated(true);
            setPasswordInput('');
            console.log('Zalogowano pomyślnie');
        } else {
            setLoginError('Nieprawidłowe hasło');
            setPasswordInput('');
        }
    };

    // Obsługa wylogowania
    const handleLogout = () => {
        setIsAuthenticated(false);
        removeAuth();
        setPasswordInput('');
        setLoginError('');
        console.log('Wylogowano');
    };

    // Logowanie programowe (bez formularza)
    const login = (password = null) => {
        if (password) {
            if (validateAdminLogin(password, ADMIN_PASSWORD)) {
                setIsAuthenticated(true);
                return true;
            } else {
                setLoginError('Nieprawidłowe hasło');
                return false;
            }
        } else {
            // Logowanie bez hasła (np. z localStorage)
            setIsAuthenticated(true);
            return true;
        }
    };

    // Wylogowanie programowe
    const logout = () => {
        handleLogout();
    };

    // Aktualizacja hasła w formularzu
    const updatePassword = (password) => {
        setPasswordInput(password);
        // Wyczyść błąd gdy użytkownik zaczyna pisać
        if (loginError) {
            setLoginError('');
        }
    };

    // Sprawdź czy sesja jest ważna (można rozszerzyć o TTL)
    const validateSession = () => {
        const stored = localStorage.getItem('admin_authenticated');
        const isValid = stored === 'true';

        if (!isValid && isAuthenticated) {
            // Wyloguj jeśli sesja nie jest ważna
            setIsAuthenticated(false);
        }

        return isValid;
    };

    return {
        // Stan
        isAuthenticated,
        isLoading,
        passwordInput,
        loginError,

        // Funkcje
        handleLogin,
        handleLogout,
        login,
        logout,
        updatePassword,
        validateSession,

        // Settery (dla większej kontroli)
        setPasswordInput,
        setLoginError
    };
};

// Hook dla prostego sprawdzania uwierzytelnienia (bez UI)
export const useSimpleAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('admin_authenticated', false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return {
        isAuthenticated,
        login,
        logout
    };
};

// Hook dla sesji z TTL (Time To Live)
export const useSessionAuth = (ttlMinutes = 60) => {
    const [sessionData, setSessionData] = useLocalStorage('admin_session', null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (sessionData) {
            const now = Date.now();
            const sessionTime = sessionData.timestamp;
            const ttlMs = ttlMinutes * 60 * 1000;

            if (now - sessionTime < ttlMs) {
                setIsAuthenticated(true);
            } else {
                // Sesja wygasła
                setSessionData(null);
                setIsAuthenticated(false);
            }
        }
    }, [sessionData, ttlMinutes, setSessionData]);

    const login = (password) => {
        if (validateAdminLogin(password, ADMIN_PASSWORD)) {
            const session = {
                timestamp: Date.now(),
                authenticated: true
            };
            setSessionData(session);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setSessionData(null);
        setIsAuthenticated(false);
    };

    const refreshSession = () => {
        if (isAuthenticated) {
            const session = {
                timestamp: Date.now(),
                authenticated: true
            };
            setSessionData(session);
        }
    };

    const getRemainingTime = () => {
        if (!sessionData) return 0;

        const now = Date.now();
        const sessionTime = sessionData.timestamp;
        const ttlMs = ttlMinutes * 60 * 1000;
        const remaining = ttlMs - (now - sessionTime);

        return Math.max(0, Math.floor(remaining / 1000)); // zwróć sekundy
    };

    return {
        isAuthenticated,
        login,
        logout,
        refreshSession,
        getRemainingTime
    };
};