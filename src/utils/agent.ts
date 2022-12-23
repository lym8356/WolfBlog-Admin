import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Article, ArticleFormValues } from "../models/Article";
import { Category, CategoryFormValues } from "../models/category";
import { Tag, TagFormValues } from "../models/tag";
import { User, UserFormValues } from "../models/user";

// directly import store here will create circular import dependency errors
// use dependency injection
let store: any;
export const injectStore = (_store: any) => {
    store = _store;
}

// simulate production environment
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

function createFormData(item: any) {
    let formData = new FormData();
}

axios.defaults.baseURL = "http://localhost:21777/api";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// append token if current user is logged in
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(500);
    console.log('fetching from server...')
    return response;
}, (error: AxiosError) => {
    // handle errors here
    const { data, status }: { data: any, status: number } = error.response!;
    switch (status) {
        case 400:
            if (typeof data === 'string') toast.error(data);
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('Guest account is not allowed to make changes');
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

// axios requeset helper
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Account = {
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    currentUser: () => requests.get<User>('/account/currentUser')
}

const Categories = {
    list: () => requests.get<Category[]>('/category'),
    create: (category: CategoryFormValues) => requests.post<Category>('/category', category),
    update: (category: CategoryFormValues) => requests.put<void>(`/category/${category.id}`, category),
    delete: (id: number) => requests.del<void>(`/category/${id}`)
}

const Tags = {
    list: () => requests.get<Tag[]>('/tag'),
    create: (tag: TagFormValues) => requests.post<Tag>('/tag', tag),
    update: (tag: TagFormValues) => requests.put<void>(`/tag/${tag.id}`, tag),
    delete: (id: number) => requests.del<void>(`/tag/${id}`)
}

const Articles = {
    list: () => requests.get<Article[]>('/article'),
    details: (id: string) => requests.get<Article>(`/article/${id}`),
    create: (article: ArticleFormValues) => requests.post<Article>('/article', article),
    update: (article: ArticleFormValues) => requests.put<Article>(`/article/${article.id}`, article),
    delete: (id: string) => requests.del<void>(`/Article/${id}`)
}


const agent = {
    Account,
    Categories,
    Tags,
    Articles
}

export default agent;