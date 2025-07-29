// src/hooks/useOrderForm.js

import { useState, useEffect } from 'react';
import { useFormValidation } from './useFormValidation.js';
import { saveOrderToDatabase } from '../utils/api.js';
import { sendOrderEmails, initializeEmailJS } from '../utils/email.js';
import { createOrderSummary } from '../utils/priceCalculations.js';

const initialFormData = {
    name: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    deliveryMethod: '',
    parcelLocker: '',
    pickupLocation: ''
};

export const useOrderForm = () => {
    const [orderStatus, setOrderStatus] = useState('form'); // 'form', 'processing', 'payment_pending', 'success'
    const [orderId, setOrderId] = useState(null);

    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldError,
        setIsSubmitting
    } = useFormValidation(initialFormData);

    // Inicjalizacja EmailJS przy ładowaniu
    useEffect(() => {
        initializeEmailJS();
    }, []);

    // Scroll do góry przy zmianie statusu
    useEffect(() => {
        if (orderStatus !== 'form') {
            window.scrollTo(0, 0);
        }
    }, [orderStatus]);

    // Oblicz ceny
    const orderSummary = createOrderSummary(formData);

    // Obsługa submitowania formularza
    const submitOrder = async (sanitizedData) => {
        setOrderStatus('processing');

        try {
            console.log('Zapisywanie zamówienia do bazy...');
            const savedOrder = await saveOrderToDatabase(sanitizedData);
            setOrderId(savedOrder.id);

            console.log('Wysyłanie emaili z danymi do płatności...');
            await sendOrderEmails(sanitizedData, savedOrder.id, orderSummary);

            console.log('Zamówienie złożone - oczekuje na płatność');
            setTimeout(() => {
                setOrderStatus('payment_pending');
            }, 1500);

        } catch (error) {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.');
            setOrderStatus('form');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(submitOrder);
    };

    // Sprawdź czy formularz może być wysłany
    const canSubmit = formData.deliveryMethod && !isSubmitting;

    // Dodatkowe walidacje specyficzne dla zamówienia
    const additionalValidation = () => {
        if (!formData.deliveryMethod) {
            return 'Wybierz metodę dostawy.';
        }

        if (formData.deliveryMethod === 'parcel' && !formData.parcelLocker) {
            return 'Wpisz numer paczkomatu.';
        }

        if (formData.deliveryMethod === 'courier' &&
            (!formData.street || !formData.zip || !formData.city)) {
            return 'Wypełnij adres dostawy.';
        }

        if (formData.deliveryMethod === 'pickup' && !formData.pickupLocation) {
            return 'Wybierz miejsce odbioru.';
        }

        return null;
    };

    const validationError = additionalValidation();

    return {
        // Stan formularza
        formData,
        errors,
        isSubmitting,
        orderStatus,
        orderId,
        orderSummary,

        // Funkcje obsługi
        handleChange,
        handleBlur,
        onSubmit,
        getFieldError,

        // Walidacja
        canSubmit,
        validationError,

        // Kontrola stanu
        setOrderStatus,
        setIsSubmitting
    };
};

// Hook dla stanu zamówienia (do wyświetlania różnych ekranów)
export const useOrderStatus = () => {
    const [status, setStatus] = useState('form');
    const [orderId, setOrderId] = useState(null);

    const goToForm = () => {
        setStatus('form');
        setOrderId(null);
    };

    const goToProcessing = () => {
        setStatus('processing');
    };

    const goToPaymentPending = (id) => {
        setStatus('payment_pending');
        setOrderId(id);
    };

    const goToSuccess = (id) => {
        setStatus('success');
        setOrderId(id);
    };

    const goToHome = () => {
        window.location.href = '/';
    };

    return {
        status,
        orderId,
        goToForm,
        goToProcessing,
        goToPaymentPending,
        goToSuccess,
        goToHome,
        isForm: status === 'form',
        isProcessing: status === 'processing',
        isPaymentPending: status === 'payment_pending',
        isSuccess: status === 'success'
    };
};