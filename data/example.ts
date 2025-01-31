import { Customer } from '../interfaces/Customer';
import { Order } from '../interfaces/Order';
import { OrderDetail } from '../interfaces/OrderDetail';
import { Payment } from '../interfaces/Payment';
import { Product } from '../interfaces/Product';

// Datos simulados
const customers: Customer[] = [
  { idCustomer: 1, name: "Carlos Pérez", email: "carlos.perez@example.com",   cedula: "1234567890", phone: "0987654321"},
  { idCustomer: 2, name: "Maria Gomez", email: "maria.gomez@example.com",  cedula: "1234567890", phone: "0987654321"},
  { idCustomer: 3, name: "Juan Rodríguez", email: "juan.rodriguez@example.com", cedula: "1234567890", phone: "0987654321"}
];

const orders: Order[] = [
  { idOrder: 1, idCustomer: 1, date: "2025-01-28", total: 50.0  , customerName: "Carlos Pérez", orderDetails: [] },
  { idOrder: 2, idCustomer: 2, date: "2025-01-27", total: 75.0  , customerName: "Maria Gomez", orderDetails: [] },
  { idOrder: 3, idCustomer: 3, date: "2025-01-26", total: 100.0 , customerName: "Juan Rodríguez", orderDetails: [] }
];

const orderDetails: OrderDetail[] = [
  { idOrderDetail: 1, idOrder: 1, idProduct: 1, quantity: 2, subtotal: 20.0, isPaid: true, productName: "Café Espresso", date: "2025-01-28", datePaid: "2025-01-28" },
  { idOrderDetail: 2, idOrder: 2, idProduct: 2, quantity: 3, subtotal: 45.0, isPaid: true, productName: "Café Capuccino", date: "2025-01-28", datePaid: "2025-01-28" },
  { idOrderDetail: 3, idOrder: 3, idProduct: 3, quantity: 1, subtotal: 35.0, isPaid: true, productName: "Café Latte", date: "2025-01-28", datePaid: "2025-01-28" },
];

const payments: Payment[] = [
  { idPayment: 1, idOrder: 1, date: "2025-01-28", amount: 50.0, ref: "000000" },
  { idPayment: 2, idOrder: 2, date: "2025-01-27", amount: 75.0, ref: "000000" },
  { idPayment: 3, idOrder: 3, date: "2025-01-26", amount: 100.0, ref: "000000" }
];

const products: Product[] = [
  { idProduct: 1, name: "Café Espresso", description: "Un espresso fuerte y con sabor intenso.", price: 10.0,
     image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/espresso.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9lc3ByZXNzby5qcGciLCJpYXQiOjE3MzgxNzYwNjAsImV4cCI6MTc2OTcxMjA2MH0.CUl8svImD5swhPHGpAd8Gqx5u0mgkH23VPw08u-DKnU", isActive: true , stock: 10 },
  { idProduct: 2, name: "Café Capuccino", description: "Un capuccino con espuma fina y cremoso.", price: 15.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/capuccino.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9jYXB1Y2Npbm8uanBnIiwiaWF0IjoxNzM4MTc1OTU0LCJleHAiOjE3Njk3MTE5NTR9.PQKZAm4FJPK4Y0T3WNrInEmNuaXG8tKtlErpit0dNUI", isActive: true , stock: 10 ,},
  { idProduct: 3, name: "Café Latte", description: "Un latte suave y delicioso.", price: 12.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/latte.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9sYXR0ZS5qcGciLCJpYXQiOjE3MzgxNzYwODAsImV4cCI6MTc2OTcxMjA4MH0.GNNaFVumhyAe8AbXGF9B0u4gG2FKEoIZZPb3_eIPxDQ", isActive: true, stock: 10 , },
  { idProduct: 4, name: "Mocha", description: "Un mocha con chocolate y café.", price: 18.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/mocha.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9tb2NoYS5qcGciLCJpYXQiOjE3MzgxNzYwOTIsImV4cCI6MTc2OTcxMjA5Mn0.BAF2AswfCAzG0vvaURqAJ_C4TW5xzNEC8yqvyTjzV5M", isActive: false , stock: 10 ,}
];

// Funciones de API simulada
export function getCustomersExample(): Customer[] {
  return customers;
}

export function getCustomerByIdExample(id: number): Customer | undefined {
  return customers.find(customer => customer.idCustomer === id);
}

export function getOrdersExample(): Order[] {
  return orders;
}

export function getOrderByIdExample(id: number): Order | undefined {
  return orders.find(order => order.idOrder === id);
}

export function getOrderDetailsExample(): OrderDetail[] {
  return orderDetails;
}

export function getOrderDetailByIdExample(id: number): OrderDetail | undefined {
  return orderDetails.find(detail => detail.idOrderDetail === id);
}

export function getPaymentsExample(): Payment[] {
  return payments;
}

export function getPaymentByIdExample(id: number): Payment | undefined {
  return payments.find(payment => payment.idPayment === id);
}

export function getProductsExample(): Product[] {
  return products;
}

export function getProductByIdExample(id: number): Product | undefined {
  return products.find(product => product.idProduct === id);
}