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
const galleryModel = new Gallery(ensureElement(".page__wrapper"), events);
const modalWindowModel = new ModalWindow(ensureElement(".modal"), events);
const basketModalModel = new BasketModal(
    cloneTemplate<HTMLElement>("#basket"),
    events
);
const paymentAddressFormModel = new PaymentAddressForm(
    cloneTemplate<HTMLElement>("#order"),
    events
);
const emailPhoneFormModel = new EmailPhoneForm(
    cloneTemplate<HTMLElement>("#contacts"),
    events
);
const orderSuccessModel = new OrderSuccess(
    cloneTemplate<HTMLElement>("#success"),
    events
);
const previewCard = new ProductPreview(
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
    galleryModel.gallery = cards;
});

events.on("basket:open", () => {
    if (productsToBuyModel.getQuantityProductsToBuy() === 0) {
        basketModalModel.isregisterButtonAllowed(true);
    } else {
        basketModalModel.isregisterButtonAllowed(false);
    }
    modalWindowModel.content = basketModalModel.render();
});

events.on("product:select", (product: IProduct) => {
    productsModel.setSelectedProduct(product);
});

events.on("catalog:setSelectedProduct", () => {
    const productSelected = productsModel.getSelectedProduct();
    if (!productSelected) return;
    const isInBusket = productsToBuyModel.isProductInBasket(productSelected.id);
    previewCard.buttonText = isInBusket ? "Удалить из корзины" : "Купить";
    if (productSelected.price === null) {
        previewCard.buttonText = "Недоступно";
        previewCard.buttonProhibited(true);
    } else {
        previewCard.buttonProhibited(false);
    }
    modalWindowModel.content = previewCard.render(productSelected);
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
    modalWindowModel.close();
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
    basketModalModel.totalPrice = totalPrice;
    basketModalModel.item = arrProducts;
    basketModalModel.isregisterButtonAllowed(basketCounter === 0);
});



events.on("busket:submit", () => {
    modalWindowModel.content = paymentAddressFormModel.render();
});

events.on("payment:online", () => {
    buyerInfoModel.setPayment("online");
});

events.on("payment:cash", () => {
    buyerInfoModel.setPayment("cash");
});

function updatePaymentAddressForm() {
    const buyerData = buyerInfoModel.getBuyerInfo();
    paymentAddressFormModel.payment = buyerData.payment;
    paymentAddressFormModel.address = buyerData.address;
    const errors = buyerInfoModel.validateBuyerInfo();
    
    let validate: string = "";
    if (errors.payment && errors.address) {
        validate = `${errors.address}; ${errors.payment}`;
    } else if (errors.address) {
        validate = `${errors.address}`;
    } else if (errors.payment) {
        validate = `${errors.payment}`;
    }
    
    paymentAddressFormModel.errors = validate;
    if (!errors.payment && !errors.address) {
        paymentAddressFormModel.isallowedButton(false);
    } else {
        paymentAddressFormModel.isallowedButton(true);
    }
}

function updateEmailPhoneForm() {
    const buyerData = buyerInfoModel.getBuyerInfo();
    emailPhoneFormModel.email = buyerData.email;
    emailPhoneFormModel.phone = buyerData.phone;
    const errors = buyerInfoModel.validateBuyerInfo();
    
    let validate: string = "";
    if (errors.phone && errors.email) {
        validate = `${errors.email}; ${errors.phone}`;
    } else if (errors.phone) {
        validate = `${errors.phone}`;
    } else if (errors.email) {
        validate = `${errors.email}`;
    }
    
    emailPhoneFormModel.errors = validate;
    if (!errors.phone && !errors.email) {
        emailPhoneFormModel.isallowedButton(false);
    } else {
        emailPhoneFormModel.isallowedButton(true);
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
    modalWindowModel.content = emailPhoneFormModel.render();
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
        orderSuccessModel.totalSum = response.total;
        modalWindowModel.content = orderSuccessModel.render();
        
    
        
    } catch (error) {
        console.error(error);
    }  
});


events.on("api:successPost", (response: IOrderResponse) => {
    productsToBuyModel.clearBusket();
    buyerInfoModel.deleteBuyerInfo();
    orderSuccessModel.totalSum = response.total;
    modalWindowModel.content = orderSuccessModel.render();
})




events.on("orderSucces:close", () => {
    modalWindowModel.close();
});

events.on("modal:close", () => {
    modalWindowModel.close();
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


