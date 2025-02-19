import api from "./api";
import {Customer} from "../interfaces/Customer";

export async function getCustomers(): Promise<Customer[]> {
    try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCustomer(idCustomer:number ): Promise<Customer[]> {
    try {
        const response = await api.get(`/customers/${idCustomer}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function createCustomer(customer: Customer): Promise<Customer> {
    try {
        const response = await api.post('/customers', customer);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Customer;
    }
}
 export async function updateCustomer(customer: Customer): Promise<Customer> {
    try {
        const response = await api.put('/customers', customer);
        return response.data;
    } catch (error) {
        console.error(error);
        return {} as Customer;
    }   
}
export async function deleteCustomer(idCustomer: number): Promise<boolean> {  
    try {
        await api.delete(`/customers/${idCustomer}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}