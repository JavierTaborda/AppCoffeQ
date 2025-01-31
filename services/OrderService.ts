import { Order } from "@/interfaces/Order";
import { OrderDetail } from "@/interfaces/OrderDetail";
import { api } from "@/services/api"; 

export async function getOrder(idOrder:number ): Promise<Order[]> { 
    try {
        const response = await api.get(`/orders/${idOrder}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function getOrdersCustomer(idCustomer:number ): Promise<Order[]> {
    try {
        const response = await api.get(`/orders/customer/${idCustomer}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export async function createOrder(order: Order): Promise<Order> {
    try {
        const response = await api.post('/orders', order);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Order;
    }
}

export async function createOrderDetail(order: Order): Promise<OrderDetail> {
    try {
        const response = await api.post('/orders/detail', order);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as OrderDetail;
    }
}
export async function updateOrder(order: Order): Promise<Order> {
    try {
        const response = await api.put('/orders', order);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Order;
    }
}
export async function deleteOrder(idOrder: number): Promise<boolean> {  
    try {
        await api.delete(`/orders/${idOrder}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}