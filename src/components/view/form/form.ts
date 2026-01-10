import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface FormData {
    errors: string;
}

export abstract class Form<T> extends Component<T & FormData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>(
            "button[type=submit]",
            this.container
        );
        this.errorsElement = ensureElement<HTMLElement>(
            ".form__errors",
            this.container
        );
        this.submitButton.addEventListener("click", (e) => {
            e.preventDefault();
        });
    }

    isallowedButton(value: boolean) {
        this.submitButton.disabled = value;
    }

    set errors(item: string) {
        this.errorsElement.textContent = item;
    }
}
