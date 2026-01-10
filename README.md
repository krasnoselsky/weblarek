https://github.com/krasnoselsky/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

-   src/ — исходные файлы проекта
-   src/components/ — папка с JS компонентами
-   src/components/base/ — папка с базовым кодом

Важные файлы:

-   index.html — HTML-файл главной страницы
-   src/types/index.ts — файл с типами
-   src/main.ts — точка входа приложения
-   src/scss/styles.scss — корневой файл стилей
-   src/utils/constants.ts — файл с константами
-   src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются две сущности, которые описывают данные, — товар и покупатель. Их можно описать такими интерфейсами:

1. Товар

```
interface IProduct {
  id: string; // - уникальный идентификатор каждого товара
  description: string; // - описание, дополнительные сведения для каждого товара
  image: string; // - иллюстрация каждого товара в качестве изображения
  title: string; // - название каждого товара
  category: string; // - категория, группа, к которой относится каждый товар
  price: number | null; // - цена каждого товара, которая может быть установлена или не установлена
}
```

2. Покупатель

```
interface IBuyer {
  payment: 'online' | 'cash' | ''; // - способ оплаты (онлайн | при получении)
  email: string; // - email покупателя
  phone: string; // - номер телефона покупателя
  address: string; // - адрес покупателя
}
```

## Модели данных

Для учёта данных в приложении были созданы три класса, которые разделены между собой по смыслу и зонам ответственности:

#### Класс Catalog

Хранит товары, которые представлены в виде каталога/списка для покупки в приложении

Конструктор:  
`constructor(events: IEvents) {this.products = []; this.selectedProduct = null; this.events = events;}`

Поля класса:  
`products: IProduct[];`- хранит массив всех товаров;
`selectedProduct: IProduct | null;`- хранит товар, выбранный для подробного отображения;
`events: IEvents;` - хранит список событий, которые могут быть инициированы.

Методы класса:
`setProducts(products: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода;
`getProducts(): IProduct[]` - получение массива товаров из модели;
`getProductById(id: string): IProduct | undefined` - получение одного товара по его id;
`setSelectedProduct(selectedProduct: IProduct): void` - сохранение товара для подробного отображения;
`getSelectedProduct(): IProduct` - получение товара для подробного отображения.

#### Класс Basket

Хранит список товаров, которые пользователь выбрал для покупки (корзина)

Конструктор:  
`constructor(events: IEvents) {this.productsToBuy = []; this.events = events;}`

Поля класса:
`productsToBuy: IProduct[];` - хранит массив товаров, выбранных покупателем для покупки;
`events: IEvents;` - хранит список событий, которые могут быть инициированы.

Методы класса:
`getProductsToBuy(): IProduct[]` - получение массива товаров, которые находятся в корзине;
`addProductsToBuy(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины;
`deleteProductsToBuy(product: IProduct): void` - удаление товара, полученного в параметре из массива корзины;
`clearBusket(): void` - очистка корзины;
`getCostProductsToBuy(): number` - получение стоимости всех товаров в корзине;
`getQuantityProductsToBuy(): number` - получение количества товаров в корзине;
`isProductInBasket(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Класс BuyerInfo

Хранит данные о самом покупателе, указанные им при оформлении заказа

Конструктор:

```
constructor(events: IEvents) {
  this.payment = '';
  this.email = '';
  this.phone = '';
  this.address = '';
  this.events = events;
}
```

Поля класса:
`payment: 'online' | 'cash' | '';` - способ оплаты (онлайн | при получении);
`email: string;` - email покупателя;
`phone: string;` - номер телефона покупателя;
`address: string;` - адрес покупателя;
`events: IEvents;` - хранит список событий, которые могут быть инициированы.

Методы класса:
`setPayment(payment: 'online' | 'cash' | ''): void` - сохранение выбранного способа оплаты;
`setEmail(email: string): void`- сохранение email пользователя;
`setPhone(phone: string): void` - сохранение номера телефона пользователя;
`setAddress(address: string): void` - сохранение адреса пользователя;
`getBuyerInfo(): IBuyer` - получение всех данных покупателя;
`deleteBuyerInfo(): void` - очистка данных покупателя;
Для валидации понадобится отдельный тип: `type ErrorsBuyer = Partial<Record<keyof IBuyer, string>>;`, который получает объединение всех ключей интерфейса IBuyer, создаёт объектный тип, где каждый из этих ключей имеет тип string, делает все поля необязательными.
`validateBuyerInfo(): ErrorsBuyer` - валидация данных.

## Слой коммуникации

#### Класс Communication

Этот класс использует композицию, хранит внутри себя экземпляр класса Api, чтобы выполнить запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров.

Конструктор:  
`constructor(api: IApi) {this.api = api;}`

Поля класса:
`api: IApi;` - объект, соответствующий интерфейсу IApi и использующий методы get и post.

Методы класса:
`getItems(): Promise<IProductFromApi>` - получение с сервера объекта с массивом товаров;
`postOrder(orderData: IOrderRequest): Promise<IOrderResponse>` - отправка на сервер данных о покупателе и выбранных товарах.

## Слой Представления

#### Класс Header

Отображение шапки сайта и состояния корзины.

Интерфейс, используемый классом:

```
interface HeaderData {
  counter: number;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.busketButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.counterElement = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`busketButton: HTMLButtonElement` - кнопка открытия корзины;
`counterElement: HTMLElement` - счетчик количества товаров в корзине.

Методы класса:
`set counter(value: number)` - обновляет видимое количество товаров в корзине.

#### Класс Gallery

Отображение списка карточеск на странице.

Интерфейс, используемый классом:

```
interface GalleryData {
  gallery: HTMLElement[];
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.galleryElement = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`galleryElement: HTMLElement` - контейнер для карточек товаров на странице.

Методы класса:
`set gallery(items: HTMLElement[])` - обновляет отображаемые карточки товаров на странице.

#### Класс ModalWindow

Отображает и скрывает модальное окно.

Интерфейс, используемый классом:

```
interface ModalData {
  content: HTMLElement;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.closeButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.modalContainer = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна;
`modalContainer: HTMLElement` - контейнер для контента модального окна.

Методы класса:
`set content(item: HTMLElement)` - обновляет контент отображаемый в контейнере модального окна;
`open():void` - открывает модальное окно;
`close():void` - закрывает модальное окно.

#### Класс OrderSuccess

Отображает окно успешного оформления заказа(вставляется в контейнер модального окна).

Интерфейс, используемый классом:

```
interface OrderSuccessData {
  totalSum: number;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.totalSumElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.successButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер);}`

Поля класса:
`totalSumElement: HTMLElement` - итоговая стоимость всех товаров;
`successButton: HTMLButtonElement` - кнопка закрытия модального окна.

Методы класса:
`set totalSum(value: number)` - обновляет итоговую стоимость купленных товаров.

#### Родительский класс ProductCard

Базовый класс для используемых карточек товаров, отображает общие поля и методы, используемые в них.

Интерфейс, используемый классом:

```
interface ProductCardData {
  title: string;
  price: number | null;
}
```

Конструктор:
`constructor(container: HTMLElement) {this.titleElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.priceElement = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`titleElement: HTMLElement` - название товара;
`priceElement: HTMLElement` - стоимость товара.

Методы класса:
`set title(value: string)` - устанавливает название товара в карточке;
`set price(value: number | null)` - устанавливает стоимость товара в карточке.

#### Класс ProductInGallery(наследует ProductCard)

Отображает карточку товара в каталоге.

Интерфейс, используемый классом:

```
interface ProductInGalleryData {
  category: string;
  image: string;
}
```

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions) {this.categoryElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.imageElement = ensureElement<HTMLImageElement>('класс элемента', контейнер);}`

Поля класса:
`categoryElement: HTMLElement` - категория товара;
`imageElement: HTMLImageElement` - изображение товара.

Методы класса:
`set category(value: string)` - устанавливает категорию товара в карточке;
`set image(value: string)` - устанавливает изображение товара в карточке.

#### Класс ProductPreview(наследует ProductCard)

Предпросмотр товара(вставляется в контейнер модального окна).

Интерфейс, используемый классом:

```
interface ProductPreviewData {
  category: string;
  description: string;
  image: string;
  buttonText: string;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.categoryElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.descriptionElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.cardButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.imageElement = ensureElement<HTMLImageElement>('класс элемента', контейнер);}`

Поля класса:
`categoryElement: HTMLElement` - категория товара;
`descriptionElement: HTMLElement` - описание товара;
`cardButton: HTMLButtonElement` - кнопка добавления товара в корзину;
`imageElement: HTMLImageElement` - изображение товара.

Методы класса:
`set category(value: string)` - устанавливает категорию товара в карточке;
`set description(value: string)` - устанавливает описание товара в карточке;
`set image(value: string)` - устанавливает изображение товара в карточке;
`set buttonText(value: string)` - устанавливает текст кнопки в карточке товара;
`buttonProhibited(value: boolean)` - делает кнопку разрешенной(запрещенной) для нажатия, если товар доступен(не доступен) к покупке.

#### Класс ProductInBasket(наследует ProductCard)

Карточка товара, которая вставляется в корзину с товарами.

Интерфейс, используемый классом:

```
interface ProductInBasketData {
  index: number;
}
```

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions) {this.productIndexElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.deleteButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер);}`

Поля класса:
`productIndexElement: HTMLElement` - порядковый номер товара в корзине;
`deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины.

Методы класса:
`set index(value: number)` - устанавливает номер товара в корзине.

#### Класс BasketModal

Отвечает за отображение корзины(вставляется в контейнер модального окна).

Интерфейс, используемый классом:

```
interface BasketModalData {
  item: HTMLElement[];
  totalPrice: number;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.listElement = ensureElement<HTMLElement>('класс элемента', контейнер); this.registerButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.totalPriceElement = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`listElement: HTMLElement` - список товаров к покупке;
`registerButton: HTMLButtonElement` - кнопка начала оформления заказа;
`totalPriceElement: HTMLElement` - общая сумма заказа.

Методы класса:
`set item(items: HTMLElement[])` - обновляет список товаров в корзине;
`set totalPrice(value: number)` - обновляет общую сумму заказа;
`isregisterButtonAllowed(value: boolean)` - делает кнопку разрешенной(запрещенной) для нажатия после того, как товары для покупки выбраны и добавлены в корзину(товаров не в корзине, корзина пуста).

#### Родительский класс Form

Базовый класс для всех форм, отображает общие поля и методы, используемые в них.

Интерфейс, используемый классом:

```
interface FormData {
  errors: string;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.submitButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.errorsElement = ensureElement<HTMLElement>('класс элемента', контейнер);}`

Поля класса:
`submitButton: HTMLButtonElement` - кнопка отправки формы;
`errorsElement: HTMLElement` - список ошибок формы.

Методы класса:
`set errors(item: string)` - отображает ошибки валидации;
`isallowedButton(value: boolean)` - делает кнопку разрешенной(запрещенной) для нажатия после того, как все поля заполнены(не заполнены).

#### Класс PaymentAddressForm(наследует Form)

Форма выбора способа оплаты и адреса(вставляется в контейнер модального окна).

Интерфейс, используемый классом:

```
interface PaymentAddressFormData {
  payment: "online" | "cash" | "";
  address: string;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.paymentOnlineButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.paymentCashButton = ensureElement<HTMLButtonElement>('класс элемента', контейнер); this.addressInputElement = ensureElement<HTMLInputElement>('класс элемента', контейнер);}`

Поля класса:
`paymentOnlineButton: HTMLButtonElement` - кнопка выбора оплаты онлайн;
`paymentCashButton: HTMLButtonElement` - кнопка выбора оплаты при получении;
`addressInputElement: HTMLInputElement` - поле ввода адреса.

Методы класса:
`set payment(value: "online" | "cash" | "")` - устанавливает способ оплаты;
`set address(value: string)` - устанавливает адрес доставки.

#### Класс EmailPhoneForm(наследует Form)

Форма ввода почты и телефона(вставляется в контейнер модального окна).

Интерфейс, используемый классом:

```
interface EmailPhoneFormData {
  email: string;
  phone: string;
}
```

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents) {this.emailInputElement = ensureElement<HTMLInputElement>('класс элемента', контейнер); this.phoneInputElement = ensureElement<HTMLInputElement>('класс элемента', контейнер);}`

Поля класса:
`emailInputElement: HTMLInputElement` - поле ввода почты;
`phoneInputElement: HTMLInputElement` - поле ввода телефона.

Методы класса:
`set email(value: string)` - устанавливает почту покупателя;
`set phone(value: string)` - устанавливает телефон покупателя.

## Генерируемые события(View)

`basket:open` - уведомление: пользователь нажал на иконку корзины;
`modal:close` - уведомление: пользователь нажал на кнопку закрытия корзины или кликнул вне модального окна;
`orderSucces:close` - уведомление: пользователь нажал на кнопку успешного завершения оформления заказа;
`product:select` - уведомление: пользователь нажал на карточку товара в каталоге;
`product:choose` - уведомление: пользователь нажал на кнопку добавления в корзину товара;
`product:delete` - уведомление: пользователь нажал на кнопку удаления товара из корзины;
`busket:submit` - уведомление: пользователь нажал на кнопку "Оформить" заказ;
`order:submit` - уведомление: пользователь нажал на кнопку продолжения оформления заказа;
`contacts:submit` - уведомление: пользователь нажал на кнопку "Оплатить";
`payment:online` - уведомление: пользователь нажал на кнопку оплаты онлайн;
`payment:cash` - уведомление: пользователь нажал на кнопку оплаты при получении;
`address:input` - уведомление: пользователь ввел адрес;
`email:input` - уведомление: пользователь ввел email;
`phone:input` - уведомление: пользователь ввел телефон;

## Генерируемые события(Models)

`catalog:setProducts` - уведомление: необходимо установить список товаров в каталоге;
`catalog:setSelectedProduct` - уведомление: необходимо установить выбранный пользователем товар;
`basket:change` - уведомление: необходимо изменить корзину;
`basket:clear` - уведомление: необходимо очистить содержимое корзины;
`buyer:changePayment` - уведомление: необходимо изменить способ оплаты;
`buyer:changeEmail` - уведомление: необходимо изменить email;
`buyer:changePhone` - уведомление: необходимо изменить телефон;
`buyer:changeAddress` - уведомление: необходимо изменить адрес;
`buyer:clear` - уведомление: необходимо очистить введенные пользователем данные;

## Презентер

Так как у приложения только одна страница, достаточно одного презентера, который будет отвечать за логику работы этой страницы. Выносить код «Презентера» в отдельный класс необязательно. Логика следующая, пример:

1. Пользователь нажимает на кнопку выбора продукта из каталога.
2. Презентер слушает событие `product:select`, вызывает метод Модели `setSelectedProduct()`, чтобы она внесла в свои данные выбор пользователя.
3. Метод Модели `setSelectedProduct()` вызывает событие `catalog:setSelectedProduct`. Презентер слушает его. Вызывает в Представлении отрисовку модального окна с выбранным товаром.
4. Пользователь нажимает на кнопку добавления(удаления) товара в корзину(из корзины).
5. Презентер слушает событие `product:choose` в зависимости от ситуации вызывает или `deleteProductsToBuy()`, или `addProductsToBuy()`. Предположим, что товара в корзине нет, тогда вызывается метод Модели `addProductsToBuy()`.
6. Метод Модели `addProductsToBuy()` эмитит событие `basket:change`. Презентер слушает его, передает инструкции Представлению: необходимо отрисовать этот товар в корзине, отрисовать его порядковый номер, отрисовать итоговую стоимость товаров(т.к. произошло изменение данных), отрисовать счетчик в шапке страницы.