export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: "online" | "cash" | "";
    email: string;
    phone: string;
    address: string;
}

export type IProductFromApi = {
    total: number;
    items: IProduct[];
}

export type IOrderRequest = IBuyer & {
    items: string[];
    total: number;
};

type IOrderErrorResponse = {
    error: string;
};

type IOrderSuccessResponse = {
    id: string;
    total: number;
}

export type IOrderResponse =  IOrderSuccessResponse | IOrderErrorResponse;
