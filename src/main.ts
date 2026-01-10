import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog.ts";
import { Basket } from "./components/models/basket.ts";
import { BuyerInfo } from "./components/models/buyerInfo.ts";
import { apiProducts } from "./utils/data.ts";
import { Communication } from "./components/models/communication.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";

//Проверка работы Каталога:
const productsModel = new Catalog();

productsModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProducts());

console.log(
    "Получение товара по ID: ",
    productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")
);

productsModel.setSelectedProduct(apiProducts.items[2]);
console.log("Выбранный товар: ", productsModel.getSelectedProduct());

//Проверка работы Корзины:
const productsToBuyModel = new Basket();
console.log("Товары в корзине: ", productsToBuyModel.getProductsToBuy());

productsToBuyModel.addProductsToBuy(apiProducts.items[3]);
productsToBuyModel.addProductsToBuy(apiProducts.items[0]);
productsToBuyModel.addProductsToBuy(apiProducts.items[2]);
console.log(
    "Товары в корзине после добавления: ",
    productsToBuyModel.getProductsToBuy()
);

productsToBuyModel.addProductsToBuy(apiProducts.items[3]);
console.log(
    "Товары в корзине после повторного добавления: ",
    productsToBuyModel.getProductsToBuy()
);

productsToBuyModel.deleteProductsToBuy(apiProducts.items[1]);
console.log(
    "Товары в корзине после попытки удалить товар, которого там нет: ",
    productsToBuyModel.getProductsToBuy()
);

productsToBuyModel.deleteProductsToBuy(apiProducts.items[3]);
console.log(
    "Товары в корзине после удаления товара: ",
    productsToBuyModel.getProductsToBuy()
);

console.log(
    "Сумма стоимостей всех товаров в корзине: ",
    productsToBuyModel.getCostProductsToBuy()
);

console.log(
    "Количество товаров в корзине: ",
    productsToBuyModel.getQuantityProductsToBuy()
);

productsToBuyModel.clearBusket();
console.log(
    "Товары в корзине после очистки корзины: ",
    productsToBuyModel.getProductsToBuy()
);

/*
isProductInBasket является встроенным методом, который используется только внутри класса, а не вызывается напрямую, поэтому его не проверяем
*/

//Проверка работы Информации о покупателе:
const buyerInfoModel = new BuyerInfo();

buyerInfoModel.setPayment("online");
buyerInfoModel.setEmail("gggg@mail.ru");
buyerInfoModel.setPhone("89403947722");
buyerInfoModel.setAddress("г. Боровичи, ул. Пушкина, д. 10");
console.log("Информация о пользователе: ", buyerInfoModel.getBuyerInfo());

buyerInfoModel.deleteBuyerInfo();
console.log(
    "Информация о пользователе после очистки: ",
    buyerInfoModel.getBuyerInfo()
);

buyerInfoModel.setEmail("gggg@mail.ru");
buyerInfoModel.setAddress("г. Боровичи, ул. Пушкина, д. 10");
console.log(
    "Валидация полученной информации: ",
    buyerInfoModel.validateBuyerInfo()
);

buyerInfoModel.deleteBuyerInfo();
buyerInfoModel.setPayment("online");
buyerInfoModel.setPhone("89403947722");
console.log(
    "Валидация полученной информации №2: ",
    buyerInfoModel.validateBuyerInfo()
);

buyerInfoModel.setEmail("gggg@mail.ru");
buyerInfoModel.setAddress("г. Боровичи, ул. Пушкина, д. 10");
console.log(
    "Валидация полученной информации №3: ",
    buyerInfoModel.validateBuyerInfo()
);

buyerInfoModel.deleteBuyerInfo();
console.log(
    "Валидация полученной информации №4: ",
    buyerInfoModel.validateBuyerInfo()
);

//Проверка работы связи с API:
async function fetchCatalog() {
    const apiModel = new Communication(new Api(API_URL));
    const response = await apiModel.getItems();
    productsModel.setProducts(response.items);
    console.log(
        "Массив товаров из каталога через API: ",
        productsModel.getProducts()
    );
}

fetchCatalog();
