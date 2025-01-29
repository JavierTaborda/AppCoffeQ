import { Product } from "@/interfaces/Product";
import { getProductsExample, getProductByIdExample } from "@/data/example";


export function getProducts(): Product[] {
    //api call
   return getProductsExample();
}

export function getProductById(id: number): Product | undefined {
  return getProductByIdExample(id);
}