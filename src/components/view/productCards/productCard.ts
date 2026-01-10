import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

interface ProductCardData {
    title: string;
    price: number | null;
}

export abstract class ProductCard<T> extends Component<T & ProductCardData> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>(
            ".card__title",
            this.container
        );
        this.priceElement = ensureElement<HTMLElement>(
            ".card__price",
            this.container
        );
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = `${value} синапсов`;
        if (value === null) {
            this.priceElement.textContent = "Бесценно";
        }
    }
}
