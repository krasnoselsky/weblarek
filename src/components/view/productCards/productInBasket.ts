import { ensureElement } from "../../../utils/utils";
import { ProductCard } from "./productCard";
import { ICardActions } from "../../../types";

interface ProductInBasketData {
    index: number;
}

export class ProductInBasket extends ProductCard<ProductInBasketData> {
    protected productIndexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.productIndexElement = ensureElement<HTMLElement>(
            ".basket__item-index",
            this.container
        );
        this.deleteButton = ensureElement<HTMLButtonElement>(
            ".basket__item-delete",
            this.container
        );
        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.productIndexElement.textContent = String(value);
    }
}
