import { useState, useEffect } from 'react';
import { supabase } from "../../config/supabase";
import styles from './AdminPanel.module.scss';

export function AdminPanel() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const statusLabels = {
        'new': 'Nowe',
        'email_sent': 'Email wysłany',
        'awaiting_payment': 'Oczekuje płatności',
        'paid': 'Opłacone',
        'shipped': 'Wysłane',
        'delivered': 'Dostarczone',
        'cancelled': 'Anulowane',
        'error': 'Błąd'
    };

    const getStatusColor = (status) => {
        const colors = {
            'new': '#3b82f6',
            'email_sent': '#8b5cf6',
            'awaiting_payment': '#f59e0b',
            'paid': '#10b981',
            'shipped': '#06b6d4',
            'delivered': '#059669',
            'cancelled': '#ef4444',
            'error': '#dc2626'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return <div className={styles.loading}>Ładowanie zamówień...</div>;
    }

    return (
        <div className={styles.adminPanel}>
            <h1>Panel Administracyjny - Zamówienia</h1>

            <div className={styles.filters}>
                <label>
                    Filtruj po statusie:
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="new">Nowe</option>
                        <option value="email_sent">Email wysłany</option>
                        <option value="awaiting_payment">Oczekuje płatności</option>
                        <option value="paid">Opłacone</option>
                        <option value="shipped">Wysłane</option>
                        <option value="delivered">Dostarczone</option>
                        <option value="cancelled">Anulowane</option>
                        <option value="error">Błąd</option>
                    </select>
                </label>
                <button onClick={fetchOrders} className={styles.refreshBtn}>
                    Odśwież
                </button>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span>Łącznie zamówień:</span>
                    <strong>{orders.length}</strong>
                </div>
            </div>

            <div className={styles.ordersTable}>
                {orders.length === 0 ? (
                    <p>Brak zamówień do wyświetlenia.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Klient</th>
                            <th>Email</th>
                            <th>Telefon</th>
                            <th>Adres</th>
                            <th>Paczkomat</th>
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
                                <td>{order.name}</td>
                                <td>{order.email}</td>
                                <td>{order.phone}</td>
                                <td>
                                    {order.street}<br/>
                                    {order.zip} {order.city}
                                </td>
                                <td>{order.parcel_locker}</td>
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
                                        <option value="new">Nowe</option>
                                        <option value="email_sent">Email wysłany</option>
                                        <option value="awaiting_payment">Oczekuje płatności</option>
                                        <option value="paid">Opłacone</option>
                                        <option value="shipped">Wysłane</option>
                                        <option value="delivered">Dostarczone</option>
                                        <option value="cancelled">Anulowane</option>
                                        <option value="error">Błąd</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}