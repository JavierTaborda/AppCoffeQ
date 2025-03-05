import { OrderDetail } from './OrderDetail';
export interface Order {
    idOrder: number;
    idCustomer: number;
    date: string;
    total: number;
    customerName: string;
    orderDetailsDTO: OrderDetail[];
}