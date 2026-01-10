import { IProduct } from "../../types";

export class Catalog {
    products: IProduct[];
    selectedProduct: IProduct | null;

    constructor() {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }
    getProducts(): IProduct[] {
        return this.products;
    }
    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }
    setSelectedProduct(selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct;
    }
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
