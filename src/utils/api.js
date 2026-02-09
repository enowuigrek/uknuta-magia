import { supabase } from '../config/supabase.js';
import { prepareOrderPrices } from './priceCalculations.js';

// === OPERACJE NA ZAMÓWIENIACH ===

export const saveOrderToDatabase = async (orderData) => {
    try {
        const quantity = orderData.quantity || 1;
        const prices = prepareOrderPrices(orderData.deliveryMethod, quantity);

        const orderRecord = {
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            street: orderData.street || null,
            zip: orderData.zip || null,
            city: orderData.city || null,
            delivery_method: orderData.deliveryMethod,
            parcel_locker: orderData.parcelLocker || null,
            pickup_location: orderData.pickupLocation || null,
            ...prices,
            status: 'awaiting_payment'
        };

        const { data, error } = await supabase
            .from('orders')
            .insert([orderRecord])
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

export const fetchOrders = async (filter = 'all') => {
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
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Błąd:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            console.error('Błąd aktualizacji:', error);
            throw error;
        }

        console.log(`Status zamówienia ${orderId} zmieniony na: ${newStatus}`);
        return true;
    } catch (error) {
        console.error('Błąd podczas aktualizacji statusu:', error);
        throw error;
    }
};

// === FUNKCJE POMOCNICZE ===

export const getOrderById = async (orderId) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (error) {
            console.error('Błąd pobierania zamówienia:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Błąd:', error);
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error('Błąd usuwania zamówienia:', error);
            throw error;
        }

        console.log(`Zamówienie ${orderId} zostało usunięte`);
        return true;
    } catch (error) {
        console.error('Błąd podczas usuwania zamówienia:', error);
        throw error;
    }
};

// === STATYSTYKI ===

export const getOrdersStatistics = async () => {
    try {
        const { count, error } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Błąd pobierania statystyk:', error);
            throw error;
        }

        return count;
    } catch (error) {
        console.error('Błąd:', error);
        throw error;
    }
};

// === REAL-TIME SUBSCRIPTIONS ===

export const subscribeToOrders = (callback) => {
    return supabase
        .channel('orders')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'orders'
            },
            callback
        )
        .subscribe();
};

export const unsubscribeFromOrders = (subscription) => {
    return supabase.removeChannel(subscription);
};