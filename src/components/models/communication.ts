import { IProductFromApi, IOrderRequest,  IOrderResponse, IApi} from "../../types/index.ts";

export class Communication {
    api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getItems(): Promise<IProductFromApi> {
        return this.api.get("/product/");
    }

    postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post("/order/", orderData);
    }
}
