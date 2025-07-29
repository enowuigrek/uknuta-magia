// === CENY ===
export const BOOK_PRICE = 49.99;

export const DELIVERY_PRICES = {
    pickup: 0,
    parcel: 16.99,
    courier: 19.99
};

// === OPCJE DOSTAWY ===
export const DELIVERY_METHODS = {
    pickup: {
        key: 'pickup',
        name: 'Odbiór osobisty',
        icon: '🏠',
        price: DELIVERY_PRICES.pickup
    },
    parcel: {
        key: 'parcel',
        name: 'Paczkomat InPost',
        icon: '📦',
        price: DELIVERY_PRICES.parcel
    },
    courier: {
        key: 'courier',
        name: 'Wysyłka kurierska',
        icon: '🚚',
        price: DELIVERY_PRICES.courier
    }
};

// === MIEJSCA ODBIORU ===
export const PICKUP_LOCATIONS = {
    czestochowa: 'Częstochowa',
    raciszyn: 'Raciszyn/Działoszyna'
};

// === STATUSY ZAMÓWIEŃ ===
export const ORDER_STATUSES = {
    awaiting_payment: {
        key: 'awaiting_payment',
        label: '⏳ Złożone',
        color: '#f59e0b'
    },
    paid: {
        key: 'paid',
        label: '💰 Opłacone',
        color: '#10b981'
    },
    shipped: {
        key: 'shipped',
        label: '📦 Wysłane',
        color: '#06b6d4'
    },
    delivered: {
        key: 'delivered',
        label: '✅ Dostarczone',
        color: '#059669'
    },
    cancelled: {
        key: 'cancelled',
        label: '❌ Anulowane',
        color: '#ef4444'
    }
};

// === ETYKIETY METOD DOSTAWY ===
export const DELIVERY_METHOD_LABELS = {
    pickup: '🏠 Odbiór osobisty',
    parcel: '📦 Paczkomat',
    courier: '🚚 Kurier'
};

// === DANE KONTAKTOWE ===
export const CONTACT_INFO = {
    phone: '883 348 381',
    email: 'uknutamagia@gmail.com',
    bankAccount: '48 1020 1664 0000 3402 0185 2193',
    bankName: 'PKO Bank Polski'
};

// === EMAILJS CONFIG ===
export const EMAIL_CONFIG = {
    serviceID: 'service_m7597lc',
    templateIDClient: 'template_aie1jbf',
    templateIDAdmin: 'template_q18c56b',
    publicKey: 'WTc0uBQgaiID5YGr-'
};

// === ADMIN HASŁO ===
export const ADMIN_PASSWORD = 'UknutaMagia2025!';

// === POSTACI CZATU ===
export const CHAT_CHARACTERS = {
    krystyna: {
        name: 'Krystyna',
        title: 'Wróżka Zębuszka',
        description: 'Dumna reprezentantka pokolenia z szacunkiem do starszych',
        avatar: '🦷'
    }
};