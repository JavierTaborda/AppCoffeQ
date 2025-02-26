import { Payment } from "@/interfaces/Payment";
import { Order } from "@/interfaces/Order";
import { api } from "@/services/api"; 

export async function getPaymentOrder(idOrder:number ): Promise<Payment[]>
{
  try {
        const response = await api.get(`/payment/order/${idOrder}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
} 
export async function getPayments( ): Promise<Payment[]>
{
  try {
        const response = await api.get(`/payment`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
} 
export async function getPayment(idPayment:number ): Promise<Payment[]>
{
  try {
        const response = await api.get(`/payment/${idPayment}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
} 
export async function createPayment(payment: Payment): Promise<Payment> {
    try {
        const response = await api.post('/payment', payment);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Payment;
    }
}
export async function updatePayment(payment: Payment): Promise<Payment> {
    try {
        const response = await api.put('/payment', payment);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Payment;
    }
}

export async function deletePayment(idPayment: number): Promise<boolean> {  
    try {
        await api.delete(`/payment/${idPayment}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
