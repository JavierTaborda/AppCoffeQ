import { Product } from "@/interfaces/Product";
import { getProductsExample, getProductByIdExample } from "@/data/example";


export function getProducts(): Product[] {
    //api call
   return getProductsExample();
}

export function getProductById(id: number): Product | undefined {
  return getProductByIdExample(id);
}

export function addProduct(product: Product): Promise<Product> {
  // Simula una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = { ...product, idProduct: Math.floor(Math.random() * 1000) };
      resolve(newProduct);
    }, 1000);
  });
}

export function updateProduct(product: Product): Promise<Product> {
  // Simula una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(product);
    }, 1000);
  });
}

export function deleteProduct(id: number): Promise<boolean> {
  // Simula una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}