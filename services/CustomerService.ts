import api from "./api";
import {Customer} from "../interfaces/Customer";

export async function getCustomers(): Promise<Customer[]> {
    try {
        const response = await api.get('/customer');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCustomer(text:string ): Promise<Customer> {
    try {
        const response = await api.get(`/customer/${text}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Customer;
    }
}
export async function createCustomer(customer: Customer): Promise<Customer> {
    try {
        const response = await api.post('/customer', customer);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Customer;
    }
}
 export async function updateCustomer(customer: Customer): Promise<Customer> {
    try {
        const response = await api.put('/customer', customer);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Customer;
    }   
}
export async function deleteCustomer(idCustomer: number): Promise<boolean> {  
    try {
        await api.delete(`/customer/${idCustomer}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}