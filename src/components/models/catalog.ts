import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
    products: IProduct[];
    selectedProduct: IProduct | null;
    events: IEvents;

    constructor(events: IEvents) {
        this.products = [];
        this.selectedProduct = null;
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:setProducts')
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct;
        this.events.emit('catalog:setSelectedProduct')
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
