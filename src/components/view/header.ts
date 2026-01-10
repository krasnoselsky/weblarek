import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface HeaderData {
    counter: number;
}

export class Header extends Component<HeaderData> {
    protected busketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.busketButton = ensureElement<HTMLButtonElement>(
            ".header__basket",
            this.container
        );
        this.counterElement = ensureElement<HTMLElement>(
            ".header__basket-counter",
            this.container
        );
        this.busketButton.addEventListener("click", () => {
            this.events.emit("basket:open");
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}
