import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ModalData {
    content: HTMLElement;
}

export class ModalWindow extends Component<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected modalContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>(
            ".modal__close",
            this.container
        );
        this.modalContainer = ensureElement<HTMLElement>(
            ".modal__content",
            this.container
        );
        this.closeButton.addEventListener("click", () =>
            this.events.emit("modal:close")
        );
        this.container.addEventListener("click", (e) => {
            if (e.target === this.container) {
                this.events.emit("modal:close");
            }
        });
    }

    set content(item: HTMLElement) {
        this.modalContainer.replaceChildren(item);
        this.open();
    }

    open(): void {
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
    }
}
