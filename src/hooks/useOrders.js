import { useState, useEffect, useCallback } from 'react';
import {
    fetchOrders,
    updateOrderStatus as updateOrderStatusAPI,
    subscribeToOrders,
    unsubscribeFromOrders
} from '../utils/api.js';
import { calculateOrderStats } from '../utils/priceCalculations.js';

export const useOrders = (initialFilter = 'all') => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(initialFilter);

    // Pobierz zamówienia
    const loadOrders = useCallback(async (filterValue = filter) => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchOrders(filterValue);
            setOrders(data);
        } catch (err) {
            setError('Błąd podczas pobierania zamówień');
            console.error('Błąd pobierania zamówień:', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    // Aktualizuj status zamówienia
    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        try {
            await updateOrderStatusAPI(orderId, newStatus);

            // Zaktualizuj lokalny stan
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            return true;
        } catch (err) {
            setError('Błąd podczas aktualizacji statusu');
            console.error('Błąd aktualizacji statusu:', err);
            return false;
        }
    }, []);

    // Zmień filtr
    const changeFilter = useCallback((newFilter) => {
        setFilter(newFilter);
        loadOrders(newFilter);
    }, [loadOrders]);

    // Odśwież zamówienia
    const refreshOrders = useCallback(() => {
        loadOrders();
    }, [loadOrders]);

    // Załaduj zamówienia przy inicjalizacji
    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Real-time subscription (opcjonalne)
    useEffect(() => {
        const subscription = subscribeToOrders((payload) => {
            console.log('Real-time update:', payload);

            // Odśwież zamówienia po zmianie
            if (payload.eventType === 'INSERT' ||
                payload.eventType === 'UPDATE' ||
                payload.eventType === 'DELETE') {
                refreshOrders();
            }
        });

        return () => {
            unsubscribeFromOrders(subscription);
        };
    }, [refreshOrders]);

    return {
        orders,
        loading,
        error,
        filter,
        updateOrderStatus,
        changeFilter,
        refreshOrders,
        setError
    };
};

// Hook dla statystyk zamówień
export const useOrderStats = (orders) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        booksSold: 0,
        bookRevenue: 0,
        deliveryCosts: 0,
        totalRevenue: 0,
        paidOrdersCount: 0
    });

    useEffect(() => {
        if (orders && orders.length > 0) {
            const calculatedStats = calculateOrderStats(orders);
            setStats(calculatedStats);
        }
    }, [orders]);

    return stats;
};

// Hook dla pojedynczego zamówienia
export const useOrder = (orderId) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrder = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);

        try {
            const { getOrderById } = await import('../utils/api.js');
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (err) {
            setError('Błąd podczas pobierania zamówienia');
            console.error('Błąd pobierania zamówienia:', err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    const updateOrder = useCallback(async (newStatus) => {
        if (!order) return false;

        try {
            await updateOrderStatusAPI(order.id, newStatus);
            setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
            return true;
        } catch (err) {
            setError('Błąd podczas aktualizacji zamówienia');
            console.error('Błąd aktualizacji zamówienia:', err);
            return false;
        }
    }, [order]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    return {
        order,
        loading,
        error,
        updateOrder,
        refreshOrder: loadOrder
    };
};

// Hook dla filtrowania i sortowania
export const useOrderFilters = (orders) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredAndSortedOrders = useCallback(() => {
        let filtered = [...orders];

        // Filtruj po wyszukiwanej frazie
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toString().includes(searchTerm)
            );
        }

        // Filtruj po statusie
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Sortuj
        filtered.sort((a, b) => {
            let valueA = a[sortBy];
            let valueB = b[sortBy];

            // Specjalna obsługa dla dat
            if (sortBy === 'created_at') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            // Specjalna obsługa dla liczb
            if (sortBy === 'total_price' || sortBy === 'id') {
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
            }

            if (sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        return filtered;
    }, [orders, searchTerm, sortBy, sortOrder, statusFilter]);

    return {
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        statusFilter,
        setStatusFilter,
        filteredOrders: filteredAndSortedOrders()
    };
};