import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useOrders, useOrderStats } from '../../hooks/useOrders.js';
import { ORDER_STATUSES, DELIVERY_METHOD_LABELS, PICKUP_LOCATIONS } from '../../utils/constants.js';
import { formatDateTime, getStatusColor, getStatusLabel, formatDeliveryMethod } from '../../utils/formatters.js';
import styles from './AdminPanel.module.scss';

function LoginScreen({ onLogin, passwordInput, onPasswordChange, loginError, onGoHome }) {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2>Panel Administracyjny</h2>
                <p>Wprowadź hasło aby uzyskać dostęp</p>

                <form onSubmit={onLogin} className={styles.loginForm}>
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={passwordInput}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className={styles.passwordInput}
                        autoFocus
                    />
                    <button type="submit" className={styles.loginBtn}>
                        Zaloguj się
                    </button>
                </form>

                {loginError && (
                    <div className={styles.loginError}>
                        {loginError}
                    </div>
                )}

                <button onClick={onGoHome} className={styles.backBtn}>
                    ← Powrót do strony głównej
                </button>
            </div>
        </div>
    );
}

function OrderStatusSelect({ value, onChange }) {
    return (
        <select value={value} onChange={onChange} className={styles.statusSelect}>
            {Object.entries(ORDER_STATUSES).map(([key, status]) => (
                <option key={key} value={key}>{status.label.replace(/^[^\w]*\s/, '')}</option>
            ))}
        </select>
    );
}

function DeliveryInfo({ order }) {
    return (
        <div className={styles.delivery}>
            <div className={styles.deliveryMethod}>
                {DELIVERY_METHOD_LABELS[order.delivery_method]}
            </div>
            {order.delivery_method === 'parcel' && order.parcel_locker && (
                <div className={styles.deliveryDetails}>
                    {order.parcel_locker}
                </div>
            )}
            {order.delivery_method === 'courier' && (
                <div className={styles.deliveryDetails}>
                    {order.street}, {order.zip} {order.city}
                </div>
            )}
            {order.delivery_method === 'pickup' && (
                <div className={styles.deliveryDetails}>
                    {PICKUP_LOCATIONS[order.pickup_location] || 'Odbiór osobisty'}
                </div>
            )}
        </div>
    );
}

function PriceInfo({ order }) {
    const quantity = order.quantity || 1;
    return (
        <div className={styles.prices}>
            <div className={styles.bookPrice}>
                {quantity > 1 && <span className={styles.quantityBadge}>×{quantity}</span>}
                {parseFloat(order.books_total_price || order.book_price || 0).toFixed(2)} zł
            </div>
            <div className={styles.deliveryPrice}>
                {parseFloat(order.delivery_price || 0).toFixed(2)} zł
            </div>
            <div className={styles.totalPrice}>
                {parseFloat(order.total_price || 0).toFixed(2)} zł
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <span
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(status) }}
        >
            {getStatusLabel(status)}
        </span>
    );
}

export function AdminPanel() {
    const {
        isAuthenticated,
        isLoading: authLoading,
        passwordInput,
        loginError,
        handleLogin,
        handleLogout,
        updatePassword
    } = useAuth();

    const {
        orders,
        loading: ordersLoading,
        filter,
        changeFilter,
        refreshOrders,
        updateOrderStatus
    } = useOrders();

    const stats = useOrderStats(orders);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const goToHomePage = () => {
        window.location.href = '/';
    };

    const toggleExpanded = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const success = await updateOrderStatus(orderId, newStatus);
        if (!success) {
            alert('Błąd aktualizacji statusu');
        }
    };

    if (authLoading) {
        return <div className={styles.loading}>Ładowanie...</div>;
    }

    if (!isAuthenticated) {
        return (
            <LoginScreen
                onLogin={handleLogin}
                passwordInput={passwordInput}
                onPasswordChange={updatePassword}
                loginError={loginError}
                onGoHome={goToHomePage}
            />
        );
    }

    if (ordersLoading) {
        return <div className={styles.loading}>Ładowanie zamówień...</div>;
    }

    return (
        <div className={styles.adminPanel}>
            {/* Header z nawigacją */}
            <div className={styles.header}>
                <h1>Panel Administracyjny</h1>
                <div className={styles.headerButtons}>
                    <button onClick={goToHomePage} className={styles.homeBtn}>
                        <span>🏠</span>
                        Strona główna
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <span>🚪</span>
                        Wyloguj
                    </button>
                </div>
            </div>

            {/* Filtry */}
            <div className={styles.filters}>
                <label>
                    Filtruj po statusie:
                    <select value={filter} onChange={(e) => changeFilter(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        {Object.entries(ORDER_STATUSES).map(([key, status]) => (
                            <option key={key} value={key}>
                                {status.label.replace(/^[^\w]*\s/, '')}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={refreshOrders} className={styles.refreshBtn}>
                    Odśwież
                </button>
            </div>

            {/* Statystyki */}
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span>Książek sprzedanych</span>
                    <strong>{stats.booksSold}</strong>
                </div>
                <div className={styles.stat}>
                    <span>Oczekuje płatności</span>
                    <strong>{stats.pendingOrders}</strong>
                </div>
                <div className={styles.stat}>
                    <span>Anulowane</span>
                    <strong>{stats.cancelledOrders}</strong>
                </div>
                <div className={styles.stat}>
                    <span>Przychód z książek</span>
                    <strong>{stats.bookRevenue.toFixed(2)} zł</strong>
                </div>
                <div className={styles.stat}>
                    <span>Koszty dostaw</span>
                    <strong>{stats.deliveryCosts.toFixed(2)} zł</strong>
                </div>
            </div>

            {/* Lista zamówień */}
            <div className={styles.ordersSection}>
                {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>📦</span>
                        <p>Brak zamówień do wyświetlenia</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className={styles.desktopTable}>
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Klient</th>
                                    <th>Kontakt</th>
                                    <th>Ilość</th>
                                    <th>Dostawa</th>
                                    <th>Ceny</th>
                                    <th>Status</th>
                                    <th>Akcje</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{formatDateTime(order.created_at)}</td>
                                        <td><strong>{order.name}</strong></td>
                                        <td>
                                            <div className={styles.contact}>
                                                <a href={`mailto:${order.email}`} className={styles.contactLink}>
                                                    {order.email}
                                                </a>
                                                <a href={`tel:${order.phone}`} className={styles.contactLink}>
                                                    {order.phone}
                                                </a>
                                            </div>
                                        </td>
                                        <td className={styles.quantityCell}>{order.quantity || 1}</td>
                                        <td><DeliveryInfo order={order} /></td>
                                        <td><PriceInfo order={order} /></td>
                                        <td><StatusBadge status={order.status} /></td>
                                        <td>
                                            <OrderStatusSelect
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className={styles.mobileCards}>
                            {orders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div
                                        className={styles.cardHeader}
                                        onClick={() => toggleExpanded(order.id)}
                                    >
                                        <div className={styles.cardMain}>
                                            <div className={styles.cardId}>#{order.id}</div>
                                            <div className={styles.cardCustomer}>{order.name}</div>
                                            <div className={styles.cardPrice}>
                                                {parseFloat(order.total_price || 0).toFixed(2)} zł
                                            </div>
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <StatusBadge status={order.status} />
                                            <button className={styles.expandBtn}>
                                                {expandedOrder === order.id ? '▲' : '▼'}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedOrder === order.id && (
                                        <div className={styles.cardDetails}>
                                            <div className={styles.detailRow}>
                                                <span>Data:</span>
                                                <span>{formatDateTime(order.created_at)}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Ilość książek:</span>
                                                <span className={styles.quantityValue}>{order.quantity || 1}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Email:</span>
                                                <a href={`mailto:${order.email}`} className={styles.contactLink}>
                                                    {order.email}
                                                </a>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Telefon:</span>
                                                <a href={`tel:${order.phone}`} className={styles.contactLink}>
                                                    {order.phone}
                                                </a>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Dostawa:</span>
                                                <DeliveryInfo order={order} />
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Ceny:</span>
                                                <div className={styles.priceBreakdown}>
                                                    <div>
                                                        Książki{(order.quantity || 1) > 1 && ` (×${order.quantity})`}: {parseFloat(order.books_total_price || order.book_price || 0).toFixed(2)} zł
                                                    </div>
                                                    <div>Dostawa: {parseFloat(order.delivery_price || 0).toFixed(2)} zł</div>
                                                    <div className={styles.totalMobile}>
                                                        <strong>Razem: {parseFloat(order.total_price || 0).toFixed(2)} zł</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Zmień status:</span>
                                                <OrderStatusSelect
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
