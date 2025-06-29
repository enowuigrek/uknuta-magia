import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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
    //const [showParcelPopup, setShowParcelPopup] = useState(false);

    // Inicjalizacja EmailJS
    useEffect(() => {
        // WKLEJ TUTAJ SWÓJ PUBLIC KEY Z EMAILJS
        emailjs.init("WTc0uBQgaiID5YGr-");
    }, []);

    /*
    useEffect(() => {
        // Listener dla wyboru paczkomatu z HTML
        const handlePointSelection = (event) => {
            const point = event.detail;
            console.log('Wybrany paczkomat:', point);

            setFormData(prev => ({
                ...prev,
                parcelLocker: `${point.name} (${point.address.line1})`
            }));

            setParcelDetails({
                name: point.name,
                location_description: point.address.line1,
                address: point.address
            });

            setShowParcelPopup(false);
        };

        window.addEventListener('inpostPointSelected', handlePointSelection);

        return () => {
            window.removeEventListener('inpostPointSelected', handlePointSelection);
        };
    }, []);
    */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    //const handleChooseParcelLocker = () => {
    //    setShowParcelPopup(true);
    //};

    // Funkcja wysyłania emaili
    const sendEmails = async (orderData) => {
        try {
            await emailjs.send(
                'service_2hs9kpo',
                'template_ale1jbf',
                {
                    name: orderData.name,
                    email: orderData.email,
                    phone: orderData.phone,
                    street: orderData.street,
                    zip: orderData.zip,
                    city: orderData.city,
                    parcelLocker: orderData.parcelLocker,
                },
                'XUgiwt0PDa7phqZpC'
            ).then(
                (result) => {
                    console.log('SUCCESS!', result.text);
                    // Tu możesz dodać przekierowanie albo info o sukcesie
                },
                (error) => {
                    console.log('FAILED...', error.text);
                }
            );

            console.log('Oba emaile wysłane pomyślnie!');
            return true;

        } catch (error) {
            console.error('Błąd wysyłania emaili:', error);
            throw error;
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
            // Wysyłanie emaili
            await sendEmails(formData);

            const serviceID = 'service_m7597lc';
            const templateIDClient = 'template_aie1jbf';
            const templateIDAdmin = 'template_q18c56b';
            const publicKey = 'WTc0uBQgaiID5YGr-';

            const templateParams = {
                fullName: formData.name,
                email: formData.email,
                phone: formData.phone,
                street: formData.street,
                zip: formData.zip,
                city: formData.city,
                parcelLocker: formData.parcelLocker
            };

            // Wyślij do klienta
            emailjs.send(serviceID, templateIDClient, templateParams, publicKey)
                .then((result) => {
                    console.log('Email do klienta wysłany:', result.text);
                }, (error) => {
                    console.error('Błąd przy wysyłce do klienta:', error);
                });

            // Wyślij do siebie (admina)
            emailjs.send(serviceID, templateIDAdmin, templateParams, publicKey)
                .then((result) => {
                    console.log('Email do admina wysłany:', result.text);
                }, (error) => {
                    console.error('Błąd przy wysyłce do admina:', error);
                });

            console.log('Formularz wysłany:', formData);

            // Przekierowanie do płatności (na razie symulacja)
            setTimeout(() => {
                setOrderStatus('success');
                // W rzeczywistości tutaj będzie przekierowanie do PayPal/tpay
            }, 1500);

        } catch (error) {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas wysyłania. Spróbuj ponownie.');
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
                            Wysyłanie...
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

            {/* InPost GeoWidget Popup */}
            {/* {showParcelPopup && (
                <div className={styles.parcelPopup}>
                    <div className={styles.parcelPopupContent}>
                        <div className={styles.parcelPopupHeader}>
                            <h3>Wybierz paczkomat InPost</h3>
                            <button
                                type="button"
                                onClick={() => setShowParcelPopup(false)}
                                className={styles.closeButton}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.geowidgetContainer}>
                            <inpost-geowidget
                                onpoint="handleInPostSelection"
                                token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWc4RFhqdTBkZGNuNWItV1RUN2tFIn0.eyJleHAiOjQ4NjgzNzEyMDAsImlhdCI6MTcxNDczMTIwMCwianRpIjoiMzIzMjMwMTQtZDA5Zi00NzQwLTgzNDctYmQzOTBiYzE5MDBkIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvaW5wb3N0IiwiYXVkIjoiaW5wb3N0LWdlb3dpZGdldC1hcGkiLCJzdWIiOiJmODMwNGE2OS0wZTQ1LTQ3NjItOGE1My02YmQxMWYzMjhjMzciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsImFjciI6IjEiLCJzY29wZSI6Im9wZW5pZCBnZW93aWRnZXQtYXBpOmFwaXBvaW50cyIsIm9yZ2FuaXphdGlvbl9pZCI6MzMsInNlcnZpY2VzIjpbInBhcmNlbF9sb2NrZXIiXSwiZ2VvX3dpZGdldF9jb25maWciOnsiZGlzcGxheV9tYXBfYWZ0ZXJfbG9hZGluZyI6dHJ1ZSwidGhlbWUiOiJkZWZhdWx0In19.uoJoMtWlLKBqGgaoaQhp9P9pjnecjSsL9BIr4M_fxWQ4cMr7qnX-xJ-EauNLtxfEhL5X6B6BClQ5Yo2x0xkTq7CTXG-6D0BKC8mqGUJMN1xAjPVRJGb-GN0y5Ey9Jk4J56B2SsjMhHMrDJ1lINJ8V3ORdA-MqrNfkMOY-k5y_lQJQlMmBF2OBNyC2N5MK-vKQCGqVzBLk5F5MLlcKB3wNgIzBQVkFP3qOF5Qp_NjlLjUkz0LzmJzfSzOjBfCJJJm5EZ5o9CtENOmEXDbVE4OMlLuXBX0wNlJy5EXFM0m5yFjm1OE1NpPL0VKn9oNzUzJz5KzmjMy1RUZ1z1FjGSg"
                                language="pl"
                                config="parcelCollect"
                            />
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}

//service_m7597lc
const serviceID = 'default_service';
const templateID = 'template_aie1jbf';
const publicKey = 'xYkXJ7Fcr4K0eZXqB';
const emailEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';