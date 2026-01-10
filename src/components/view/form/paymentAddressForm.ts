import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface PaymentAddressFormData {
    payment: "online" | "cash" | "";
    address: string;
}

export class PaymentAddressForm extends Form<PaymentAddressFormData> {
    protected paymentOnlineButton: HTMLButtonElement;
    protected paymentCashButton: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.paymentOnlineButton = ensureElement<HTMLButtonElement>(
            "button[name=card]",
            this.container
        );
        this.paymentCashButton = ensureElement<HTMLButtonElement>(
            "button[name=cash]",
            this.container
        );
        this.addressInputElement = ensureElement<HTMLInputElement>(
            "input[name=address]",
            this.container
        );
        this.paymentOnlineButton.addEventListener("click", () => {
            this.events.emit("payment:online");
        });
        this.paymentCashButton.addEventListener("click", () => {
            this.events.emit("payment:cash");
        });
        this.addressInputElement.addEventListener("input", () => {
            this.events.emit("address:input", {
                value: this.addressInputElement.value,
            });
        });
        this.submitButton.addEventListener("click", () => {
            this.events.emit("order:submit");
        });
    }

    set payment(value: "online" | "cash" | "") {
        this.paymentCashButton.classList.toggle("button_alt-active", value === "cash"); 
        this.paymentOnlineButton.classList.toggle("button_alt-active", value === "online");
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }
}
