import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface OrderSuccessData {
    totalSum: number;
}

export class OrderSuccess extends Component<OrderSuccessData> {
    protected totalSumElement: HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.totalSumElement = ensureElement<HTMLElement>(
            ".order-success__description",
            this.container
        );
        this.successButton = ensureElement<HTMLButtonElement>(
            ".order-success__close",
            this.container
        );
        this.successButton.addEventListener("click", () => {
            this.events.emit("modal:close");
        });
    }

    set totalSum(value: number) {
        this.totalSumElement.textContent = `Списано ${value} синапсов`;
    }
}
