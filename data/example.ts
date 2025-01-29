import { Customer} from '../interfaces/Customer';
import { Order} from '../interfaces/Order';
import { OrderDetail} from '../interfaces/OrderDetail';
import { Payment} from '../interfaces/Payment';
import { Product} from '../interfaces/Product';

// Datos simulados
const customers: Customer[] = [
  { id: 1, name: "Carlos Pérez", email: "carlos.perez@example.com", password: "securePass123!", isActive: true },
  { id: 2, name: "Maria Gomez", email: "maria.gomez@example.com", password: "password99!", isActive: true },
  { id: 3, name: "Juan Rodríguez", email: "juan.rodriguez@example.com", password: "myPass@123", isActive: false }
];

const orders: Order[] = [
  { id: 1, customerId: 1, date: "2025-01-28", total: 50.0 },
  { id: 2, customerId: 2, date: "2025-01-27", total: 75.0 },
  { id: 3, customerId: 3, date: "2025-01-26", total: 100.0 }
];

const orderDetails: OrderDetail[] = [
  { id: 1, orderId: 1, productId: 1, quantity: 2, subtotal: 20.0 },
  { id: 2, orderId: 2, productId: 2, quantity: 3, subtotal: 45.0 },
  { id: 3, orderId: 3, productId: 3, quantity: 1, subtotal: 35.0 }
];

const payments: Payment[] = [
  { id: 1, orderId: 1, date: "2025-01-28", amount: 50.0 },
  { id: 2, orderId: 2, date: "2025-01-27", amount: 75.0 },
  { id: 3, orderId: 3, date: "2025-01-26", amount: 100.0 }
];

const products: Product[] = [
  { id: 1, name: "Café Espresso", description: "Un espresso fuerte y con sabor intenso.", price: 10.0,
     image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/espresso.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9lc3ByZXNzby5qcGciLCJpYXQiOjE3MzgxNzYwNjAsImV4cCI6MTc2OTcxMjA2MH0.CUl8svImD5swhPHGpAd8Gqx5u0mgkH23VPw08u-DKnU", isActive: true },
  { id: 2, name: "Café Capuccino", description: "Un capuccino con espuma fina y cremoso.", price: 15.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/capuccino.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9jYXB1Y2Npbm8uanBnIiwiaWF0IjoxNzM4MTc1OTU0LCJleHAiOjE3Njk3MTE5NTR9.PQKZAm4FJPK4Y0T3WNrInEmNuaXG8tKtlErpit0dNUI", isActive: true },
  { id: 3, name: "Café Latte", description: "Un latte suave y delicioso.", price: 12.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/latte.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9sYXR0ZS5qcGciLCJpYXQiOjE3MzgxNzYwODAsImV4cCI6MTc2OTcxMjA4MH0.GNNaFVumhyAe8AbXGF9B0u4gG2FKEoIZZPb3_eIPxDQ", isActive: true },
  { id: 4, name: "Mocha", description: "Un mocha con chocolate y café.", price: 18.0, image: "https://xmqupxdpsqppwxsflhxx.supabase.co/storage/v1/object/sign/CaffeQ/product/mocha.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDYWZmZVEvcHJvZHVjdC9tb2NoYS5qcGciLCJpYXQiOjE3MzgxNzYwOTIsImV4cCI6MTc2OTcxMjA5Mn0.BAF2AswfCAzG0vvaURqAJ_C4TW5xzNEC8yqvyTjzV5M", isActive: false }
];

// Funciones de API simulada
export function getCustomersExample(): Customer[] {
  return customers;
}

export function getCustomerByIdExample(id: number): Customer | undefined {
  return customers.find(customer => customer.id === id);
}

export function getOrdersExample(): Order[] {
  return orders;
}

export function getOrderByIdExample(id: number): Order | undefined {
  return orders.find(order => order.id === id);
}

export function getOrderDetailsExample(): OrderDetail[] {
  return orderDetails;
}

export function getOrderDetailByIdExample(id: number): OrderDetail | undefined {
  return orderDetails.find(detail => detail.id === id);
}

export function getPaymentsExample(): Payment[] {
  return payments;
}

export function getPaymentByIdExample(id: number): Payment | undefined {
  return payments.find(payment => payment.id === id);
}

export function getProductsExample(): Product[] {
  return products;
}

export function getProductByIdExample(id: number): Product | undefined {
  return products.find(product => product.id === id);
}