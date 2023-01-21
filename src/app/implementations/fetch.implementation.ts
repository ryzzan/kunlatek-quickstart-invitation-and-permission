import { IHttp, IHttpData, IHttpResponse } from "../interfaces/http.interface";

export class FetchImplementation implements IHttp {
    async get(data: IHttpData): Promise<IHttpResponse> {
        const response = await fetch(
            data.route,
            {
                method: 'GET',
                ...data.options,
            }
        );

        if (response.status === 204)
            return {
                message: 'No content',
                statusCode: 204,
            };

        const responseJson = await response.json();

        if (responseJson?.statusCode !== 200 && responseJson?.statusCode !== 201 && responseJson?.statusCode !== 601)
            throw new Error(responseJson?.logMessage);

        return responseJson;
    }

    async post(data: IHttpData): Promise<IHttpResponse> {
        const response = await fetch(
            data.route,
            {
                method: 'POST',
                body: data.body,
                ...data.options,
            }
        );

        if (response.status === 204)
            return {
                message: 'No content',
                statusCode: 204,
            };

        const responseJson = await response.json();

        if (responseJson?.statusCode !== 200 && responseJson?.statusCode !== 201)
            throw new Error(responseJson?.logMessage);

        return responseJson;
    }

    async put(data: IHttpData): Promise<IHttpResponse> {
        const response = await fetch(
            data.route,
            {
                method: 'PUT',
                body: data.body,
                ...data.options,
            }
        );

        if (response.status === 204)
            return {
                message: 'No content',
                statusCode: 204,
            };

        const responseJson = await response.json();

        if (responseJson?.statusCode !== 200 && responseJson?.statusCode !== 201)
            throw new Error(responseJson?.logMessage);

        return responseJson;
    }

    async delete(data: IHttpData): Promise<IHttpResponse> {
        const response = await fetch(
            data.route,
            {
                method: 'DELETE',
                ...data.options,
            }
        );

        if (response.status === 204)
            return {
                message: 'No content',
                statusCode: 204,
            };

        const responseJson = await response.json();

        if (responseJson?.statusCode !== 200 && responseJson?.statusCode !== 201)
            throw new Error(responseJson?.logMessage);

        return responseJson;
    }

}