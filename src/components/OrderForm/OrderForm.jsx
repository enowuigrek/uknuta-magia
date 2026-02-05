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
        pickupLocation: '' // NOWE: lokalizacja odbioru osobistego
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

    // NOWE: Opcje miejsc odbioru
    const pickupLocations = {
        czestochowa: 'Częstochowa',
        raciszyn: 'Raciszyn/Działoszyna'
    };

    const getTotalPrice = () => {
        const deliveryPrice = deliveryPrices[formData.deliveryMethod] || 0;
        return bookPrice + deliveryPrice;
    };

    // Scroll do góry przy załadowaniu komponentu
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        pickup_location: orderData.pickupLocation || null, // NOWE: zapis miejsca odbioru
                        book_price: bookPrice,
                        delivery_price: deliveryPrices[orderData.deliveryMethod],
                        total_price: getTotalPrice(),
                        status: 'awaiting_payment'
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
                order_id: orderId || 'N/A',
                payment_status: '⏳ OCZEKUJE PŁATNOŚCI',
                bank_account: '48 1020 1664 0000 3402 0185 2193',
                bank_name: 'PKO Bank Polski',
                payment_title: `Zamówienie #${orderId} - ${orderData.name}`,
                contact_phone: '883 348 381',
                contact_email: 'uknutamagia@gmail.com',
                cash_payment: orderData.deliveryMethod === 'pickup' ? 'Można również zapłacić gotówką przy odbiorze' : ''
            };

            // Dodaj dane w zależności od metody dostawy
            if (orderData.deliveryMethod === 'courier') {
                templateParams.street = orderData.street;
                templateParams.zip = orderData.zip;
                templateParams.city = orderData.city;
                templateParams.parcel_locker = '';
                templateParams.pickup_location = '';
                templateParams.full_address = `${orderData.street}, ${orderData.zip} ${orderData.city}`;
            } else if (orderData.deliveryMethod === 'parcel') {
                templateParams.parcel_locker = orderData.parcelLocker;
                templateParams.street = '';
                templateParams.zip = '';
                templateParams.city = '';
                templateParams.pickup_location = '';
                templateParams.full_address = '';
            } else if (orderData.deliveryMethod === 'pickup') {
                templateParams.parcel_locker = '';
                templateParams.street = '';
                templateParams.zip = '';
                templateParams.city = '';
                templateParams.pickup_location = pickupLocations[orderData.pickupLocation] || ''; // NOWE: lokalizacja odbioru
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

        // NOWE: Walidacja miejsca odbioru
        if (formData.deliveryMethod === 'pickup' && !formData.pickupLocation) {
            alert('Wybierz miejsce odbioru.');
            return;
        }

        setOrderStatus('processing');

        try {
            console.log('Zapisywanie zamówienia do bazy...');
            const savedOrder = await saveOrderToDatabase(formData);
            setOrderId(savedOrder.id);

            console.log('Wysyłanie emaili z danymi do płatności...');
            await sendEmails(formData, savedOrder.id);

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

    if (orderStatus === 'payment_pending') {
        return (
            <div className={styles.formContainer}>
                <h1>Zamówienie złożone!</h1>

                {orderId && (
                    <div className={styles.orderNumber}>
                        <span>Numer zamówienia: <strong>#{orderId}</strong></span>
                    </div>
                )}

                {/* Instrukcje płatności */}
                <div className={styles.orderSummary}>
                    <div className={styles.summaryTitle}>💳 Jak zapłacić za zamówienie?</div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ marginBottom: '10px', color: '#2196F3' }}>📱 BLIK - przelew na telefon</h3>
                        <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                            Zrób przelew BLIK na numer telefonu:
                        </p>
                        <div style={{
                            backgroundColor: '#e3f2fd',
                            padding: '10px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            883 348 381
                        </div>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            <strong>Tytuł przelewu:</strong> Zamówienie #{orderId} - {formData.name}
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ marginBottom: '10px', color: '#00C851' }}>🏛️ Przelew tradycyjny</h3>
                        <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                            <strong>Bank:</strong> PKO Bank Polski
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                            <strong>Numer konta:</strong>
                        </p>
                        <div style={{
                            backgroundColor: '#e8f5e8',
                            padding: '10px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            marginBottom: '10px'
                        }}>
                            48 1020 1664 0000 3402 0185 2193
                        </div>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            <strong>Tytuł przelewu:</strong> Zamówienie #{orderId} - {formData.name}
                        </p>
                    </div>

                    {formData.deliveryMethod === 'pickup' && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ marginBottom: '10px', color: '#FF9800' }}>💵 Gotówka przy odbiorze</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                Możesz również zapłacić gotówką przy osobistym odbiorze książki
                            </p>
                        </div>
                    )}

                    <div style={{
                        backgroundColor: '#fff3e0',
                        padding: '15px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginTop: '20px'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#F57C00' }}>
                            💰 Kwota do zapłaty: {getTotalPrice().toFixed(2)} zł
                        </h4>
                        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                            Po otrzymaniu płatności prześlemy potwierdzenie<br/>
                            i przygotujemy zamówienie do wysyłki
                        </p>
                    </div>
                </div>

                {/* Podsumowanie zamówienia */}
                <div className={styles.orderSummary}>
                    <div className={styles.summaryTitle}>📋 Szczegóły zamówienia</div>
                    <div className={styles.summaryLine}>
                        <span>Imię i nazwisko:</span>
                        <span>{formData.name}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Email:</span>
                        <span>{formData.email}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Telefon:</span>
                        <span>{formData.phone}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Dostawa:</span>
                        <span>
                            {formData.deliveryMethod === 'pickup' && `Odbiór osobisty - ${pickupLocations[formData.pickupLocation]}`}
                            {formData.deliveryMethod === 'parcel' && `Paczkomat ${formData.parcelLocker}`}
                            {formData.deliveryMethod === 'courier' && `${formData.street}, ${formData.zip} ${formData.city}`}
                        </span>
                    </div>
                </div>

                {/* Okładka książki */}
                <div className={styles.bookPrice}>
                    <img
                        src="/cover-small.png"
                        alt="Okładka książki Uknuta Magia"
                        className={styles.bookCover}
                    />
                    <div className={styles.bookInfo}>
                        <h2>„Uknuta Magia"</h2>
                        <div className={styles.price}>
                            <span className={styles.priceAmount}>{getTotalPrice().toFixed(2)} zł</span>
                        </div>
                    </div>
                </div>

                {/* Następne kroki */}
                <div className={styles.orderSummary}>
                    <div className={styles.summaryTitle}>📧 Co dalej?</div>
                    <div style={{ padding: '10px 0' }}>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>
                            ✉️ <strong>Email wysłany</strong> - sprawdź swoją skrzynkę
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>
                            💳 <strong>Dokonaj płatności</strong> - BLIK, przelew{formData.deliveryMethod === 'pickup' ? ' lub gotówka przy odbiorze' : ''}
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>
                            📦 <strong>Przygotowanie wysyłki</strong> - po otrzymaniu płatności
                        </p>
                    </div>
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

    if (orderStatus === 'success') {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                    <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2>Zamówienie opłacone!</h2>
                <p>Dziękujemy za zakup książki <strong>„Uknuta Magia"</strong></p>
                {orderId && (
                    <div className={styles.orderNumber}>
                        <span>Numer zamówienia: <strong>#{orderId}</strong></span>
                    </div>
                )}
                <div className={styles.nextSteps}>
                    <p>✅ <strong>Płatność otrzymana</strong> - zamówienie opłacone</p>
                    <p>✉️ <strong>Potwierdzenie wysłane</strong> - sprawdź swoją skrzynkę email</p>
                    <p>📦 <strong>Przygotowanie wysyłki</strong> - skontaktujemy się wkrótce</p>
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
                        <span className={styles.priceAmount} style={{ fontFamily: 'inherit' }}>{bookPrice.toFixed(2)} zł</span>
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

                {/* NOWE: Wybór miejsca odbioru dla pickup */}
                {formData.deliveryMethod === 'pickup' && (
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Miejsce odbioru *
                            <select
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            >
                                <option value="">Wybierz miejsce odbioru</option>
                                <option value="czestochowa">Częstochowa</option>
                                <option value="raciszyn">Raciszyn/Działoszyna</option>
                            </select>
                        </label>
                    </div>
                )}

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
                {formData.deliveryMethod === 'pickup' && formData.pickupLocation && (
                    <div className={styles.pickupInfo}>
                        <div className={styles.pickupHeader}>ℹ️ Informacje o odbiorze</div>
                        <p>Po potwierdzeniu zamówienia skontaktujemy się z Tobą w celu ustalenia szczegółów odbioru.</p>
                        <p><strong>Lokalizacja:</strong> {pickupLocations[formData.pickupLocation]}</p>
                    </div>
                )}

                {/* DODANA: Krótka informacja RODO */}
                <div className={styles.rodoBanner}>
                    <p>
                        ℹ️ <strong>Dane osobowe:</strong> Podane dane będą przetwarzane wyłącznie w celu realizacji sprzedaży i kontaktu.
                    </p>
                    <p>Sprzedaż okazjonalna zgodna z obowiązującymi przepisami prawa.</p>
                </div>

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
                                `Złóż zamówienie - ${getTotalPrice().toFixed(2)} zł` :
                                'Wybierz metodę dostawy'
                            }
                        </>
                    )}
                </button>
            </form>

            {/* Przycisk powrotu na dole */}
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