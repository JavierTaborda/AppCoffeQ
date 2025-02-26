export interface Payment {
    idPayment: number;
    idOrder: number;
    date: string;
    amount: number;
    ref: string; 
    isApproved: boolean;
    customerName: string;
}