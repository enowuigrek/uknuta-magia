import { useEffect } from 'react';
import { useOrderForm } from '../../hooks/useOrderForm.js';
import {
    BOOK_PRICE,
    DELIVERY_PRICES,
    DELIVERY_METHODS,
    PICKUP_LOCATIONS,
    CONTACT_INFO
} from '../../utils/constants.js';
import { formatPrice } from '../../utils/priceCalculations.js';
import styles from './OrderForm.module.scss';

function PaymentPendingView({ orderId, formData, orderSummary }) {
    const handleGoHome = () => {
        window.location.href = '/';
    };

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
                <div className={styles.summaryTitle}>Jak zapłacić za zamówienie?</div>

                <div className={styles.paymentSection}>
                    <h3 className={styles.paymentMethodTitle}>BLIK - przelew na telefon</h3>
                    <p className={styles.paymentDescription}>
                        Zrób przelew BLIK na numer telefonu:
                    </p>
                    <div className={styles.paymentHighlight}>
                        {CONTACT_INFO.phone}
                    </div>
                    <p className={styles.paymentNote}>
                        <strong>Tytuł przelewu:</strong> Zamówienie #{orderId} - {formData.name}
                    </p>
                </div>

                <div className={styles.paymentSection}>
                    <h3 className={styles.paymentMethodTitleBank}>Przelew tradycyjny</h3>
                    <p className={styles.paymentDescription}>
                        <strong>Bank:</strong> {CONTACT_INFO.bankName}
                    </p>
                    <p className={styles.paymentDescription}>
                        <strong>Numer konta:</strong>
                    </p>
                    <div className={styles.paymentHighlightBank}>
                        {CONTACT_INFO.bankAccount}
                    </div>
                    <p className={styles.paymentNote}>
                        <strong>Tytuł przelewu:</strong> Zamówienie #{orderId} - {formData.name}
                    </p>
                </div>

                {formData.deliveryMethod === 'pickup' && (
                    <div className={styles.paymentSection}>
                        <h3 className={styles.paymentMethodTitleCash}>Gotówka przy odbiorze</h3>
                        <p className={styles.paymentNote}>
                            Możesz również zapłacić gotówką przy osobistym odbiorze książki
                        </p>
                    </div>
                )}

                <div className={styles.paymentTotal}>
                    <h4>Kwota do zapłaty: {orderSummary.formattedTotalPrice}</h4>
                    <p>
                        Po otrzymaniu płatności prześlemy potwierdzenie
                        i przygotujemy zamówienie do wysyłki
                    </p>
                </div>
            </div>

            {/* Podsumowanie zamówienia */}
            <div className={styles.orderSummary}>
                <div className={styles.summaryTitle}>Szczegóły zamówienia</div>
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
                        {formData.deliveryMethod === 'pickup' && `Odbiór osobisty - ${PICKUP_LOCATIONS[formData.pickupLocation]}`}
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
                        <span className={styles.priceAmount}>{orderSummary.formattedTotalPrice}</span>
                    </div>
                </div>
            </div>

            {/* Następne kroki */}
            <div className={styles.orderSummary}>
                <div className={styles.summaryTitle}>Co dalej?</div>
                <div className={styles.nextStepsInline}>
                    <p><strong>Email wysłany</strong> - sprawdź swoją skrzynkę</p>
                    <p>
                        <strong>Dokonaj płatności</strong> - BLIK, przelew
                        {formData.deliveryMethod === 'pickup' ? ' lub gotówka przy odbiorze' : ''}
                    </p>
                    <p><strong>Przygotowanie wysyłki</strong> - po otrzymaniu płatności</p>
                </div>
            </div>

            <div className={styles.successActions}>
                <button onClick={handleGoHome} className={styles.homeButton}>
                    Powrót do strony głównej
                </button>
            </div>
        </div>
    );
}

function SuccessView({ orderId }) {
    const handleGoHome = () => {
        window.location.href = '/';
    };

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
                <p><strong>Płatność otrzymana</strong> - zamówienie opłacone</p>
                <p><strong>Potwierdzenie wysłane</strong> - sprawdź swoją skrzynkę email</p>
                <p><strong>Przygotowanie wysyłki</strong> - skontaktujemy się wkrótce</p>
            </div>
            <div className={styles.successActions}>
                <button onClick={handleGoHome} className={styles.homeButton}>
                    Powrót do strony głównej
                </button>
            </div>
        </div>
    );
}

function DeliveryMethodSelector({ formData, handleChange }) {
    return (
        <div className={styles.deliveryOptions}>
            {Object.values(DELIVERY_METHODS).map((method) => (
                <label key={method.key} className={styles.deliveryOption}>
                    <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.key}
                        checked={formData.deliveryMethod === method.key}
                        onChange={handleChange}
                    />
                    <div className={styles.deliveryCard}>
                        <div className={styles.deliveryIcon}>{method.icon}</div>
                        <div className={styles.deliveryContent}>
                            <div className={styles.deliveryName}>{method.name}</div>
                            <div className={styles.deliveryPrice}>{formatPrice(method.price)}</div>
                        </div>
                    </div>
                </label>
            ))}
        </div>
    );
}

function QuantitySelector({ quantity, onIncrement, onDecrement }) {
    return (
        <div className={styles.quantitySelector}>
            <span className={styles.quantityLabel}>Ilość:</span>
            <div className={styles.quantityControls}>
                <button
                    type="button"
                    onClick={onDecrement}
                    className={styles.quantityButton}
                    disabled={quantity <= 1}
                >
                    −
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                    type="button"
                    onClick={onIncrement}
                    className={styles.quantityButton}
                    disabled={quantity >= 10}
                >
                    +
                </button>
            </div>
        </div>
    );
}

function OrderSummarySection({ orderSummary }) {
    return (
        <div className={styles.orderSummary}>
            <div className={styles.summaryTitle}>Podsumowanie zamówienia</div>
            <div className={styles.summaryLine}>
                <span>Książka „Uknuta Magia" × {orderSummary.quantity}</span>
                <span>{orderSummary.formattedBooksPrice}</span>
            </div>
            <div className={styles.summaryLine}>
                <span>Dostawa</span>
                <span>{orderSummary.formattedDeliveryPrice}</span>
            </div>
            <div className={styles.summaryTotal}>
                <span>RAZEM</span>
                <span>{orderSummary.formattedTotalPrice}</span>
            </div>
        </div>
    );
}

export function OrderForm() {
    const {
        formData,
        orderStatus,
        orderId,
        orderSummary,
        handleChange,
        onSubmit,
        isSubmitting,
        incrementQuantity,
        decrementQuantity
    } = useOrderForm();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleGoHome = () => {
        window.location.href = '/';
    };

    if (orderStatus === 'payment_pending') {
        return (
            <PaymentPendingView
                orderId={orderId}
                formData={formData}
                orderSummary={orderSummary}
            />
        );
    }

    if (orderStatus === 'success') {
        return <SuccessView orderId={orderId} />;
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
                        <span className={styles.priceAmount}>{formatPrice(BOOK_PRICE)}</span>
                    </div>
                    <QuantitySelector
                        quantity={formData.quantity}
                        onIncrement={incrementQuantity}
                        onDecrement={decrementQuantity}
                    />
                </div>
            </div>

            <h1>Dane do zamówienia</h1>

            <form onSubmit={onSubmit} className={styles.form}>
                {/* Dane osobowe */}
                <div className={styles.sectionTitle}>Dane kontaktowe</div>

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
                <div className={styles.sectionTitle}>Wybierz metodę dostawy</div>

                <DeliveryMethodSelector formData={formData} handleChange={handleChange} />

                {/* Wybór miejsca odbioru dla pickup */}
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
                                {Object.entries(PICKUP_LOCATIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
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
                        <div className={styles.sectionTitle}>Adres dostawy</div>

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
                        <div className={styles.pickupHeader}>Informacje o odbiorze</div>
                        <p>Po potwierdzeniu zamówienia skontaktujemy się z Tobą w celu ustalenia szczegółów odbioru.</p>
                        <p><strong>Lokalizacja:</strong> {PICKUP_LOCATIONS[formData.pickupLocation]}</p>
                    </div>
                )}

                {/* Krótka informacja RODO */}
                <div className={styles.rodoBanner}>
                    <p>
                        <strong>Dane osobowe:</strong> Podane dane będą przetwarzane wyłącznie w celu realizacji sprzedaży i kontaktu.
                    </p>
                    <p>Sprzedaż okazjonalna zgodna z obowiązującymi przepisami prawa.</p>
                </div>

                {/* Podsumowanie */}
                {formData.deliveryMethod && (
                    <OrderSummarySection orderSummary={orderSummary} />
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
                            {formData.deliveryMethod
                                ? `Złóż zamówienie - ${orderSummary.formattedTotalPrice}`
                                : 'Wybierz metodę dostawy'
                            }
                        </>
                    )}
                </button>
            </form>

            {/* Przycisk powrotu na dole */}
            <div className={styles.successActions}>
                <button onClick={handleGoHome} className={styles.homeButton}>
                    Powrót do strony głównej
                </button>
            </div>
        </div>
    );
}
