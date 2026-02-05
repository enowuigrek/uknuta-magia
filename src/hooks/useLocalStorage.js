import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // Pobierz wartość początkową z localStorage lub użyj domyślnej
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Błąd odczytu z localStorage dla klucza "${key}":`, error);
            return initialValue;
        }
    });

    // Funkcja do ustawiania wartości
    const setValue = (value) => {
        try {
            // Pozwól na przekazanie funkcji jak w useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            // Zapisz do localStorage
            if (valueToStore === undefined) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Błąd zapisu do localStorage dla klucza "${key}":`, error);
        }
    };

    // Funkcja do usuwania wartości
    const removeValue = () => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Błąd usuwania z localStorage dla klucza "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue];
};

// Hook specjalnie dla uwierzytelniania admina
export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated, removeAuth] = useLocalStorage('admin_authenticated', false);

    const login = () => setIsAuthenticated(true);
    const logout = () => removeAuth();

    // Sprawdź przy ładowaniu komponentu
    useEffect(() => {
        const stored = window.localStorage.getItem('admin_authenticated');
        if (stored === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    return {
        isAuthenticated,
        login,
        logout
    };
};