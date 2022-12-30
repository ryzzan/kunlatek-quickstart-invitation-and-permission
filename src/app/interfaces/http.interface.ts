export interface IHttpData {
    route: string,
    body?: any,
    options?: any,
}

export interface IHttpResponse {
    message: string,
    statusCode: number,
    data?: {},
    tokens?: {},
}

export interface IHttp {
    get(data: IHttpData): Promise<IHttpResponse>
    post(data: IHttpData): Promise<IHttpResponse>
    put(data: IHttpData): Promise<IHttpResponse>
    delete(data: IHttpData): Promise<IHttpResponse>
}