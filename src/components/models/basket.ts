import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    productsToBuy: IProduct[];
    events: IEvents;

    constructor(events: IEvents) {
        this.productsToBuy = [];
        this.events = events;
    }

    getProductsToBuy(): IProduct[] {
        return this.productsToBuy;
    }

    addProductsToBuy(product: IProduct): void {
        const isItemInBasket = this.isProductInBasket(product.id);
        if (!isItemInBasket) {
            this.productsToBuy.push(product);
            this.events.emit("basket:change");
        }
    }

    deleteProductsToBuy(product: IProduct): void {
        this.productsToBuy = this.productsToBuy.filter(
            (item) => item !== product
        );
        this.events.emit("basket:change");
    }

    clearBusket(): void {
        this.productsToBuy = [];
        this.events.emit("basket:clear");
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

    isProductInBasket(id: string): boolean {
        let isItemInBasket = this.productsToBuy.find(
            (product) => product.id === id
        );
        if (isItemInBasket) {
            return true;
        }
        return false;
    }
}
