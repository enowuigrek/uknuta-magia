import { ORDER_STATUSES, DELIVERY_METHOD_LABELS, PICKUP_LOCATIONS } from './constants.js';

// === FORMATOWANIE DAT ===

export const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    const formatOptions = { ...defaultOptions, ...options };

    return new Date(dateString).toLocaleDateString('pl-PL', formatOptions);
};

export const formatDateShort = (dateString) => {
    return formatDate(dateString, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const formatDateTime = (dateString) => {
    return formatDate(dateString);
};

// === FORMATOWANIE STATUSÓW ===

export const formatOrderStatus = (status) => {
    return ORDER_STATUSES[status] || {
        key: status,
        label: status,
        color: '#6b7280'
    };
};

export const getStatusColor = (status) => {
    return ORDER_STATUSES[status]?.color || '#6b7280';
};

export const getStatusLabel = (status) => {
    return ORDER_STATUSES[status]?.label || status;
};

// === FORMATOWANIE DANYCH DOSTAWY ===

export const formatDeliveryMethod = (deliveryMethod) => {
    return DELIVERY_METHOD_LABELS[deliveryMethod] || deliveryMethod;
};

export const formatDeliveryAddress = (order) => {
    switch (order.delivery_method) {
        case 'courier':
            return `${order.street}, ${order.zip} ${order.city}`;
        case 'parcel':
            return `Paczkomat: ${order.parcel_locker}`;
        case 'pickup':
            return `Odbiór: ${PICKUP_LOCATIONS[order.pickup_location] || 'Częstochowa'}`;
        default:
            return 'Brak danych';
    }
};

export const formatDeliveryDetails = (order) => {
    const method = formatDeliveryMethod(order.delivery_method);
    const address = formatDeliveryAddress(order);

    return {
        method,
        address,
        full: `${method} - ${address}`
    };
};

// === FORMATOWANIE KONTAKTU ===

export const formatPhone = (phone) => {
    if (!phone) return '';

    // Usuń wszystkie znaki niebędące cyframi
    const cleanPhone = phone.replace(/\D/g, '');

    // Formatuj jako XXX XXX XXX
    if (cleanPhone.length === 9) {
        return cleanPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    return phone; // Zwróć oryginalny jeśli nie pasuje do wzorca
};

export const formatEmail = (email) => {
    return email?.toLowerCase().trim() || '';
};

// === FORMATOWANIE NAZW ===

export const formatName = (name) => {
    if (!name) return '';

    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const formatAddress = (street, zip, city) => {
    const parts = [street, zip, city].filter(Boolean);
    return parts.join(', ');
};

// === FORMATOWANIE LICZB ===

export const formatNumber = (number, decimals = 0) => {
    if (number === null || number === undefined) return '0';

    return Number(number).toLocaleString('pl-PL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

export const formatPercent = (value, total) => {
    if (!total || total === 0) return '0%';

    const percent = (value / total) * 100;
    return `${percent.toFixed(1)}%`;
};

// === FORMATOWANIE TEKSTÓW ===

export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;

    return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (text) => {
    if (!text) return '';

    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatOrderId = (id) => {
    return `#${id}`;
};

// === FORMATOWANIE DLA TABELI ZAMÓWIEŃ ===

export const formatOrderForTable = (order) => {
    return {
        ...order,
        formattedId: formatOrderId(order.id),
        formattedDate: formatDateTime(order.created_at),
        formattedName: formatName(order.name),
        formattedPhone: formatPhone(order.phone),
        formattedEmail: formatEmail(order.email),
        formattedStatus: formatOrderStatus(order.status),
        formattedDelivery: formatDeliveryDetails(order),
        formattedBookPrice: `${parseFloat(order.book_price || 0).toFixed(2)} zł`,
        formattedDeliveryPrice: `${parseFloat(order.delivery_price || 0).toFixed(2)} zł`,
        formattedTotalPrice: `${parseFloat(order.total_price || 0).toFixed(2)} zł`
    };
};

// === FORMATOWANIE DLA EKSPORTU ===

export const formatOrderForExport = (order) => {
    return {
        'ID Zamówienia': formatOrderId(order.id),
        'Data': formatDateTime(order.created_at),
        'Klient': formatName(order.name),
        'Email': order.email,
        'Telefon': formatPhone(order.phone),
        'Metoda dostawy': formatDeliveryMethod(order.delivery_method),
        'Adres dostawy': formatDeliveryAddress(order),
        'Cena książki': formatNumber(order.book_price, 2),
        'Koszt dostawy': formatNumber(order.delivery_price, 2),
        'Suma': formatNumber(order.total_price, 2),
        'Status': getStatusLabel(order.status)
    };
};

// === FORMATOWANIE WALUTY ===

export const formatCurrency = (amount, currency = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// === POMOCNICZE FUNKCJE FORMATOWANIA ===

export const formatOrderSummaryText = (order) => {
    const delivery = formatDeliveryDetails(order);
    return `Zamówienie ${formatOrderId(order.id)} - ${formatName(order.name)} - ${delivery.method} - ${formatCurrency(order.total_price)}`;
};

export const formatNotificationText = (order, action) => {
    const actions = {
        created: 'utworzono',
        updated: 'zaktualizowano',
        paid: 'opłacono',
        shipped: 'wysłano',
        delivered: 'dostarczono',
        cancelled: 'anulowano'
    };

    return `Zamówienie ${formatOrderId(order.id)} zostało ${actions[action] || action}`;
};