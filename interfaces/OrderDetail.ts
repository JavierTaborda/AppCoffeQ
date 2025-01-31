export interface OrderDetail {
    idOrderDetail: number;
    idOrder: number;
    idProduct: number;
    quantity: number;
    subtotal: number;
    isPaid: boolean;
    productName: string;
    date: string;
    datePaid: string;
}