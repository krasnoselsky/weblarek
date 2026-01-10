import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface EmailPhoneFormData {
    email: string;
    phone: string;
}

export class EmailPhoneForm extends Form<EmailPhoneFormData> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.emailInputElement = ensureElement<HTMLInputElement>(
            "input[name=email]",
            this.container
        );
        this.phoneInputElement = ensureElement<HTMLInputElement>(
            "input[name=phone]",
            this.container
        );
        this.emailInputElement.addEventListener("input", () => {
            this.events.emit("email:input", {
                value: this.emailInputElement.value,
            });
        });
        this.phoneInputElement.addEventListener("input", () => {
            this.events.emit("phone:input", {
                value: this.phoneInputElement.value,
            });
        });
        this.submitButton.addEventListener("click", () => {
            this.events.emit("contacts:submit");
        });
    }

    set email(value: string) {
        this.emailInputElement.value = value;
    }

    set phone(value: string) {
        this.phoneInputElement.value = value;
    }
}
