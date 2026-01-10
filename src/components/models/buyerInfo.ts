import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

type ErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class BuyerInfo {
    payment: "online" | "cash" | "";
    email: string;
    phone: string;
    address: string;
    events: IEvents;

    constructor(events: IEvents) {
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
        this.events = events;
    }

    setPayment(payment: "online" | "cash" | ""): void {
        this.payment = payment;
        this.events.emit('buyer:changePayment')
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changeEmail')
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changePhone')
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changeAddress')
    }

    getBuyerInfo(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    deleteBuyerInfo(): void {
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
        this.events.emit('buyer:clear')
    }

    validateBuyerInfo(): ErrorsBuyer {
        const errors: ErrorsBuyer = {};

        if (!this.payment) {
            errors.payment = "Не указан вид оплаты";
        }

        if (!this.email) {
            errors.email = "Введите емэйл";
        }

        if (!this.phone) {
            errors.phone = "Введите номер телефона";
        }

        if (!this.address) {
            errors.address = "Укажите адрес";
        }

        return errors;
    }
}
