import { ensureElement } from "../../../utils/utils";
import { ProductCard } from "./productCard";
import { categoryMap } from "../../../utils/constants";
import { CDN_URL } from "../../../utils/constants";
import { ICardActions } from "../../../types";

interface ProductInGalleryData {
    category: string;
    image: string;
}

export class ProductInGallery extends ProductCard<ProductInGalleryData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container
        );
        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container
        );
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = "card__category";
        const categoryClass = Object.entries(categoryMap).find(
            ([key]) => key === value
        );
        if (categoryClass) {
            this.categoryElement.classList.add(`${categoryClass?.[1]}`);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }
}
