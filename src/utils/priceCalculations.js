import { BOOK_PRICE, DELIVERY_PRICES } from './constants.js';

// === OBLICZANIE CEN ZAMÓWIENIA ===

export const calculateDeliveryPrice = (deliveryMethod) => {
    return DELIVERY_PRICES[deliveryMethod] || 0;
};

export const calculateBooksPrice = (quantity = 1) => {
    return BOOK_PRICE * quantity;
};

export const calculateTotalPrice = (deliveryMethod, quantity = 1) => {
    const deliveryPrice = calculateDeliveryPrice(deliveryMethod);
    const booksPrice = calculateBooksPrice(quantity);
    return booksPrice + deliveryPrice;
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
    // Używamy books_total_price jeśli dostępne, w przeciwnym razie book_price * quantity
    const bookRevenue = paidOrders.reduce((sum, order) => {
        const booksTotal = parseFloat(order.books_total_price) ||
                          (parseFloat(order.book_price) || 0) * (parseInt(order.quantity) || 1);
        return sum + booksTotal;
    }, 0);

    // Koszty dostawy (które trzeba pokryć) - tylko z opłaconych zamówień
    const deliveryCosts = paidOrders.reduce((sum, order) =>
        sum + (parseFloat(order.delivery_price) || 0), 0
    );

    // Liczba sprzedanych książek - tylko opłacone (uwzględnia ilość w zamówieniu)
    const booksSold = paidOrders.reduce((sum, order) =>
        sum + (parseInt(order.quantity) || 1), 0
    );

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
    const quantity = formData.quantity || 1;
    const booksPrice = calculateBooksPrice(quantity);
    const deliveryPrice = calculateDeliveryPrice(formData.deliveryMethod);
    const totalPrice = calculateTotalPrice(formData.deliveryMethod, quantity);

    return {
        quantity,
        bookPrice: BOOK_PRICE,
        booksPrice,
        deliveryPrice,
        totalPrice,
        formattedBookPrice: formatPrice(BOOK_PRICE),
        formattedBooksPrice: formatPrice(booksPrice),
        formattedDeliveryPrice: formatPrice(deliveryPrice),
        formattedTotalPrice: formatPrice(totalPrice)
    };
};

// === KONWERSJA CEN DO BAZY DANYCH ===

export const prepareOrderPrices = (deliveryMethod, quantity = 1) => {
    return {
        quantity,
        book_price: BOOK_PRICE,
        books_total_price: calculateBooksPrice(quantity),
        delivery_price: calculateDeliveryPrice(deliveryMethod),
        total_price: calculateTotalPrice(deliveryMethod, quantity)
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