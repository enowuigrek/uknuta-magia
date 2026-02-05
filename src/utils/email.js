import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, CONTACT_INFO, PICKUP_LOCATIONS } from './constants.js';
import { formatPrice } from './priceCalculations.js';

// === INICJALIZACJA EMAILJS ===

export const initializeEmailJS = () => {
    emailjs.init(EMAIL_CONFIG.publicKey);
};

// === PRZYGOTOWANIE DANYCH DO SZABLONÓW EMAIL ===

const prepareEmailTemplateData = (orderData, orderId, prices) => {
    const deliveryMethodNames = {
        pickup: 'Odbiór osobisty',
        parcel: 'Paczkomat InPost',
        courier: 'Wysyłka kurierska'
    };

    const baseData = {
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        delivery_method: deliveryMethodNames[orderData.deliveryMethod],
        book_price: formatPrice(prices.bookPrice),
        delivery_price: formatPrice(prices.deliveryPrice),
        total_price: formatPrice(prices.totalPrice),
        order_id: orderId || 'N/A',
        payment_status: '⏳ OCZEKUJE PŁATNOŚCI',
        bank_account: CONTACT_INFO.bankAccount,
        bank_name: CONTACT_INFO.bankName,
        payment_title: `Zamówienie #${orderId} - ${orderData.name}`,
        contact_phone: CONTACT_INFO.phone,
        contact_email: CONTACT_INFO.email,
        cash_payment: orderData.deliveryMethod === 'pickup' ?
            'Można również zapłacić gotówką przy odbiorze' : ''
    };

    // Dodaj dane specyficzne dla metody dostawy
    return addDeliverySpecificData(baseData, orderData);
};

const addDeliverySpecificData = (templateData, orderData) => {
    // Resetuj wszystkie pola dostawy
    templateData.street = '';
    templateData.zip = '';
    templateData.city = '';
    templateData.parcel_locker = '';
    templateData.pickup_location = '';
    templateData.full_address = '';

    switch (orderData.deliveryMethod) {
        case 'courier':
            templateData.street = orderData.street;
            templateData.zip = orderData.zip;
            templateData.city = orderData.city;
            templateData.full_address = `${orderData.street}, ${orderData.zip} ${orderData.city}`;
            break;

        case 'parcel':
            templateData.parcel_locker = orderData.parcelLocker;
            break;

        case 'pickup':
            templateData.pickup_location = PICKUP_LOCATIONS[orderData.pickupLocation] || '';
            break;
    }

    return templateData;
};

// === WYSYŁANIE EMAILI ===

export const sendOrderEmails = async (orderData, orderId, prices) => {
    try {
        const templateParams = prepareEmailTemplateData(orderData, orderId, prices);

        // Wyślij email do klienta
        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateIDClient,
            templateParams,
            EMAIL_CONFIG.publicKey
        );
        console.log('Email do klienta wysłany');

        // Wyślij email do admina
        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateIDAdmin,
            templateParams,
            EMAIL_CONFIG.publicKey
        );
        console.log('Email do admina wysłany');

        return true;
    } catch (error) {
        console.error('Błąd wysyłania emaili:', error);
        throw error;
    }
};

// === DODATKOWE FUNKCJE EMAIL ===

export const sendPaymentConfirmationEmail = async (orderData, orderId) => {
    try {
        const templateParams = {
            name: orderData.name,
            email: orderData.email,
            order_id: orderId,
            payment_status: '✅ PŁATNOŚĆ OTRZYMANA',
            contact_phone: CONTACT_INFO.phone,
            contact_email: CONTACT_INFO.email
        };

        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            'template_payment_confirmed', // Jeśli masz osobny szablon
            templateParams,
            EMAIL_CONFIG.publicKey
        );

        console.log('Email potwierdzający płatność wysłany');
        return true;
    } catch (error) {
        console.error('Błąd wysyłania emaila potwierdzającego:', error);
        throw error;
    }
};

export const sendShippingNotificationEmail = async (orderData, orderId, trackingNumber = null) => {
    try {
        const templateParams = {
            name: orderData.name,
            email: orderData.email,
            order_id: orderId,
            tracking_number: trackingNumber,
            delivery_method: orderData.deliveryMethod,
            contact_phone: CONTACT_INFO.phone,
            contact_email: CONTACT_INFO.email
        };

        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            'template_shipping_notification', // Jeśli masz osobny szablon
            templateParams,
            EMAIL_CONFIG.publicKey
        );

        console.log('Email z powiadomieniem o wysyłce wysłany');
        return true;
    } catch (error) {
        console.error('Błąd wysyłania emaila o wysyłce:', error);
        throw error;
    }
};

// === TESTOWANIE EMAILI ===

export const testEmailConfiguration = async () => {
    try {
        const testParams = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Test message from email configuration'
        };

        await emailjs.send(
            EMAIL_CONFIG.serviceID,
            'template_test', // Szablon testowy jeśli istnieje
            testParams,
            EMAIL_CONFIG.publicKey
        );

        console.log('Test email wysłany pomyślnie');
        return true;
    } catch (error) {
        console.error('Błąd testu konfiguracji email:', error);
        return false;
    }
};