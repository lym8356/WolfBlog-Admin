import axios, { AxiosError, AxiosResponse } from "axios";
import { Category } from "../models/category";
import { User } from "../models/user";

// directly import store here will create circular import dependency errors
// use dependency injection
let store: any;
export const injectStore = (_store: any) => {
    store = _store;
}

// simulate production environment
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve,delay);
    })
}

axios.defaults.baseURL = "http://localhost:21777/api";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// append token if current user is logged in
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    // const token = JSON.parse(localStorage.getItem('jwtToken')!);
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {

})

// axios requeset helper
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Account = {
    login: (user: any) => requests.post<User>('/account/login', user),
    currentUser: () => requests.get<User>('/account/currentUser')
}

const Categories = {
    list: () => requests.get<Category[]>('/category')
}

const Tags = {

}

const agent = {
    Account,
    Categories,
    Tags
}

export default agent;