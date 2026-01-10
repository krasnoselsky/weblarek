import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface BasketModalData {
    item: HTMLElement[];
    totalPrice: number;
}

export class BasketModal extends Component<BasketModalData> {
    protected listElement: HTMLElement;
    protected registerButton: HTMLButtonElement;
    protected totalPriceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>(
            ".basket__list",
            this.container
        );
        this.registerButton = ensureElement<HTMLButtonElement>(
            ".basket__button",
            this.container
        );
        this.totalPriceElement = ensureElement<HTMLElement>(
            ".basket__price",
            this.container
        );
        this.registerButton.addEventListener("click", () => {
            this.events.emit("busket:submit");
        });
    }

    set item(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    set totalPrice(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }
    
    isregisterButtonAllowed(value: boolean) {
        this.registerButton.disabled = value;
    }
}
