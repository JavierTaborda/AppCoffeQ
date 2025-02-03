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