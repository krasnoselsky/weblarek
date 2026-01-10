import { IProduct } from "../../types";

export class Basket {
    productsToBuy: IProduct[];

    constructor() {
        this.productsToBuy = [];
    }

    getProductsToBuy(): IProduct[] {
        return this.productsToBuy;
    }

    addProductsToBuy(product: IProduct): void {
        const isItemInBasket = this.isProductInBasket(product.id);
        if (!isItemInBasket) {
            this.productsToBuy.push(product);
        }
    }

    deleteProductsToBuy(product: IProduct): void {
        this.productsToBuy = this.productsToBuy.filter(
            (item) => item !== product
        );
    }

    clearBusket(): void {
        this.productsToBuy = [];
    }

    getCostProductsToBuy(): number {
        let sum = 0;
        for (let i = 0; i < this.productsToBuy.length; i++) {
            let price = this.productsToBuy[i].price;
            if (price) {
                sum += price;
            }
        }
        return sum;
    }

    getQuantityProductsToBuy(): number {
        return this.productsToBuy.length;
    }

    protected isProductInBasket(id: string): boolean {
        let isItemInBasket = this.productsToBuy.find(
            (product) => product.id === id
        );
        if (isItemInBasket) {
            return true;
        }
        return false;
    }
}
