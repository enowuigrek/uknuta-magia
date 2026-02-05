import { BOOK_PRICE, DELIVERY_PRICES } from './constants.js';

// === OBLICZANIE CEN ZAMÓWIENIA ===

export const calculateDeliveryPrice = (deliveryMethod) => {
    return DELIVERY_PRICES[deliveryMethod] || 0;
};

export const calculateTotalPrice = (deliveryMethod) => {
    const deliveryPrice = calculateDeliveryPrice(deliveryMethod);
    return BOOK_PRICE + deliveryPrice;
};

export const formatPrice = (price) => {
    return `${price.toFixed(2)} zł`;
};

// === OBLICZENIA DLA STATYSTYK ADMINA ===

export const calculateOrderStats = (orders) => {
    const totalOrders = orders.length;

    // Zamówienia opłacone (paid, shipped, delivered)
    const paidOrders = orders.filter(order =>
        ['paid', 'shipped', 'delivered'].includes(order.status)
    );

    const pendingOrders = orders.filter(order =>
        order.status === 'awaiting_payment'
    ).length;

    const cancelledOrders = orders.filter(order =>
        order.status === 'cancelled'
    ).length;

    // Przychody z książek (bez kosztów dostawy) - tylko z opłaconych zamówień
    const bookRevenue = paidOrders.reduce((sum, order) =>
        sum + (parseFloat(order.book_price) || 0), 0
    );

    // Koszty dostawy (które trzeba pokryć) - tylko z opłaconych zamówień
    const deliveryCosts = paidOrders.reduce((sum, order) =>
        sum + (parseFloat(order.delivery_price) || 0), 0
    );

    // Liczba sprzedanych książek - tylko opłacone
    const booksSold = paidOrders.length;

    // Całkowity przychód
    const totalRevenue = paidOrders.reduce((sum, order) =>
        sum + (parseFloat(order.total_price) || 0), 0
    );

    return {
        totalOrders,
        pendingOrders,
        cancelledOrders,
        booksSold,
        bookRevenue,
        deliveryCosts,
        totalRevenue,
        paidOrdersCount: paidOrders.length
    };
};

// === PODSUMOWANIE ZAMÓWIENIA ===

export const createOrderSummary = (formData) => {
    const deliveryPrice = calculateDeliveryPrice(formData.deliveryMethod);
    const totalPrice = calculateTotalPrice(formData.deliveryMethod);

    return {
        bookPrice: BOOK_PRICE,
        deliveryPrice,
        totalPrice,
        formattedBookPrice: formatPrice(BOOK_PRICE),
        formattedDeliveryPrice: formatPrice(deliveryPrice),
        formattedTotalPrice: formatPrice(totalPrice)
    };
};

// === KONWERSJA CEN DO BAZY DANYCH ===

export const prepareOrderPrices = (deliveryMethod) => {
    return {
        book_price: BOOK_PRICE,
        delivery_price: calculateDeliveryPrice(deliveryMethod),
        total_price: calculateTotalPrice(deliveryMethod)
    };
};

// === WALIDACJA CEN ===

export const validatePrices = (orderData) => {
    const expectedDeliveryPrice = calculateDeliveryPrice(orderData.delivery_method);
    const expectedTotalPrice = calculateTotalPrice(orderData.delivery_method);

    return {
        isValid:
            parseFloat(orderData.book_price) === BOOK_PRICE &&
            parseFloat(orderData.delivery_price) === expectedDeliveryPrice &&
            parseFloat(orderData.total_price) === expectedTotalPrice,
        expectedPrices: {
            book_price: BOOK_PRICE,
            delivery_price: expectedDeliveryPrice,
            total_price: expectedTotalPrice
        }
    };
};