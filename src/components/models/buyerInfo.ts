import { IBuyer } from "../../types";

type ErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class BuyerInfo {
    payment: "online" | "cash" | "";
    email: string;
    phone: string;
    address: string;

    constructor() {
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    setPayment(payment: "online" | "cash" | ""): void {
        this.payment = payment;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setAddress(address: string): void {
        this.address = address;
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
