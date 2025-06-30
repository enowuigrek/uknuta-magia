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
        deliveryMethod: '', // 'pickup', 'parcel', 'courier'
        parcelLocker: '',
        acceptTerms: false
    });

    const [orderStatus, setOrderStatus] = useState('form');
    const [orderId, setOrderId] = useState(null);

    // Ceny
    const bookPrice = 49.99;
    const deliveryPrices = {
        pickup: 0,
        parcel: 16.99,
        courier: 19.99
    };

    const getTotalPrice = () => {
        const deliveryPrice = deliveryPrices[formData.deliveryMethod] || 0;
        return bookPrice + deliveryPrice;
    };

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

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const saveOrderToDatabase = async (orderData) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        name: orderData.name,
                        email: orderData.email,
                        phone: orderData.phone,
                        street: orderData.street || null,
                        zip: orderData.zip || null,
                        city: orderData.city || null,
                        delivery_method: orderData.deliveryMethod,
                        parcel_locker: orderData.parcelLocker || null,
                        book_price: bookPrice,
                        delivery_price: deliveryPrices[orderData.deliveryMethod],
                        total_price: getTotalPrice(),
                        status: 'new'
                    }
                ])
                .select();

            if (error) {
                console.error('Błąd zapisu do bazy:', error);
                throw error;
            }

            console.log('Zamówienie zapisane do bazy:', data);
            return data[0];
        } catch (error) {
            console.error('Błąd podczas zapisu do bazy:', error);
            throw error;
        }
    };

    const sendEmails = async (orderData, orderId = null) => {
        try {
            const serviceID = 'service_m7597lc';
            const templateIDClient = 'template_aie1jbf';
            const templateIDAdmin = 'template_q18c56b';
            const publicKey = 'WTc0uBQgaiID5YGr-';

            const deliveryMethodNames = {
                pickup: 'Odbiór osobisty',
                parcel: 'Paczkomat InPost',
                courier: 'Wysyłka kurierska'
            };

            // Przygotuj podstawowe dane
            const templateParams = {
                name: orderData.name,
                email: orderData.email,
                phone: orderData.phone,
                delivery_method: deliveryMethodNames[orderData.deliveryMethod],
                book_price: bookPrice.toFixed(2),
                delivery_price: deliveryPrices[orderData.deliveryMethod].toFixed(2),
                total_price: getTotalPrice().toFixed(2),
                order_id: orderId || 'N/A'
            };

            // Dodaj dane w zależności od metody dostawy
            if (orderData.deliveryMethod === 'courier') {
                // Dla kuriera - adres dostawy
                templateParams.street = orderData.street;
                templateParams.zip = orderData.zip;
                templateParams.city = orderData.city;
                templateParams.parcel_locker = '';
                templateParams.full_address = `${orderData.street}, ${orderData.zip} ${orderData.city}`;
            } else if (orderData.deliveryMethod === 'parcel') {
                // Dla paczkomatu - numer paczkomatu
                templateParams.parcel_locker = orderData.parcelLocker;
                templateParams.street = '';
                templateParams.zip = '';
                templateParams.city = '';
                templateParams.full_address = '';
            } else if (orderData.deliveryMethod === 'pickup') {
                // Dla odbioru osobistego - wszystko puste
                templateParams.parcel_locker = '';
                templateParams.street = '';
                templateParams.zip = '';
                templateParams.city = '';
                templateParams.full_address = '';
            }

            // Wyślij emaile
            await emailjs.send(serviceID, templateIDClient, templateParams, publicKey);
            console.log('Email do klienta wysłany');

            await emailjs.send(serviceID, templateIDAdmin, templateParams, publicKey);
            console.log('Email do admina wysłany');

            return true;
        } catch (error) {
            console.error('Błąd wysyłania emaili:', error);
            throw error;
        }
    };

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

        if (!formData.deliveryMethod) {
            alert('Wybierz metodę dostawy.');
            return;
        }

        if (formData.deliveryMethod === 'parcel' && !formData.parcelLocker) {
            alert('Wpisz numer paczkomatu.');
            return;
        }

        if (formData.deliveryMethod === 'courier' && (!formData.street || !formData.zip || !formData.city)) {
            alert('Wypełnij adres dostawy.');
            return;
        }

        setOrderStatus('processing');

        try {
            console.log('Zapisywanie zamówienia do bazy...');
            const savedOrder = await saveOrderToDatabase(formData);
            setOrderId(savedOrder.id);

            console.log('Wysyłanie emaili...');
            await sendEmails(formData, savedOrder.id);

            await updateOrderStatus(savedOrder.id, 'email_sent');

            console.log('Formularz przetworzony pomyślnie!');

            setTimeout(() => {
                setOrderStatus('success');
                updateOrderStatus(savedOrder.id, 'awaiting_payment');
            }, 1500);

        } catch (error) {
            console.error('Błąd:', error);

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
                <h2>Zamówienie złożone!</h2>
                <p>Dziękujemy za zakup książki <strong>„Uknuta Magia"</strong></p>
                {orderId && (
                    <div className={styles.orderNumber}>
                        <span>Numer zamówienia: <strong>#{orderId}</strong></span>
                    </div>
                )}
                <div className={styles.nextSteps}>
                    <p>✉️ <strong>Potwierdzenie wysłane</strong> - sprawdź swoją skrzynkę email</p>
                    <p>📦 <strong>Przygotowanie wysyłki</strong> - skontaktujemy się w ciągu 24h</p>
                </div>
                <div className={styles.successActions}>
                    <button
                        onClick={handleGoHome}
                        className={styles.homeButton}
                    >
                        Powrót do strony głównej
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            {/* Przycisk powrotu do strony głównej */}
            <div className={styles.headerNav}>
                <button
                    onClick={handleGoHome}
                    className={styles.backButton}
                    type="button"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l-7-7 7-7" />
                    </svg>
                    Powrót do strony głównej
                </button>
            </div>

            {/* Sekcja z okładką i ceną */}
            <div className={styles.bookPrice}>
                <img
                    src="/cover-small.png"
                    alt="Okładka książki Uknuta Magia"
                    className={styles.bookCover}
                />
                <div className={styles.bookInfo}>
                    <h2>„Uknuta Magia"</h2>
                    <div className={styles.price}>
                        <span className={styles.priceAmount}>{bookPrice.toFixed(2)} zł</span>
                    </div>
                </div>
            </div>

            <h1>Dane do zamówienia</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Dane osobowe */}
                <div className={styles.sectionTitle}>📝 Dane kontaktowe</div>

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

                {/* Metoda dostawy */}
                <div className={styles.sectionTitle}>🚚 Wybierz metodę dostawy</div>

                <div className={styles.deliveryOptions}>
                    <label className={styles.deliveryOption}>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="pickup"
                            checked={formData.deliveryMethod === 'pickup'}
                            onChange={handleChange}
                        />
                        <div className={styles.deliveryCard}>
                            <div className={styles.deliveryIcon}>🏠</div>
                            <div className={styles.deliveryContent}>
                                <div className={styles.deliveryName}>Odbiór osobisty</div>
                                <div className={styles.deliveryPrice}>0,00 zł</div>
                            </div>
                        </div>
                    </label>

                    <label className={styles.deliveryOption}>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="parcel"
                            checked={formData.deliveryMethod === 'parcel'}
                            onChange={handleChange}
                        />
                        <div className={styles.deliveryCard}>
                            <div className={styles.deliveryIcon}>📦</div>
                            <div className={styles.deliveryContent}>
                                <div className={styles.deliveryName}>Paczkomat InPost</div>
                                <div className={styles.deliveryPrice}>16,99 zł</div>
                            </div>
                        </div>
                    </label>

                    <label className={styles.deliveryOption}>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="courier"
                            checked={formData.deliveryMethod === 'courier'}
                            onChange={handleChange}
                        />
                        <div className={styles.deliveryCard}>
                            <div className={styles.deliveryIcon}>🚚</div>
                            <div className={styles.deliveryContent}>
                                <div className={styles.deliveryName}>Wysyłka kurierska</div>
                                <div className={styles.deliveryPrice}>19,99 zł</div>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Pole paczkomatu */}
                {formData.deliveryMethod === 'parcel' && (
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Numer paczkomatu InPost *
                            <input
                                type="text"
                                name="parcelLocker"
                                value={formData.parcelLocker}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="np. KRA01M"
                                required
                            />
                        </label>
                    </div>
                )}

                {/* Adres dla wysyłki kurierskiej */}
                {formData.deliveryMethod === 'courier' && (
                    <>
                        <div className={styles.sectionTitle}>📍 Adres dostawy</div>

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
                    </>
                )}

                {/* Informacja o odbiorze osobistym */}
                {formData.deliveryMethod === 'pickup' && (
                    <div className={styles.pickupInfo}>
                        <div className={styles.pickupHeader}>ℹ️ Informacje o odbiorze</div>
                        <p>Po potwierdzeniu zamówienia skontaktujemy się z Tobą w celu ustalenia szczegółów odbioru.</p>
                        <p><strong>Lokalizacja:</strong> Częstochowa</p>
                    </div>
                )}

                {/* Podsumowanie */}
                {formData.deliveryMethod && (
                    <div className={styles.orderSummary}>
                        <div className={styles.summaryTitle}>💰 Podsumowanie zamówienia</div>
                        <div className={styles.summaryLine}>
                            <span>Książka „Uknuta Magia"</span>
                            <span>{bookPrice.toFixed(2)} zł</span>
                        </div>
                        <div className={styles.summaryLine}>
                            <span>Dostawa</span>
                            <span>{deliveryPrices[formData.deliveryMethod].toFixed(2)} zł</span>
                        </div>
                        <div className={styles.summaryTotal}>
                            <span>RAZEM</span>
                            <span>{getTotalPrice().toFixed(2)} zł</span>
                        </div>
                    </div>
                )}

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
                            {formData.deliveryMethod ?
                                `Przejdź do płatności - ${getTotalPrice().toFixed(2)} zł` :
                                'Wybierz metodę dostawy'
                            }
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}