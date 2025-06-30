import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from "../../config/supabase";
import styles from './OrderForm.module.scss';

export function OrderForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        zip: '',
        city: '',
        parcelLocker: '',
        acceptTerms: false
    });

    const [parcelDetails, setParcelDetails] = useState(null);
    const [orderStatus, setOrderStatus] = useState('form'); // form, processing, success
    const [orderId, setOrderId] = useState(null); // Przechowujemy ID zamówienia

    // Inicjalizacja EmailJS
    useEffect(() => {
        emailjs.init("WTc0uBQgaiID5YGr-");
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Funkcja zapisywania zamówienia do Supabase
    const saveOrderToDatabase = async (orderData) => {
        try {
            const { data, error } = await supabase
                .from('orders') // Zmień nazwę tabeli jeśli potrzeba
                .insert([
                    {
                        name: orderData.name,
                        email: orderData.email,
                        phone: orderData.phone,
                        street: orderData.street,
                        zip: orderData.zip,
                        city: orderData.city,
                        parcel_locker: orderData.parcelLocker,
                        status: 'new'
                    }
                ])
                .select();

            if (error) {
                console.error('Błąd zapisu do bazy:', error);
                throw error;
            }

            console.log('Zamówienie zapisane do bazy:', data);
            return data[0]; // Zwracamy zapisane zamówienie z ID
        } catch (error) {
            console.error('Błąd podczas zapisu do bazy:', error);
            throw error;
        }
    };

    // Funkcja wysyłania emaili
    const sendEmails = async (orderData, orderId = null) => {
        try {
            const serviceID = 'service_m7597lc';
            const templateIDClient = 'template_aie1jbf';
            const templateIDAdmin = 'template_q18c56b';
            const publicKey = 'WTc0uBQgaiID5YGr-';

            const templateParams = {
                name: orderData.name,                    // ← zmienione z fullName
                email: orderData.email,
                phone: orderData.phone,
                street: orderData.street,
                zip: orderData.zip,
                city: orderData.city,
                parcel_locker: orderData.parcelLocker,   // ← zmienione z parcelLocker
                order_id: orderId || 'N/A'
            };

            // Wyślij do klienta
            await emailjs.send(serviceID, templateIDClient, templateParams, publicKey);
            console.log('Email do klienta wysłany');

            // Wyślij do siebie (admina)
            await emailjs.send(serviceID, templateIDAdmin, templateParams, publicKey);
            console.log('Email do admina wysłany');

            return true;
        } catch (error) {
            console.error('Błąd wysyłania emaili:', error);
            throw error;
        }
    };

    // Funkcja aktualizacji statusu zamówienia
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                console.error('Błąd aktualizacji statusu:', error);
                throw error;
            }

            console.log(`Status zamówienia ${orderId} zmieniony na: ${newStatus}`);
        } catch (error) {
            console.error('Błąd podczas aktualizacji statusu:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.acceptTerms) {
            alert('Musisz zaakceptować regulamin.');
            return;
        }

        if (!formData.parcelLocker) {
            alert('Wpisz numer paczkomatu.');
            return;
        }

        setOrderStatus('processing');

        try {
            // 1. Zapisz zamówienie do bazy danych
            console.log('Zapisywanie zamówienia do bazy...');
            const savedOrder = await saveOrderToDatabase(formData);
            setOrderId(savedOrder.id);

            // 2. Wyślij emaile
            console.log('Wysyłanie emaili...');
            await sendEmails(formData, savedOrder.id);

            // 3. Aktualizuj status na "email_sent"
            await updateOrderStatus(savedOrder.id, 'email_sent');

            console.log('Formularz przetworzony pomyślnie!');

            // Przekierowanie do płatności (na razie symulacja)
            setTimeout(() => {
                setOrderStatus('success');
                // Tutaj możesz zaktualizować status na "awaiting_payment"
                updateOrderStatus(savedOrder.id, 'awaiting_payment');
            }, 1500);

        } catch (error) {
            console.error('Błąd:', error);

            // Jeśli mamy ID zamówienia, oznacz jako błąd
            if (orderId) {
                await updateOrderStatus(orderId, 'error');
            }

            alert('Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.');
            setOrderStatus('form');
        }
    };

    if (orderStatus === 'success') {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                    <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2>Dziękujemy!</h2>
                <p>Zamówienie zostało przyjęte. Sprawdź swoją skrzynkę email po więcej informacji.</p>
                <p><strong>Na Twój email wysłaliśmy potwierdzenie zamówienia.</strong></p>
                {orderId && <p><small>Numer zamówienia: {orderId}</small></p>}
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <h1>Zamów książkę</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        Imię i nazwisko *
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Adrian Knut"
                            required
                        />
                    </label>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        Adres e-mail *
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="adrian@uknutamagia.pl"
                            required
                        />
                    </label>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        Telefon *
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="555 666 777"
                            required
                        />
                    </label>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        Ulica i numer domu *
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="ul. Przykładowa 123"
                            required
                        />
                    </label>
                </div>

                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Kod pocztowy *
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="42-200"
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Miasto *
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Częstochowa"
                                required
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        Paczkomat InPost *
                        <input
                            type="text"
                            name="parcelLocker"
                            value={formData.parcelLocker}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Wpisz numer paczkomatu"
                            required
                        />
                    </label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span className={styles.checkboxCustom}></span>
                        Akceptuję regulamin i politykę prywatności *
                    </label>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={orderStatus === 'processing'}
                >
                    {orderStatus === 'processing' ? (
                        <>
                            <div className={styles.spinner}></div>
                            Przetwarzanie...
                        </>
                    ) : (
                        <>
                            <svg className={styles.creditCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x={1} y={4} width={22} height={16} rx={2} ry={2} />
                                <line x1={1} y1={10} x2={23} y2={10} />
                            </svg>
                            Przejdź do płatności - 66,98 zł
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}