import { IHttp } from "../interfaces/http.interface";
import { FetchImplementation } from "./fetch.implementation";

const Http: IHttp = new FetchImplementation();

export {
    Http,
};
