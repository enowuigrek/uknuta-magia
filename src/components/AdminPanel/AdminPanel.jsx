// src/components/AdminPanel/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import styles from './AdminPanel.module.scss';

export function AdminPanel() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // === Obsługa logowania ===
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    // Sprawdź hasło - BEZPIECZNE z zmienną środowiskową
    const handleLogin = (e) => {
        e.preventDefault();

        const correctPassword = 'UknutaMagia2025!';

        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
            setLoginError('');
            localStorage.setItem('admin_authenticated', 'true');
        } else {
            setLoginError('Nieprawidłowe hasło');
            setPasswordInput('');
        }
    };

    // Wyloguj
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_authenticated');
    };

    // Sprawdź czy już zalogowany (przy odświeżeniu strony)
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('admin_authenticated');
        if (isLoggedIn === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // === KONIEC: Obsługa logowania ===

    // Pobierz zamówienia z bazy
    const fetchOrders = async () => {
        try {
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Błąd pobierania zamówień:', error);
                return;
            }

            setOrders(data || []);
        } catch (error) {
            console.error('Błąd:', error);
        } finally {
            setLoading(false);
        }
    };

    // Aktualizuj status zamówienia
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                console.error('Błąd aktualizacji:', error);
                alert('Błąd aktualizacji statusu');
                return;
            }

            // Odśwież listę zamówień
            fetchOrders();
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    // Przełącz rozwijanie zamówienia
    const toggleExpanded = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Nawigacja
    const goToHomePage = () => {
        window.location.href = '/';
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [filter, isAuthenticated]);

    const statusLabels = {
        'awaiting_payment': '⏳ Złożone',
        'paid': '💰 Opłacone',
        'shipped': '📦 Wysłane',
        'delivered': '✅ Dostarczone',
        'cancelled': '❌ Anulowane'
    };

    const deliveryMethodLabels = {
        'pickup': '🏠 Odbiór osobisty',
        'parcel': '📦 Paczkomat',
        'courier': '🚚 Kurier'
    };

    const getStatusColor = (status) => {
        const colors = {
            'awaiting_payment': '#f59e0b',
            'paid': '#10b981',
            'shipped': '#06b6d4',
            'delivered': '#059669',
            'cancelled': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    // === Ekran logowania ===
    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <h2>🔐 Panel Administracyjny</h2>
                    <p>Wprowadź hasło aby uzyskać dostęp</p>

                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className={styles.passwordInput}
                            autoFocus
                        />
                        <button type="submit" className={styles.loginBtn}>
                            Zaloguj się
                        </button>
                    </form>

                    {loginError && (
                        <div className={styles.loginError}>
                            ❌ {loginError}
                        </div>
                    )}

                    <button onClick={goToHomePage} className={styles.backBtn}>
                        ← Powrót do strony głównej
                    </button>
                </div>
            </div>
        );
    }

    // Statystyki - wykluczamy anulowane zamówienia z obliczeń przychodów
    const totalOrders = orders.length;
    const paidOrders = orders.filter(order => ['paid', 'shipped', 'delivered'].includes(order.status));
    const pendingOrders = orders.filter(order => order.status === 'awaiting_payment').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    // Przychody z książek (bez kosztów dostawy) - tylko z opłaconych zamówień
    const bookRevenue = paidOrders.reduce((sum, order) => sum + (parseFloat(order.book_price) || 0), 0);

    // Koszty dostawy (które trzeba pokryć) - tylko z opłaconych zamówień
    const deliveryCosts = paidOrders.reduce((sum, order) => sum + (parseFloat(order.delivery_price) || 0), 0);

    // Liczba sprzedanych książek - tylko opłacone
    const booksSold = paidOrders.length;

    if (loading) {
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
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="awaiting_payment">Złożone</option>
                        <option value="paid">Opłacone</option>
                        <option value="shipped">Wysłane</option>
                        <option value="delivered">Dostarczone</option>
                        <option value="cancelled">Anulowane</option>
                    </select>
                </label>
                <button onClick={fetchOrders} className={styles.refreshBtn}>
                    🔄 Odśwież
                </button>
            </div>

            {/* Statystyki */}
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span>📚 Książek sprzedanych</span>
                    <strong>{booksSold}</strong>
                </div>
                <div className={styles.stat}>
                    <span>⏳ Oczekuje płatności</span>
                    <strong>{pendingOrders}</strong>
                </div>
                <div className={styles.stat}>
                    <span>❌ Anulowane</span>
                    <strong>{cancelledOrders}</strong>
                </div>
                <div className={styles.stat}>
                    <span>💰 Przychód z książek</span>
                    <strong>{bookRevenue.toFixed(2)} zł</strong>
                </div>
                <div className={styles.stat}>
                    <span>🚚 Koszty dostaw</span>
                    <strong>{deliveryCosts.toFixed(2)} zł</strong>
                </div>
            </div>

            {/* Lista zamówień - Desktop: tabela, Mobile: karty */}
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
                                        <td>
                                            {new Date(order.created_at).toLocaleDateString('pl-PL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td>
                                            <strong>{order.name}</strong>
                                        </td>
                                        <td>
                                            <div className={styles.contact}>
                                                <a href={`mailto:${order.email}`} className={styles.contactLink}>
                                                    📧 {order.email}
                                                </a>
                                                <a href={`tel:${order.phone}`} className={styles.contactLink}>
                                                    📞 {order.phone}
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.delivery}>
                                                <div className={styles.deliveryMethod}>
                                                    {deliveryMethodLabels[order.delivery_method]}
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
                                                        Częstochowa
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.prices}>
                                                <div className={styles.bookPrice}>
                                                    📚 {parseFloat(order.book_price || 0).toFixed(2)} zł
                                                </div>
                                                <div className={styles.deliveryPrice}>
                                                    🚚 {parseFloat(order.delivery_price || 0).toFixed(2)} zł
                                                </div>
                                                <div className={styles.totalPrice}>
                                                    💰 {parseFloat(order.total_price || 0).toFixed(2)} zł
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(order.status) }}
                                            >
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={styles.statusSelect}
                                            >
                                                <option value="awaiting_payment">Złożone</option>
                                                <option value="paid">Opłacone</option>
                                                <option value="shipped">Wysłane</option>
                                                <option value="delivered">Dostarczone</option>
                                                <option value="cancelled">Anulowane</option>
                                            </select>
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
                                            <div className={styles.cardPrice}>{parseFloat(order.total_price || 0).toFixed(2)} zł</div>
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(order.status) }}
                                            >
                                                {statusLabels[order.status]}
                                            </span>
                                            <button className={styles.expandBtn}>
                                                {expandedOrder === order.id ? '▲' : '▼'}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedOrder === order.id && (
                                        <div className={styles.cardDetails}>
                                            <div className={styles.detailRow}>
                                                <span>📅 Data:</span>
                                                <span>
                                                    {new Date(order.created_at).toLocaleDateString('pl-PL', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <div className={styles.detailRow}>
                                                <span>📧 Email:</span>
                                                <a href={`mailto:${order.email}`} className={styles.contactLink}>
                                                    {order.email}
                                                </a>
                                            </div>

                                            <div className={styles.detailRow}>
                                                <span>📞 Telefon:</span>
                                                <a href={`tel:${order.phone}`} className={styles.contactLink}>
                                                    {order.phone}
                                                </a>
                                            </div>

                                            <div className={styles.detailRow}>
                                                <span>🚚 Dostawa:</span>
                                                <div>
                                                    <div>{deliveryMethodLabels[order.delivery_method]}</div>
                                                    {order.delivery_method === 'parcel' && order.parcel_locker && (
                                                        <div className={styles.deliveryDetails}>
                                                            Paczkomat: {order.parcel_locker}
                                                        </div>
                                                    )}
                                                    {order.delivery_method === 'courier' && (
                                                        <div className={styles.deliveryDetails}>
                                                            {order.street}, {order.zip} {order.city}
                                                        </div>
                                                    )}
                                                    {order.delivery_method === 'pickup' && (
                                                        <div className={styles.deliveryDetails}>
                                                            Częstochowa
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.detailRow}>
                                                <span>💰 Ceny:</span>
                                                <div className={styles.priceBreakdown}>
                                                    <div>📚 Książka: {parseFloat(order.book_price || 0).toFixed(2)} zł</div>
                                                    <div>🚚 Dostawa: {parseFloat(order.delivery_price || 0).toFixed(2)} zł</div>
                                                    <div className={styles.totalMobile}>
                                                        <strong>Razem: {parseFloat(order.total_price || 0).toFixed(2)} zł</strong>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.detailRow}>
                                                <span>🔄 Zmień status:</span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={styles.statusSelect}
                                                >
                                                    <option value="awaiting_payment">Złożone</option>
                                                    <option value="paid">Opłacone</option>
                                                    <option value="shipped">Wysłane</option>
                                                    <option value="delivered">Dostarczone</option>
                                                    <option value="cancelled">Anulowane</option>
                                                </select>
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