// === WALIDACJA FORMULARZA ZAMÓWIENIA ===

export const validateOrderForm = (formData) => {
    const errors = {};

    // Walidacja podstawowych danych
    if (!formData.name?.trim()) {
        errors.name = 'Imię i nazwisko jest wymagane';
    }

    if (!formData.email?.trim()) {
        errors.email = 'Adres e-mail jest wymagany';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Podaj prawidłowy adres e-mail';
    }

    if (!formData.phone?.trim()) {
        errors.phone = 'Telefon jest wymagany';
    } else if (!isValidPhone(formData.phone)) {
        errors.phone = 'Podaj prawidłowy numer telefonu';
    }

    // Walidacja metody dostawy
    if (!formData.deliveryMethod) {
        errors.deliveryMethod = 'Wybierz metodę dostawy';
    }

    // Walidacja specyficzna dla metody dostawy
    if (formData.deliveryMethod === 'pickup') {
        if (!formData.pickupLocation) {
            errors.pickupLocation = 'Wybierz miejsce odbioru';
        }
    }

    if (formData.deliveryMethod === 'parcel') {
        if (!formData.parcelLocker?.trim()) {
            errors.parcelLocker = 'Wpisz numer paczkomatu';
        } else if (!isValidParcelLocker(formData.parcelLocker)) {
            errors.parcelLocker = 'Podaj prawidłowy numer paczkomatu (np. KRA01M)';
        }
    }

    if (formData.deliveryMethod === 'courier') {
        if (!formData.street?.trim()) {
            errors.street = 'Ulica i numer domu są wymagane';
        }
        if (!formData.zip?.trim()) {
            errors.zip = 'Kod pocztowy jest wymagany';
        } else if (!isValidZipCode(formData.zip)) {
            errors.zip = 'Podaj prawidłowy kod pocztowy (np. 42-200)';
        }
        if (!formData.city?.trim()) {
            errors.city = 'Miasto jest wymagane';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// === FUNKCJE POMOCNICZE WALIDACJI ===

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
    // Usuń wszystkie spacje i myślniki
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Sprawdź czy ma 9 cyfr i opcjonalnie prefix +48
    const phoneRegex = /^(\+48)?[0-9]{9}$/;
    return phoneRegex.test(cleanPhone);
};

export const isValidZipCode = (zip) => {
    const zipRegex = /^[0-9]{2}-[0-9]{3}$/;
    return zipRegex.test(zip);
};

export const isValidParcelLocker = (parcelLocker) => {
    // Podstawowa walidacja - 3 litery i 2-3 cyfry z opcjonalną literą na końcu
    const parcelRegex = /^[A-Z]{3}[0-9]{2,3}[A-Z]?$/i;
    return parcelRegex.test(parcelLocker.toUpperCase());
};

// === WALIDACJA LOGOWANIA ADMINA ===

export const validateAdminLogin = (password, correctPassword) => {
    return password === correctPassword;
};

// === SANITYZACJA DANYCH ===

export const sanitizeFormData = (formData) => {
    const sanitized = {};

    // Podstawowe czyszczenie stringów
    Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'string') {
            sanitized[key] = formData[key].trim();
        } else {
            sanitized[key] = formData[key];
        }
    });

    // Specjalna obróbka dla niektórych pól
    if (sanitized.parcelLocker) {
        sanitized.parcelLocker = sanitized.parcelLocker.toUpperCase();
    }

    if (sanitized.phone) {
        // Usuń spacje i myślniki z numeru telefonu
        sanitized.phone = sanitized.phone.replace(/[\s-]/g, '');
    }

    return sanitized;
};

// === WALIDACJA CZASU RZECZYWISTEGO ===

export const createFieldValidator = (fieldName) => {
    return (value) => {
        switch (fieldName) {
            case 'email':
                return isValidEmail(value) ? null : 'Podaj prawidłowy adres e-mail';
            case 'phone':
                return isValidPhone(value) ? null : 'Podaj prawidłowy numer telefonu';
            case 'zip':
                return isValidZipCode(value) ? null : 'Podaj prawidłowy kod pocztowy';
            case 'parcelLocker':
                return isValidParcelLocker(value) ? null : 'Podaj prawidłowy numer paczkomatu';
            default:
                return null;
        }
    };
};