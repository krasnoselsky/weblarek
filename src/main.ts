import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog.ts";
import { Basket } from "./components/models/basket.ts";
import { BuyerInfo } from "./components/models/buyerInfo.ts";
import { Communication } from "./components/models/communication.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { Header } from "./components/view/header.ts";
import { Gallery } from "./components/view/gallery.ts";
import { ModalWindow } from "./components/view/modalWindow.ts";
import { OrderSuccess } from "./components/view/orderSuccess.ts";
import { BasketModal } from "./components/view/basketModal.ts";
import { ProductInBasket } from "./components/view/productCards/productInBasket.ts";
import { ProductInGallery } from "./components/view/productCards/productInGallery.ts";
import { ProductPreview } from "./components/view/productCards/productPreview.ts";
import { EmailPhoneForm } from "./components/view/form/emailPhoneForm.ts";
import { PaymentAddressForm } from "./components/view/form/paymentAddressForm.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { ensureElement, cloneTemplate } from "./utils/utils.ts";
import { IProduct, IOrderRequest, IOrderResponse } from "./types/index.ts";

const events = new EventEmitter();

const productsModel = new Catalog(events);
const productsToBuyModel = new Basket(events);
const buyerInfoModel = new BuyerInfo(events);
const apiModel = new Communication(new Api(API_URL));

const headerView = new Header(ensureElement(".header"), events);
const galleryView = new Gallery(ensureElement(".page__wrapper"), events);
const modalWindowView = new ModalWindow(ensureElement(".modal"), events);
const basketModalView = new BasketModal(
    cloneTemplate<HTMLElement>("#basket"),
    events
);
const paymentAddressFormView = new PaymentAddressForm(
    cloneTemplate<HTMLElement>("#order"),
    events
);
const emailPhoneFormView = new EmailPhoneForm(
    cloneTemplate<HTMLElement>("#contacts"),
    events
);
const orderSuccessView = new OrderSuccess(
    cloneTemplate<HTMLElement>("#success"),
    events
);
const previewCardView = new ProductPreview(
        cloneTemplate<HTMLElement>("#card-preview"),
        events
    );

events.on("catalog:setProducts", () => {
    const products = productsModel.getProducts();

    const cards = products.map((product) => {
        const card = new ProductInGallery(cloneTemplate<HTMLTemplateElement>("#card-catalog"), {
            onClick: () => events.emit("product:select", product)
        });
        return card.render(product);
    });
    galleryView.gallery = cards;
});

events.on("basket:open", () => {
    if (productsToBuyModel.getQuantityProductsToBuy() === 0) {
        basketModalView.isregisterButtonAllowed(true);
    } else {
        basketModalView.isregisterButtonAllowed(false);
    }
    modalWindowView.content = basketModalView.render();
});

events.on("product:select", (product: IProduct) => {
    productsModel.setSelectedProduct(product);
});

events.on("catalog:setSelectedProduct", () => {
    const productSelected = productsModel.getSelectedProduct();
    if (!productSelected) return;
    const isInBusket = productsToBuyModel.isProductInBasket(productSelected.id);
    previewCardView.buttonText = isInBusket ? "Удалить из корзины" : "Купить";
    if (productSelected.price === null) {
        previewCardView.buttonText = "Недоступно";
        previewCardView.buttonProhibited(true);
    } else {
        previewCardView.buttonProhibited(false);
    }
    modalWindowView.content = previewCardView.render(productSelected);
});

events.on("product:choose", () => {
    const productToBuy = productsModel.getSelectedProduct();
    if (!productToBuy) return;
    const isInBusket = productsToBuyModel.isProductInBasket(productToBuy.id);
    if (isInBusket) {
        productsToBuyModel.deleteProductsToBuy(productToBuy);
    } else {
        productsToBuyModel.addProductsToBuy(productToBuy);
    }
    modalWindowView.close();
});

events.on("product:delete", (product: IProduct) => {
    const productToDelete = productsModel.getProductById(product.id);
    if (!productToDelete) return;
    productsToBuyModel.deleteProductsToBuy(productToDelete);
});

events.on("basket:change", () => {
    
    const products = productsToBuyModel.getProductsToBuy();
    
    const arrProducts = products.map((product, index) => {
        const productToBuy = productsModel.getProductById(product.id);
        const basketCard = new ProductInBasket(cloneTemplate<HTMLElement>("#card-basket"), {
            onClick: () => events.emit("product:delete", product)
        });
        basketCard.index = index + 1; 
        return basketCard.render(productToBuy);
    });
    
   
    const basketCounter = productsToBuyModel.getQuantityProductsToBuy();
    const totalPrice = productsToBuyModel.getCostProductsToBuy();
    
    
    headerView.counter = basketCounter;
    basketModalView.totalPrice = totalPrice;
    basketModalView.item = arrProducts;
    basketModalView.isregisterButtonAllowed(basketCounter === 0);
});



events.on("busket:submit", () => {
    modalWindowView.content = paymentAddressFormView.render();
});

events.on("payment:online", () => {
    buyerInfoModel.setPayment("online");
});

events.on("payment:cash", () => {
    buyerInfoModel.setPayment("cash");
});

function updatePaymentAddressForm() {
    const buyerData = buyerInfoModel.getBuyerInfo();
    paymentAddressFormView.payment = buyerData.payment;
    paymentAddressFormView.address = buyerData.address;
    const errors = buyerInfoModel.validateBuyerInfo();
    
    let validate: string = "";
    if (errors.payment && errors.address) {
        validate = `${errors.address}; ${errors.payment}`;
    } else if (errors.address) {
        validate = `${errors.address}`;
    } else if (errors.payment) {
        validate = `${errors.payment}`;
    }
    
    paymentAddressFormView.errors = validate;
    if (!errors.payment && !errors.address) {
        paymentAddressFormView.isallowedButton(false);
    } else {
        paymentAddressFormView.isallowedButton(true);
    }
}

function updateEmailPhoneForm() {
    const buyerData = buyerInfoModel.getBuyerInfo();
    emailPhoneFormView.email = buyerData.email;
    emailPhoneFormView.phone = buyerData.phone;
    const errors = buyerInfoModel.validateBuyerInfo();
    
    let validate: string = "";
    if (errors.phone && errors.email) {
        validate = `${errors.email}; ${errors.phone}`;
    } else if (errors.phone) {
        validate = `${errors.phone}`;
    } else if (errors.email) {
        validate = `${errors.email}`;
    }
    
    emailPhoneFormView.errors = validate;
    if (!errors.phone && !errors.email) {
        emailPhoneFormView.isallowedButton(false);
    } else {
        emailPhoneFormView.isallowedButton(true);
    }
}


function updateAllForms() {
    updatePaymentAddressForm();
    updateEmailPhoneForm();
}
events.on("buyer:changePayment", () => {
    updatePaymentAddressForm();
});
events.on("buyer:changeAddress", () => {
    updatePaymentAddressForm();
});
events.on("buyer:changeEmail", () => {
    updateEmailPhoneForm();
});
events.on("buyer:changePhone", () => {
    updateEmailPhoneForm();
});
events.on("buyer:clear", () => {
    updateAllForms();
});
events.on("address:input", (data: { value: string }) => {
    buyerInfoModel.setAddress(data.value);
});

events.on("order:submit", () => {
    modalWindowView.content = emailPhoneFormView.render();
});
events.on("email:input", (data: { value: string }) => {
    buyerInfoModel.setEmail(data.value);
});
events.on("phone:input", (data: { value: string }) => {
    buyerInfoModel.setPhone(data.value);
});


events.on("contacts:submit", async () => {
    const buyerInfo = buyerInfoModel.getBuyerInfo();
    const sum = productsToBuyModel.getCostProductsToBuy();
    const products = productsToBuyModel.getProductsToBuy();
    const ids = products.map((elem) => elem.id);
    const orderRequest: IOrderRequest = {
        payment: buyerInfo.payment,
        email: buyerInfo.email,
        address: buyerInfo.address,
        phone: buyerInfo.phone,
        total: sum,
        items: ids,
    };
    try {
        const response = await apiModel.postOrder(orderRequest);

        productsToBuyModel.clearBusket();
        buyerInfoModel.deleteBuyerInfo();
        orderSuccessView.totalSum = response.total;
        modalWindowView.content = orderSuccessView.render();
        
    
        
    } catch (error) {
        console.error(error);
    }  
});


events.on("modal:close", () => {
    modalWindowView.close();
});


async function fetchCatalog() {
    try {
        const response = await apiModel.getItems();
        productsModel.setProducts(response.items);
    } catch(error) {
        console.log(error);
    }
}

fetchCatalog();


